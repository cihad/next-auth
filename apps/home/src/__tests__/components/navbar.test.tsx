import { render, screen } from "@testing-library/react";
import { Navbar } from "@fakestore/shared/components/navbar";
import { auth } from "@fakestore/shared/lib/auth";

jest.mock("@fakestore/shared/lib/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock LanguageSwitcher component
jest.mock("@/components/app/language-switcher", () => {
  const MockLanguageSwitcher = () => (
    <div data-testid="language-switcher">Language Switcher</div>
  );
  MockLanguageSwitcher.displayName = "MockLanguageSwitcher";
  return MockLanguageSwitcher;
});

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render sign in button when user is not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const NavbarComponent = await Navbar();
    render(NavbarComponent);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /avatar/i })
    ).not.toBeInTheDocument();
  });

  it("should render user menu when user is authenticated", async () => {
    const mockSession = {
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.jpg",
      },
      expires: "2024-12-31",
    };

    (auth as jest.Mock).mockResolvedValue(mockSession);

    const NavbarComponent = await Navbar();
    render(NavbarComponent);

    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();

    // avatar fallback
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should render app title with link to home", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const NavbarComponent = await Navbar();
    render(NavbarComponent);

    const homeLink = screen.getByRole("link", { name: /fakestore/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render language switcher", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const NavbarComponent = await Navbar();
    render(NavbarComponent);

    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("should render all components in correct order", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const NavbarComponent = await Navbar();
    const { container } = render(NavbarComponent);

    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();

    // Check language switcher and sign in button are in the same container
    const rightSection = screen.getByTestId("language-switcher").parentElement;
    expect(rightSection).toContainElement(screen.getByText("Sign in"));
  });
});
