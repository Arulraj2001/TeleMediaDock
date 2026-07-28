/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mediadock/ui', '@mediadock/shared', '@mediadock/validation'],
};

export default nextConfig;
