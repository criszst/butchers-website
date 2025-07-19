import type { NextConfig } from "next";
const path = require("path");

module.exports = {
  experimental: {
    serverActions: true,
  },
  webpack(config) {
    config.resolve.alias['@prisma/client'] = path.resolve(__dirname, 'node_modules/@prisma/client');
    return config;
  },
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        pathname: '**'
      }
    ],
  },
};

export default nextConfig;
