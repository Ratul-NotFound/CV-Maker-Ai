/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  compress: true,
  poweredByHeader: false,
  // Optimize compilation - disable expensive features
  swcMinify: true,
  productionBrowserSourceMaps: false,
  // Faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Parallel compilation
  experimental: {
    esmExternals: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

module.exports = nextConfig