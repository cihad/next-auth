/**
 * @jest-environment node
 */

import { POST } from "@/app/api/locale/route";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

class MockNextRequest {
  private _json: unknown;

  constructor(url: string, init: { method: string; body: string }) {
    this._json = JSON.parse(init.body);
  }

  async json() {
    return this._json;
  }
}

describe("Locale API Route", () => {
  let mockCookieStore: {
    set: jest.Mock;
    get: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
  });

  it("should set Turkish locale cookie", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "tr" }),
    }) as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ success: true });
    expect(mockCookieStore.set).toHaveBeenCalledWith("locale", "tr", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    expect(response.status).toBe(200);
  });

  it("should set English locale cookie", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "en" }),
    }) as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ success: true });
    expect(mockCookieStore.set).toHaveBeenCalledWith("locale", "en", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    expect(response.status).toBe(200);
  });

  it("should reject invalid locale", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "fr" }),
    }) as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ error: "Invalid locale" });
    expect(mockCookieStore.set).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it("should reject empty locale", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "" }),
    }) as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ error: "Invalid locale" });
    expect(mockCookieStore.set).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it("should reject missing locale", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({}),
    }) as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ error: "Invalid locale" });
    expect(mockCookieStore.set).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it("should set cookie with correct expiration (1 year)", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "tr" }),
    }) as unknown as NextRequest;

    await POST(request);

    const oneYearInSeconds = 60 * 60 * 24 * 365;
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "locale",
      "tr",
      expect.objectContaining({
        maxAge: oneYearInSeconds,
      })
    );
  });

  it("should set cookie with root path", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/locale", {
      method: "POST",
      body: JSON.stringify({ locale: "en" }),
    }) as unknown as NextRequest;

    await POST(request);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "locale",
      "en",
      expect.objectContaining({
        path: "/",
      })
    );
  });
});
