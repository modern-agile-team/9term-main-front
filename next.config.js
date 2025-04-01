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
  typescript: {
    // !! WARN !!
    // 빌드 시 타입 체크를 비활성화합니다.
    // 프로덕션에서는 활성화하는 것을 권장합니다.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
