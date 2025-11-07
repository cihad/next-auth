import { render, screen } from "@testing-library/react";
import ProductsPage from "@/app/products/page";
import { NextIntlClientProvider } from "next-intl";
import { Product } from "@fakestore/shared/types/product";

// Mock the child components
jest.mock("@fakestore/shared/components/navbar", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock("@/components/app/product-list", () => ({
  ProductList: ({
    products,
    categories,
  }: {
    products: Product[];
    categories: string[];
  }) => (
    <div data-testid="product-list">
      <div>Products: {products.length}</div>
      <div>Categories: {categories.join(", ")}</div>
    </div>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

const messages = {
  productsPage: {
    title: "All Products",
  },
};

describe("ProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navbar and product list", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 10,
        category: "electronics",
        image: "/image1.jpg",
        description: "Description 1",
        rating: { rate: 4.5, count: 100 },
      },
    ];
    const mockCategories = ["electronics", "jewelery"];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

    const jsx = await ProductsPage({
      searchParams: Promise.resolve({}),
    });
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.getByText("Products: 1")).toBeInTheDocument();
    expect(
      screen.getByText("Categories: electronics, jewelery")
    ).toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

    const jsx = await ProductsPage({
      searchParams: Promise.resolve({}),
    });
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.getByText("Products: 0")).toBeInTheDocument();
    expect(screen.getByText("Categories:")).toBeInTheDocument();
  });
});
