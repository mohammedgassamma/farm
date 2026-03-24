import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  //   async headers() {
  //     return [
  //       {
  //         source: "/:path*", // Match all routes
  //         headers: [
  //           {
  //             key: "Cache-Control",
  //             value: "no-store, no-cache, must-revalidate, proxy-revalidate",
  //           },
  //           { key: "Pragma", value: "no-cache" },
  //           { key: "Expires", value: "0" },
  //         ],
  //       },
  //     ];
  //   },
  images: {
    remotePatterns: [new URL("https://i.ibb.co/**")],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
