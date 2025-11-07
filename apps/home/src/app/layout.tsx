import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@fakestore/shadcn/components/sonner";
import FlashMessage from "@fakestore/shared/components/flash-message";
import { getFlash } from "@fakestore/shared/lib/flash";
import StoreProvider from "@fakestore/shared/components/store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fake Stora",
  description: "FakeStore demo application",
};

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
