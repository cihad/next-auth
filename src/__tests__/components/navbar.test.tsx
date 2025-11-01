import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/app/navbar";
import { auth } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
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

  it("should render Next Auth title with link to home", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const NavbarComponent = await Navbar();
    render(NavbarComponent);

    const homeLink = screen.getByRole("link", { name: /next auth/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
