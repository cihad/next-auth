import { setFlash, getFlash, clearFlash } from "@fakestore/shared/lib/flash";
import { cookies } from "next/headers";

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("Flash Message Functions", () => {
  let mockCookies: {
    set: jest.Mock;
    get: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    mockCookies = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };

    (cookies as jest.Mock).mockResolvedValue(mockCookies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setFlash", () => {
    it("should set a success flash message", async () => {
      await setFlash("success", "Operation successful!");

      expect(mockCookies.set).toHaveBeenCalledWith(
        "flash-message",
        JSON.stringify({ type: "success", message: "Operation successful!" }),
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60,
          path: "/",
        }
      );
    });

    it("should set an error flash message", async () => {
      await setFlash("error", "Something went wrong!");

      expect(mockCookies.set).toHaveBeenCalledWith(
        "flash-message",
        JSON.stringify({ type: "error", message: "Something went wrong!" }),
        expect.objectContaining({
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60,
        })
      );
    });

    it("should set a warning flash message", async () => {
      await setFlash("warning", "Please be careful!");

      expect(mockCookies.set).toHaveBeenCalledWith(
        "flash-message",
        JSON.stringify({ type: "warning", message: "Please be careful!" }),
        expect.any(Object)
      );
    });

    it("should set an info flash message", async () => {
      await setFlash("info", "For your information");

      expect(mockCookies.set).toHaveBeenCalledWith(
        "flash-message",
        JSON.stringify({ type: "info", message: "For your information" }),
        expect.any(Object)
      );
    });

    it("should set cookie with correct options", async () => {
      await setFlash("success", "Test message");

      expect(mockCookies.set).toHaveBeenCalledWith(
        "flash-message",
        expect.any(String),
        expect.objectContaining({
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60,
          path: "/",
        })
      );
    });
  });

  describe("getFlash", () => {
    it("should return flash message when cookie exists", async () => {
      const flashMessage = { type: "success", message: "Test message" };
      mockCookies.get.mockReturnValue({
        value: JSON.stringify(flashMessage),
      });

      const result = await getFlash();

      expect(mockCookies.get).toHaveBeenCalledWith("flash-message");
      expect(result).toEqual(flashMessage);
    });

    it("should return null when cookie does not exist", async () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = await getFlash();

      expect(mockCookies.get).toHaveBeenCalledWith("flash-message");
      expect(result).toBeNull();
    });

    it("should return null when cookie value is invalid JSON", async () => {
      mockCookies.get.mockReturnValue({
        value: "invalid-json",
      });

      const result = await getFlash();

      expect(mockCookies.get).toHaveBeenCalledWith("flash-message");
      expect(result).toBeNull();
    });

    it("should handle different flash message types", async () => {
      const flashTypes = ["success", "error", "warning", "info"] as const;

      for (const type of flashTypes) {
        const flashMessage = { type, message: `Test ${type} message` };
        mockCookies.get.mockReturnValue({
          value: JSON.stringify(flashMessage),
        });

        const result = await getFlash();

        expect(result).toEqual(flashMessage);
      }
    });

    it("should return null for empty cookie value", async () => {
      mockCookies.get.mockReturnValue({
        value: "",
      });

      const result = await getFlash();

      expect(result).toBeNull();
    });
  });

  describe("clearFlash", () => {
    it("should delete flash message cookie", async () => {
      await clearFlash();

      expect(mockCookies.delete).toHaveBeenCalledWith("flash-message");
    });

    it("should call delete only once", async () => {
      await clearFlash();

      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration scenarios", () => {
    it("should set and get flash message correctly", async () => {
      const flashMessage = {
        type: "success" as const,
        message: "Integration test",
      };

      // Set flash
      await setFlash(flashMessage.type, flashMessage.message);

      // Mock the get to return what was set
      mockCookies.get.mockReturnValue({
        value: mockCookies.set.mock.calls[0][1],
      });

      // Get flash
      const result = await getFlash();

      expect(result).toEqual(flashMessage);
    });

    it("should handle set, get, and clear workflow", async () => {
      // Set flash
      await setFlash("info", "Workflow test");

      // Get flash
      mockCookies.get.mockReturnValue({
        value: mockCookies.set.mock.calls[0][1],
      });
      await getFlash();

      // Clear flash
      await clearFlash();

      expect(mockCookies.set).toHaveBeenCalledTimes(1);
      expect(mockCookies.get).toHaveBeenCalledTimes(1);
      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });
  });
});
