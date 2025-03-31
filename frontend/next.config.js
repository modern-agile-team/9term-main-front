// next.config.js
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
