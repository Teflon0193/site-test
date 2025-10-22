import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "informed-activity-db79c3338c.strapiapp.com",
      "informed-activity-db79c3338c.media.strapiapp.com",
    ],
  },
};

export default nextConfig;
