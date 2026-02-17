import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove webpack config for better-sqlite3 as it's not needed for MongoDB
  // and conflicts with Next.js 16 Turbopack default
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
