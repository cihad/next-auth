import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

export const withNextIntl = createNextIntlPlugin(
  "../../packages/shared/src/lib/i18n-request.ts"
);

const nextConfig: NextConfig = {
  /* config options here */
  // basePath: "/cart",
  // assetPrefix: "/cart-static",
  reactCompiler: true,
  transpilePackages: ["@fakestore/shadcn"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.auth0.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
};

export default withMicrofrontends(withNextIntl(nextConfig), { debug: true });
