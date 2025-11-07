import { cn, formatPrice } from "@fakestore/shared/lib/utils";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("px-2", false && "py-1", "text-sm")).toBe("px-2 text-sm");
  });
});

describe("formatPrice", () => {
  it("should format integer prices correctly", () => {
    expect(formatPrice(99)).toBe("$99");
    expect(formatPrice(100)).toBe("$100");
    expect(formatPrice(1000)).toBe("$1,000");
  });

  it("should format decimal prices by rounding to nearest integer", () => {
    expect(formatPrice(99.99)).toBe("$100");
    expect(formatPrice(99.49)).toBe("$99");
    expect(formatPrice(1234.56)).toBe("$1,235");
  });

  it("should format large prices with commas", () => {
    expect(formatPrice(1000)).toBe("$1,000");
    expect(formatPrice(10000)).toBe("$10,000");
    expect(formatPrice(100000)).toBe("$100,000");
    expect(formatPrice(1000000)).toBe("$1,000,000");
  });

  it("should handle zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("should handle small decimal values", () => {
    expect(formatPrice(0.99)).toBe("$1");
    expect(formatPrice(0.49)).toBe("$0");
    expect(formatPrice(1.5)).toBe("$2");
  });

  it("should format negative prices", () => {
    expect(formatPrice(-99)).toBe("-$99");
    expect(formatPrice(-1234.56)).toBe("-$1,235");
  });
});
