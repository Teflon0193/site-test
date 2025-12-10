import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveExtensions: [".foo", ".bar"],
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "lively-horse-7cb2f4c550.strapiapp.com" },
      {
        protocol: "https",
        hostname: "lively-horse-7cb2f4c550.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "informed-activity-db79c3338c.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "informed-activity-db79c3338c.strapiapp.com",
      },
    ],
    qualities: [90],
  },
};

export default withPWA(nextConfig);
