import { render, screen } from "@testing-library/react";
import UserMenu from "@/components/app/user-menu";

// Mock next/link
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

describe("UserMenu Component", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/avatar.jpg",
  };

  it("should render user avatar fallback", () => {
    render(<UserMenu user={mockUser} />);

    // Avatar fallback (first letter of email) kontrolü
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should render dropdown menu trigger button", () => {
    render(<UserMenu user={mockUser} />);

    // Dropdown trigger button
    const button = screen.getByRole("button", { name: /J/i });
    expect(button).toBeInTheDocument();
  });

  it("should handle missing user image gracefully", () => {
    const userWithoutImage = {
      ...mockUser,
      image: null,
    };

    render(<UserMenu user={userWithoutImage} />);

    // Avatar fallback (first letter of email) should be shown
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should handle missing user email gracefully", () => {
    const userWithoutEmail = {
      ...mockUser,
      email: null,
    };

    render(<UserMenu user={userWithoutEmail} />);

    // Should render U as fallback
    expect(screen.getByText("U")).toBeInTheDocument();
  });
});
