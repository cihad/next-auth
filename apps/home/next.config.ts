import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

import createNextIntlPlugin from "next-intl/plugin";

export const withNextIntl = createNextIntlPlugin(
  "../../packages/shared/src/lib/i18n-request.ts"
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
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
  // async rewrites() {
  //   return [
  //     {
  //       source: "/cart",
  //       destination: `${process.env.CART_DOMAIN}/cart`,
  //     },
  //     {
  //       source: "/cart/:path+",
  //       destination: `${process.env.CART_DOMAIN}/cart/:path+`,
  //     },
  //     {
  //       source: "/cart-static/_next/:path+",
  //       destination: `${process.env.CART_DOMAIN}/cart-static/_next/:path+`,
  //     },
  //   ];
  // },
  transpilePackages: ["@fakestore/shadcn", "@fakestore/shared"],
};

export default withMicrofrontends(withNextIntl(nextConfig), { debug: true });
