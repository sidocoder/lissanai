import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://lissan-ai-backend-dev.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
