import { render, screen, fireEvent } from "@testing-library/react";
import { InlineFilters } from "@/components/app/inline-filters";
import { NextIntlClientProvider } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const messages = {
  productsPage: {
    priceRange: "Price Range",
    minPrice: "Min",
    maxPrice: "Max",
    categories: "Categories",
  },
};

describe("InlineFilters", () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  const mockProps = {
    categories: ["electronics", "jewelery", "men's clothing"],
    selectedCategories: [],
    minPrice: "",
    maxPrice: "",
  };

  const renderWithIntl = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it("renders categories button with popover", () => {
    renderWithIntl(<InlineFilters {...mockProps} />);
    const categoriesButton = screen.getByRole("button", {
      name: /categories/i,
    });
    expect(categoriesButton).toBeInTheDocument();
  });

  it("renders price range inputs", () => {
    renderWithIntl(<InlineFilters {...mockProps} />);
    expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
  });

  it("opens popover and shows all categories when button is clicked", async () => {
    renderWithIntl(<InlineFilters {...mockProps} />);
    const categoriesButton = screen.getByRole("button", {
      name: /categories/i,
    });

    fireEvent.click(categoriesButton);

    // Wait for popover to open and check for categories
    const electronicsCheckbox = await screen.findByLabelText("electronics");
    expect(electronicsCheckbox).toBeInTheDocument();
    expect(screen.getByLabelText("jewelery")).toBeInTheDocument();
    expect(screen.getByLabelText("men's clothing")).toBeInTheDocument();
  });

  it("displays selected categories count badge", () => {
    const propsWithSelection = {
      ...mockProps,
      selectedCategories: ["electronics", "jewelery"],
    };

    renderWithIntl(<InlineFilters {...propsWithSelection} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("updates URL when price range changes", () => {
    renderWithIntl(<InlineFilters {...mockProps} />);
    const minPriceInput = screen.getByPlaceholderText("Min");

    fireEvent.change(minPriceInput, { target: { value: "100" } });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("minPrice=100")
    );
  });
});
