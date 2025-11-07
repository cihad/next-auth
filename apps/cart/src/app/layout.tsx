import { Navbar } from "@fakestore/shared/components/navbar";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@fakestore/shared/components/store-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@fakestore/shadcn/components/sonner";
import FlashMessage from "@fakestore/shared/components/flash-message";
import { SessionProvider } from "next-auth/react";
import { getFlash } from "@fakestore/shared/lib/flash";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.cart");

  return {
    title: t("title"),
    description: t("description"),
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const flash = await getFlash();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <NextIntlClientProvider>
            <SessionProvider>
              <Navbar />
              {children}
              <Toaster position="top-center" />
              <FlashMessage flash={flash} />
            </SessionProvider>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
