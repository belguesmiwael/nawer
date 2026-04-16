/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  serverExternalPackages: ['firebase-admin'],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
