import { render, screen, fireEvent } from "@testing-library/react";
import {
  MobileFiltersProvider,
  MobileFiltersTrigger,
  MobileFiltersContent,
} from "@/components/app/mobile-filters";
import { NextIntlClientProvider } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const messages = {
  productsPage: {
    filters: "Filters",
    priceRange: "Price Range",
    minPrice: "Min",
    maxPrice: "Max",
    categories: "Categories",
    sortBy: "Sort By",
  },
};

describe("MobileFilters", () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  const mockProps = {
    categories: ["electronics", "jewelery"],
    selectedCategories: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  };

  const renderWithIntl = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it("renders filter trigger button", () => {
    renderWithIntl(
      <MobileFiltersProvider>
        <MobileFiltersTrigger />
      </MobileFiltersProvider>
    );

    expect(
      screen.getByRole("button", { name: /filters/i })
    ).toBeInTheDocument();
  });

  it("shows filter content when trigger is clicked", async () => {
    renderWithIntl(
      <MobileFiltersProvider>
        <MobileFiltersTrigger />
        <MobileFiltersContent {...mockProps} />
      </MobileFiltersProvider>
    );

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filterButton);

    // Wait for content to appear
    expect(await screen.findByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("renders all categories in the content", async () => {
    renderWithIntl(
      <MobileFiltersProvider>
        <MobileFiltersTrigger />
        <MobileFiltersContent {...mockProps} />
      </MobileFiltersProvider>
    );

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filterButton);

    expect(await screen.findByLabelText("electronics")).toBeInTheDocument();
    expect(screen.getByLabelText("jewelery")).toBeInTheDocument();
  });

  it("renders price range inputs in the content", async () => {
    renderWithIntl(
      <MobileFiltersProvider>
        <MobileFiltersTrigger />
        <MobileFiltersContent {...mockProps} />
      </MobileFiltersProvider>
    );

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filterButton);

    expect(await screen.findByPlaceholderText("Min")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
  });

  it("updates URL when category is selected", async () => {
    renderWithIntl(
      <MobileFiltersProvider>
        <MobileFiltersTrigger />
        <MobileFiltersContent {...mockProps} />
      </MobileFiltersProvider>
    );

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filterButton);

    const electronicsCheckbox = await screen.findByLabelText("electronics");
    fireEvent.click(electronicsCheckbox);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("categories=electronics")
    );
  });
});
