import { render, screen } from "@testing-library/react";
import NavbarLogo from "@/components/app/navbar-logo";

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const translations: Record<string, string> = {
        appName: "Next Auth Store",
      };
      return translations[key] || key;
    })
  ),
}));

describe("NavbarLogo", () => {
  it("should render logo icon and app name", async () => {
    const Component = await NavbarLogo();
    render(Component);

    // Check if the app name is rendered
    expect(screen.getByText("Next Auth Store")).toBeInTheDocument();

    // Check if the shopping bag icon is rendered
    const icon = screen.getByRole("heading").previousSibling;
    expect(icon).toBeInTheDocument();
  });

  it("should have correct styling classes", async () => {
    const Component = await NavbarLogo();
    const { container } = render(Component);

    const wrapper = container.querySelector(".flex.items-center.gap-2");
    expect(wrapper).toBeInTheDocument();

    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("text-xl", "font-semibold");
  });

  it("should display heading with correct text content", async () => {
    const Component = await NavbarLogo();
    render(Component);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("Next Auth Store");
  });
});
