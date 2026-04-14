import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  // Allow serving uploaded covers from /api/covers
  async headers() {
    return [
      {
        source: "/api/audio/:path*",
        headers: [{ key: "Accept-Ranges", value: "bytes" }],
      },
    ];
  },
};

export default nextConfig;
