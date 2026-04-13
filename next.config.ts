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
      "zod"
    ],
    // Next.js 15+ flag to reduce max memory usage
    webpackMemoryOptimizations: true,
    // Run webpack compilation in a separate worker
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

  // Disable X-Powered-By header (Pentest M2)
  poweredByHeader: false,

  async headers() {
    if (isMobileBuild) return [];
    
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
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://diswatchapi.tilikan.id https://superdashapi.tilikan.id https://api.banjirsumatra.id https://www.google-analytics.com; frame-ancestors 'none'; object-src 'none';",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.ukp2sa.id', // Pentest H1 Fix
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
        ],
      },
    ];
  },
};

export default nextConfig;