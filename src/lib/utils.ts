import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price value as USD currency
 * @param price - The price to format
 * @returns Formatted price string (e.g., "$99", "$1,234")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("en", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
