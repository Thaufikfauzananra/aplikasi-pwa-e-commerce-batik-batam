import withPWA from "next-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})({
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Disable optimization untuk development
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix path alias untuk @
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    
    // Pastikan resolve extensions
    config.resolve.extensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json",
    ];
    
    return config;
  },
  // Experimental untuk Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        "@": path.resolve(__dirname),
      },
    },
  },
});

export default nextConfig;
