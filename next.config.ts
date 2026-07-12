import type {
  NextConfig,
} from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname:
          "new-site-backend.onrender.com",
      },
      {
        protocol: "https",
        hostname:
          "lively-horse-7cb2f4c550.strapiapp.com",
      },
      {
        protocol: "https",
        hostname:
          "lively-horse-7cb2f4c550.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname:
          "informed-activity-db79c3338c.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname:
          "informed-activity-db79c3338c.strapiapp.com",
      },
    ],

    qualities: [90, 100],
  },

  async redirects() {
    return [
      {
        source: "/galleries",
        destination: "/media",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;