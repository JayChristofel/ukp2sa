import type { NextConfig } from "next";

const isMobileBuild = process.env.BUILD_MODE === 'mobile';
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Paket yang butuh native Node.js runtime — jangan di-bundle webpack/turbopack
  serverExternalPackages: ["nodemailer"],

  // Vercel: undefined (auto-handled), cPanel: standalone, Mobile: export
  output: isMobileBuild ? 'export' : isVercel ? undefined : 'standalone',
  
  // Matiin optimasi gambar biar gak butuh native sharp di cPanel/Mobile
  images: {
    unoptimized: true,
  },
  
  // Pastiin path-nya bener buat file lokal
  trailingSlash: isMobileBuild ? true : false,

  // --- MEMORY & PERFORMANCE OPTIMIZATIONS (Official Guide) ---
  experimental: {
    // Optimasi library gede biar nggak semua di-load ke RAM pas dev
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@tanstack/react-query",
      "date-fns",
      "clsx",
      "tailwind-merge",
      "axios",
      "zod",
      "react-hook-form",
      "@supabase/supabase-js",
      "zustand",
      "react-leaflet",
      "leaflet",
      "sonner",
      "next-themes"
    ],
    // Next.js 16+ flag to reduce max memory usage during build
    webpackMemoryOptimizations: true,
    // Run webpack compilation in a separate worker thread
    webpackBuildWorker: true,
  },
  
  // Disable source maps to save memory during build
  productionBrowserSourceMaps: false,

  // Ignore lint/types during build for faster "satset" result
  // (Pastikan cek manual di IDE atau CI)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Power-up webpack/turbopack buat handle library spesifik
  transpilePackages: ["lucide-react", "recharts"],

  // Expose env vars to client
  env: {
    NEXT_PUBLIC_BUILD_MODE: process.env.BUILD_MODE || 'web',
  },

  // Disable X-Powered-By header (Pentest M2)
  poweredByHeader: false,
};

// ONLY add server-side features if NOT a mobile build (static export)
// This SILENCES the Next.js warning successfully
if (!isMobileBuild) {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/api/v1/external-banjir/:path*',
        destination: 'https://api.banjirsumatra.id/api/v1/:path*',
      },
    ];
  };

  nextConfig.headers = async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://ukp2sa.id',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  };
}

export default nextConfig;
