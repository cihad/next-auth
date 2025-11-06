import { render, screen } from "@testing-library/react";
import Loading from "@/app/loading";

// Mock Navbar
jest.mock("@/components/app/navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

// Mock ProductCardSkeleton
jest.mock("@/components/app/product-card-skeleton", () => ({
  ProductCardSkeleton: () => (
    <div data-testid="product-skeleton">Loading...</div>
  ),
}));

describe("Loading Page", () => {
  it("should render navbar", () => {
    render(<Loading />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render 4 product card skeletons", () => {
    render(<Loading />);

    const skeletons = screen.getAllByTestId("product-skeleton");
    expect(skeletons).toHaveLength(4);
  });

  it("should render skeleton for heading", () => {
    const { container } = render(<Loading />);

    const headingSkeleton = container.querySelector(".h-8.w-48");
    expect(headingSkeleton).toBeInTheDocument();
    expect(headingSkeleton).toHaveClass("animate-pulse");
  });

  it("should have correct grid layout classes", () => {
    const { container } = render(<Loading />);

    const gridDiv = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4"
    );
    expect(gridDiv).toBeInTheDocument();
  });

  it("should have proper spacing and layout structure", () => {
    const { container } = render(<Loading />);

    const mainElement = container.querySelector("main.max-w-7xl.mx-auto");
    expect(mainElement).toBeInTheDocument();

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should render with gap between skeleton cards", () => {
    const { container } = render(<Loading />);

    const gridDiv = container.querySelector(".gap-6");
    expect(gridDiv).toBeInTheDocument();
  });

  it("should have correct margin bottom for heading skeleton", () => {
    const { container } = render(<Loading />);

    const headingSkeleton = container.querySelector(".mb-8");
    expect(headingSkeleton).toBeInTheDocument();
  });
});
