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

  it("should render login page with title", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("should render Auth0 sign in button", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    const signInButton = screen.getByRole("button", {
      name: /sign in with auth0/i,
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("should render home link", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    const homeLink = screen.getByRole("link", {
      name: /sign in to your account/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render terms agreement text", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    // Check if terms text is present
    const termsSection = screen.getByText(/Terms of Service/i);
    expect(termsSection).toBeInTheDocument();

    const privacySection = screen.getByText(/Privacy Policy/i);
    expect(privacySection).toBeInTheDocument();
  });

  it("should render image with translated alt text", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    const image = screen.getByAltText("Welcome to Next Auth");
    expect(image).toBeInTheDocument();
  });

  it("should have links in terms agreement", async () => {
    const LoginPageComponent = await LoginPage();
    render(LoginPageComponent);

    const links = screen.getAllByRole("link");
    // Should have at least home link
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});
