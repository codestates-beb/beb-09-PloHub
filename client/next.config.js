/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['plohub-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
  videos: {
    domains: ['plohub-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
}

module.exports = nextConfig
