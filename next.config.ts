import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads (videos/audio up to 600MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "600mb",
    },
  },
  middlewareClientMaxBodySize: false,
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
