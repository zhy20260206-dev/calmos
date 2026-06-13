/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/calmos',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
