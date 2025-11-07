import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock Navbar
jest.mock("@fakestore/shared/components/navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

// Mock ProductCard
jest.mock("@fakestore/shared/components/product-card", () => ({
  ProductCard: ({ product }: { product: { id: number; title: string } }) => (
    <div data-testid={`product-${product.id}`}>{product.title}</div>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render navbar", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should fetch products from API", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 29.99,
        description: "Description 1",
        category: "electronics",
        image: "https://example.com/1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products?limit=4",
      expect.objectContaining({
        next: { revalidate: 3600 },
      })
    );
  });

  it("should render featured products heading", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 29.99,
        description: "Description 1",
        category: "electronics",
        image: "https://example.com/1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText("Featured Products")).toBeInTheDocument();
  });

  it("should render 4 product cards when products are fetched", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 29.99,
        description: "Description 1",
        category: "electronics",
        image: "https://example.com/1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: 2,
        title: "Product 2",
        price: 39.99,
        description: "Description 2",
        category: "electronics",
        image: "https://example.com/2.jpg",
        rating: { rate: 4.0, count: 50 },
      },
      {
        id: 3,
        title: "Product 3",
        price: 49.99,
        description: "Description 3",
        category: "electronics",
        image: "https://example.com/3.jpg",
        rating: { rate: 3.5, count: 75 },
      },
      {
        id: 4,
        title: "Product 4",
        price: 59.99,
        description: "Description 4",
        category: "electronics",
        image: "https://example.com/4.jpg",
        rating: { rate: 5.0, count: 200 },
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByTestId("product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-2")).toBeInTheDocument();
    expect(screen.getByTestId("product-3")).toBeInTheDocument();
    expect(screen.getByTestId("product-4")).toBeInTheDocument();
  });

  it("should not render products section when no products are returned", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
  });

  it("should handle API errors gracefully", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("should handle fetch exceptions", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching products:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("should render with correct grid layout classes", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 29.99,
        description: "Description 1",
        category: "electronics",
        image: "https://example.com/1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const HomeComponent = await Home();
    const { container } = render(HomeComponent);

    const gridDiv = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4"
    );
    expect(gridDiv).toBeInTheDocument();
  });
});
