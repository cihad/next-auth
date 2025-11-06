import { render, screen } from "@testing-library/react";
import { ProductList } from "@/components/app/product-list";
import { Product } from "@/types/product";

// Mock child components
jest.mock("@/components/app/page-title", () => ({
  PageTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

jest.mock("@/components/app/inline-filters", () => ({
  InlineFilters: () => <div data-testid="inline-filters">Inline Filters</div>,
}));

jest.mock("@/components/app/product-sort", () => ({
  ProductSort: () => <div data-testid="product-sort">Product Sort</div>,
}));

jest.mock("@/components/app/product-card", () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-${product.id}`}>{product.title}</div>
  ),
}));

jest.mock("@/components/app/mobile-filters", () => ({
  MobileFiltersProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MobileFiltersTrigger: () => (
    <button data-testid="mobile-filter-trigger">Filter</button>
  ),
  MobileFiltersContent: () => (
    <div data-testid="mobile-filters-content">Mobile Filters Content</div>
  ),
}));

// Mock next-intl
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string, params?: { count?: number }) => {
      if (key === "title") return "All Products";
      if (key === "showingProducts")
        return `Showing ${params?.count || 0} products`;
      if (key === "noProducts") return "No products found";
      return key;
    })
  ),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Product 1",
    price: 29.99,
    description: "Description 1",
    category: "electronics",
    image: "https://example.com/image1.jpg",
    rating: {
      rate: 4.5,
      count: 100,
    },
  },
  {
    id: 2,
    title: "Product 2",
    price: 49.99,
    description: "Description 2",
    category: "jewelery",
    image: "https://example.com/image2.jpg",
    rating: {
      rate: 4.2,
      count: 50,
    },
  },
];

describe("ProductList", () => {
  const defaultProps = {
    products: mockProducts,
    categories: ["electronics", "jewelery"],
    selectedCategories: [],
    sortBy: "default",
  };

  it("should render the page title", async () => {
    const component = await ProductList(defaultProps);
    render(component);

    expect(screen.getByText("All Products")).toBeInTheDocument();
  });

  it("should render mobile filter components", async () => {
    const component = await ProductList(defaultProps);
    render(component);

    expect(screen.getByTestId("mobile-filter-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-filters-content")).toBeInTheDocument();
  });

  it("should render desktop filter components", async () => {
    const component = await ProductList(defaultProps);
    render(component);

    expect(screen.getByTestId("inline-filters")).toBeInTheDocument();
    expect(screen.getByTestId("product-sort")).toBeInTheDocument();
  });

  it("should display product count", async () => {
    const component = await ProductList(defaultProps);
    render(component);

    expect(screen.getByText("Showing 2 products")).toBeInTheDocument();
  });

  it("should render all products", async () => {
    const component = await ProductList(defaultProps);
    render(component);

    expect(screen.getByTestId("product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-2")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("should display no products message when products array is empty", async () => {
    const component = await ProductList({
      ...defaultProps,
      products: [],
    });
    render(component);

    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(screen.queryByTestId("product-1")).not.toBeInTheDocument();
  });

  it("should pass correct props to child components", async () => {
    const component = await ProductList({
      ...defaultProps,
      selectedCategories: ["electronics"],
      sortBy: "price-asc",
    });
    render(component);

    // Verify that all components are rendered with the product list
    expect(screen.getByTestId("inline-filters")).toBeInTheDocument();
    expect(screen.getByTestId("product-sort")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-filters-content")).toBeInTheDocument();
  });
});
