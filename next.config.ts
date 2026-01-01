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
  // Optimize for Cloudflare Pages Edge Runtime
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Prevent Webpack from trying to bundle better-sqlite3 (which uses 'fs')
  serverExternalPackages: ["better-sqlite3"],

  // Webpack configuration to exclude better-sqlite3 and its dependencies from bundling
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude better-sqlite3 and its native dependencies from bundling
      config.externals = config.externals || [];
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
        'bindings': 'commonjs bindings',
        'file-uri-to-path': 'commonjs file-uri-to-path',
      });

      // Ignore fs and path modules (Node.js built-ins not available in Edge runtime)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  // Image optimization
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
};

export default nextConfig;
