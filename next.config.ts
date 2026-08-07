import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a sibling lockfile sits one level up, so the trace root is pinned explicitly
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
