import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'mediabunny',
    '@mediabunny/mp3-encoder',
    '@mediabunny/aac-encoder',
    '@mediabunny/ac3',
    '@mediabunny/flac-encoder'
  ]
}

export default nextConfig
