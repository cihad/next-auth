import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/app/product-card";
import { Product } from "@/types/product";

// Mock AppButton component
jest.mock("@/components/app/app-button", () => {
  const MockAppButton = ({
    children,
    tooltip,
  }: {
    children: React.ReactNode;
    tooltip?: string;
  }) => (
    <button data-testid="add-to-cart-button" title={tooltip}>
      {children}
    </button>
  );
  MockAppButton.displayName = "MockAppButton";
  return MockAppButton;
});

// Mock next/image
jest.mock("next/image", () => {
  const MockImage = ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
  MockImage.displayName = "MockImage";
  return MockImage;
});

describe("ProductCard Component", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Test Product",
    price: 29.99,
    description: "Test product description",
    category: "electronics",
    image: "https://example.com/product.jpg",
    rating: {
      rate: 4.5,
      count: 100,
    },
  };

  it("should render product image", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    render(ProductCardComponent);

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/product.jpg");
  });

  it("should render product title", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    render(ProductCardComponent);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should render product price with dollar sign", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    render(ProductCardComponent);

    // Price is formatted with formatPrice helper (no decimals)
    expect(screen.getByText("$30")).toBeInTheDocument();
  });

  it("should render add to cart button with tooltip", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    render(ProductCardComponent);

    const button = screen.getByTestId("add-to-cart-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Add to cart");
  });

  it("should truncate long product titles with line-clamp", async () => {
    const longTitleProduct = {
      ...mockProduct,
      title: "This is a very long product title that should be truncated",
    };

    const ProductCardComponent = await ProductCard({
      product: longTitleProduct,
    });
    const { container } = render(ProductCardComponent);

    const titleElement = screen.getByText(
      "This is a very long product title that should be truncated"
    );
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("line-clamp-2");
  });

  it("should render with correct border and styling", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    const { container } = render(ProductCardComponent);

    const cardDiv = container.querySelector(".border.rounded-lg");
    expect(cardDiv).toBeInTheDocument();
  });

  it("should render shopping cart icon", async () => {
    const ProductCardComponent = await ProductCard({ product: mockProduct });
    render(ProductCardComponent);

    const button = screen.getByTestId("add-to-cart-button");
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeTruthy();
  });
});
