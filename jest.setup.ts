import "@testing-library/jest-dom";
import enMessages from "@/messages/en.json";
import trMessages from "@/messages/tr.json";

// Mock next-auth module
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const locale = "en";
    const rawMessages = locale === "en" ? enMessages : trMessages;

    return (key: string) => {
      if (namespace) {
        const namespaceMessages =
          rawMessages[namespace as keyof typeof rawMessages];
        if (namespaceMessages && typeof namespaceMessages === "object") {
          return (namespaceMessages as Record<string, string>)[key] || key;
        }
      }
      return key;
    };
  },
  useLocale: () => "en",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn((namespace?: string) => {
    const locale = "en";
    const rawMessages = locale === "en" ? enMessages : trMessages;

    const t = (key: string) => {
      if (namespace) {
        const namespaceMessages =
          rawMessages[namespace as keyof typeof rawMessages];
        if (namespaceMessages && typeof namespaceMessages === "object") {
          return (namespaceMessages as Record<string, string>)[key] || key;
        }
      }
      return key;
    };

    t.rich = (key: string) => {
      if (namespace) {
        const namespaceMessages =
          rawMessages[namespace as keyof typeof rawMessages];
        if (namespaceMessages && typeof namespaceMessages === "object") {
          const text = (namespaceMessages as Record<string, string>)[key];
          // For testing, just return the text without rich rendering
          // The actual rich rendering happens in components
          return text || key;
        }
      }
      return key;
    };

    return Promise.resolve(t);
  }),
}));
