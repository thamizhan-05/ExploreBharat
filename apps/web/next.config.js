/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bharatyatra/types'],
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
