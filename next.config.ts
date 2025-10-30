import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for mobile viewing
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Enable compression
  compress: true,

  // Optimize for production
  poweredByHeader: false,

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Fix workspace root detection for Vercel
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
