import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly set output file tracing root to prevent Next.js from inferring wrong workspace
  // This fixes the warning about multiple lockfiles detected
  outputFileTracingRoot: path.resolve(__dirname),

  // ESLint is configured in eslint.config.mjs
  // Set to false to enable linting during builds, or true to skip
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optimize for Vercel deployment
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Image optimization
  images: {
    unoptimized: false, // Vercel handles image optimization
  },
};

export default nextConfig;
