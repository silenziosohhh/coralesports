/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-build",
  poweredByHeader: false,
  images: {

    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avyra-skin-api.vercel.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mc-heads.net",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "react-icons"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  turbopack: {},
  webpack(config) {

    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
