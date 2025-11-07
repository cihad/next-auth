import { render, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import FlashMessage from "@fakestore/shared/components/flash-message";
import { clearFlash } from "@fakestore/shared/lib/flash";
import type { FlashMessage as FlashMessageType } from "@fakestore/shared/lib/flash";

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock flash.ts
jest.mock("@fakestore/shared/lib/flash", () => ({
  clearFlash: jest.fn(),
}));

describe("FlashMessage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    const { container } = render(<FlashMessage flash={null} />);
    expect(container).toBeInTheDocument();
  });

  it("should return null (render nothing visible)", () => {
    const { container } = render(<FlashMessage flash={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should not show toast when flash is null", () => {
    render(<FlashMessage flash={null} />);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.warning).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
  });

  describe("Flash message types", () => {
    it("should show success toast for success flash message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Operation completed successfully!",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Operation completed successfully!"
        );
      });
    });

    it("should show error toast for error flash message", async () => {
      const flash: FlashMessageType = {
        type: "error",
        message: "An error occurred!",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("An error occurred!");
      });
    });

    it("should show warning toast for warning flash message", async () => {
      const flash: FlashMessageType = {
        type: "warning",
        message: "Please be careful!",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith("Please be careful!");
      });
    });

    it("should show info toast for info flash message", async () => {
      const flash: FlashMessageType = {
        type: "info",
        message: "For your information",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith("For your information");
      });
    });
  });

  describe("Flash message clearing", () => {
    it("should clear flash after showing success message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Success!",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(clearFlash).toHaveBeenCalled();
      });
    });

    it("should clear flash after showing error message", async () => {
      const flash: FlashMessageType = {
        type: "error",
        message: "Error!",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(clearFlash).toHaveBeenCalled();
      });
    });

    it("should not clear flash when flash is null", () => {
      render(<FlashMessage flash={null} />);

      expect(clearFlash).not.toHaveBeenCalled();
    });
  });

  describe("Component re-rendering", () => {
    it("should handle flash prop changes", async () => {
      const { rerender } = render(<FlashMessage flash={null} />);

      expect(toast.success).not.toHaveBeenCalled();

      const flash: FlashMessageType = {
        type: "success",
        message: "New message",
      };

      rerender(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("New message");
      });
    });

    it("should show toast only once for the same flash message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Same message",
      };

      const { rerender } = render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledTimes(1);
      });

      // Re-render with same flash (simulating no change)
      rerender(<FlashMessage flash={flash} />);

      // Should still be called only once due to useEffect dependency
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it("should show different toasts for different flash messages", async () => {
      const flash1: FlashMessageType = {
        type: "success",
        message: "First message",
      };

      const { rerender } = render(<FlashMessage flash={flash1} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("First message");
      });

      const flash2: FlashMessageType = {
        type: "error",
        message: "Second message",
      };

      rerender(<FlashMessage flash={flash2} />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Second message");
      });

      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("");
      });
    });

    it("should handle very long messages", async () => {
      const longMessage = "A".repeat(1000);
      const flash: FlashMessageType = {
        type: "info",
        message: longMessage,
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(longMessage);
      });
    });

    it("should handle special characters in message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Special chars: <>&\"'`",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Special chars: <>&\"'`");
      });
    });

    it("should handle unicode characters in message", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Unicode: 😀 🎉 ✨ 中文 العربية",
      };

      render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Unicode: 😀 🎉 ✨ 中文 العربية"
        );
      });
    });
  });

  describe("Cleanup", () => {
    it("should cleanup on unmount", async () => {
      const flash: FlashMessageType = {
        type: "success",
        message: "Test",
      };

      const { unmount } = render(<FlashMessage flash={flash} />);

      await waitFor(() => {
        expect(clearFlash).toHaveBeenCalled();
      });

      jest.clearAllMocks();

      unmount();

      // No additional calls should be made after unmount
      expect(clearFlash).not.toHaveBeenCalled();
    });
  });
});
