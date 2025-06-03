import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media1.giphy.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'store-images.s-microsoft.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;
