import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@fandom/shared', '@fandom/firebase'],
}

export default nextConfig
