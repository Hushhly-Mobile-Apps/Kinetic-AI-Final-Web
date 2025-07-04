/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi untuk Vercel
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['vercel.app', 'localhost'],
  },
}

export default nextConfig