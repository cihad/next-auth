import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "@/components/app/language-switcher";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
}));

describe("LanguageSwitcher", () => {
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders language switcher button", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  it("shows dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Türkçe")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });
  });

  it("switches language to Turkish when clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Türkçe")).toBeInTheDocument();
    });

    const turkishOption = screen.getByText("Türkçe");
    await user.click(turkishOption);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: "tr" }),
      });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("switches language to English when clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    const englishOption = screen.getByText("English");
    await user.click(englishOption);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: "en" }),
      });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("disables button while switching language", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              }),
            100
          )
        )
    );

    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    const turkishOption = screen.getByText("Türkçe");
    await user.click(turkishOption);

    // Button should be disabled during transition
    expect(button).toBeDisabled();
  });
});
