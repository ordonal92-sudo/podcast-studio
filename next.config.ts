import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "600mb",
    },
  },
  async headers() {
    return [
      {
        source: "/api/audio/:path*",
        headers: [{ key: "Accept-Ranges", value: "bytes" }],
      },
    ];
  },
};

// Next.js 16 requires this to allow large file uploads via API routes.
// The TypeScript type hasn't been updated yet — suppressing the error.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(nextConfig as any).middlewareClientMaxBodySize = false;

export default nextConfig;
