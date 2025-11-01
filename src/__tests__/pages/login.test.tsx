import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login page with title", () => {
    render(<LoginPage />);

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("should render Auth0 sign in button", () => {
    render(<LoginPage />);

    const signInButton = screen.getByRole("button", {
      name: /sign in with auth0/i,
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("should render home link", () => {
    render(<LoginPage />);

    const homeLink = screen.getByRole("link", {
      name: /sign in to your account/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
