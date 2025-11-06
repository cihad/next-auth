import { render, screen } from "@testing-library/react";
import ProductDetailPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/products/[id]/page";
import { NextIntlClientProvider } from "next-intl";
import { Product } from "@/types/product";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the child components
jest.mock("@/components/app/navbar", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock("@/components/app/app-button", () => ({
  __esModule: true,
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="add-to-cart" className={className}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/rating", () => ({
  Rating: ({ rating, showValue }: { rating: number; showValue?: boolean }) => (
    <div data-testid="rating">
      {showValue && <span>{rating.toFixed(1)}</span>}
    </div>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

const messages = {
  productDetailPage: {
    price: "Price",
    category: "Category",
    description: "Description",
    addToCart: "Add to Cart",
    backToProducts: "Back to Products",
    productNotFound: "Product not found",
    reviews: "reviews",
  },
};

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  category: "electronics",
  image: "/test-image.jpg",
  description: "This is a test product description",
  rating: { rate: 4.5, count: 100 },
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();

    // Check if category is a link to products page with filter
    const categoryLink = screen.getByText("electronics").closest("a");
    expect(categoryLink).toHaveAttribute(
      "href",
      "/products?categories=electronics"
    );
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test product description")
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Products")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
  });

  it("formats price with formatPrice helper", async () => {
    const productWithLargePrice = { ...mockProduct, price: 1234.56 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => productWithLargePrice,
    });

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    // formatPrice formats with no decimals and comma separator
    expect(screen.getByText("$1,235")).toBeInTheDocument();
  });

  it("renders rating with stars", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId("rating")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText(/100 reviews/)).toBeInTheDocument();
  });

  it("calls notFound when product is not found", async () => {
    const notFound = jest.requireMock("next/navigation").notFound;
    notFound.mockImplementationOnce(() => {
      throw new Error("notFound");
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(
      ProductDetailPage({
        params: Promise.resolve({ id: "999" }),
      })
    ).rejects.toThrow("notFound");

    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound when fetch fails", async () => {
    const notFound = jest.requireMock("next/navigation").notFound;
    notFound.mockImplementationOnce(() => {
      throw new Error("notFound");
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    await expect(
      ProductDetailPage({
        params: Promise.resolve({ id: "1" }),
      })
    ).rejects.toThrow("notFound");

    expect(notFound).toHaveBeenCalled();
  });

  it("renders back to products link correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const jsx = await ProductDetailPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {jsx}
      </NextIntlClientProvider>
    );

    const backLink = screen.getByText("Back to Products").closest("a");
    expect(backLink).toHaveAttribute("href", "/products");
  });
});

describe("generateStaticParams", () => {
  it("generates static params for all products", async () => {
    const mockProducts = [
      { ...mockProduct, id: 1 },
      { ...mockProduct, id: 2 },
      { ...mockProduct, id: 3 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const params = await generateStaticParams();

    expect(params).toEqual([{ id: "1" }, { id: "2" }, { id: "3" }]);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products",
      { next: { revalidate: 3600 } }
    );
  });

  it("returns empty array when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    const params = await generateStaticParams();

    expect(params).toEqual([]);
  });

  it("returns empty array when response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const params = await generateStaticParams();

    expect(params).toEqual([]);
  });
});

describe("generateMetadata", () => {
  it("generates metadata for a product", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      description: "Test Description",
      price: 19.99,
      category: "electronics",
      image: "https://example.com/image.jpg",
      rating: { rate: 4.5, count: 100 },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "1" }),
    });

    expect(metadata.title).toBe("Test Product | FakeStore");
    expect(metadata.description).toBe("Test Description");
    expect(metadata.openGraph?.title).toBe("Test Product");
    expect(metadata.openGraph?.description).toBe("Test Description");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://example.com/image.jpg",
        width: 800,
        height: 800,
        alt: "Test Product",
      },
    ]);
  });

  it("returns fallback metadata when product not found", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "999" }),
    });

    expect(metadata.title).toBe("Product Not Found");
  });
});
