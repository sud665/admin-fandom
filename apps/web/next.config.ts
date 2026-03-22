import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@fandom/shared', '@fandom/firebase'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
