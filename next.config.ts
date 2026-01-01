import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Cloudflare Pages Edge Runtime
  experimental: {
    // Enable edge runtime support
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Image optimization
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
};

export default nextConfig;
