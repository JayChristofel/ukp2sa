import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import { Providers } from "@/app/[lang]/providers";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UKP2SA - Unit Kerja Percepatan Pemulihan Sumatera Aceh",
    template: "%s | UKP2SA",
  },
  description:
    "Portal pemantauan dan pelaporan infrastruktur pasca bencana di Sumatera-Aceh. Laporan real-time dari masyarakat, pemerintah, dan mitra.",
  icons: {
    icon: "/assets/logo-ukp2sa.png",
  },
};



// const tailwindStyles = `
//   @layer base {
//     :root {
//       --fluid-spacing: clamp(1rem, 2vw + 1rem, 2rem);
//     }
//     html {
//       scroll-behavior: smooth;
//     }
//     body {
//       background: #F8F9FA;
//       color: #334155;
//       font-family: Inter, sans-serif;
//       overflow-x: hidden;
//       padding-top: env(safe-area-inset-top);
//       padding-bottom: env(safe-area-inset-bottom);
//     }
//     .dark body {
//       background: #0f172a;
//       color: #e2e8f0;
//     }
//   }
//   @layer components {
//     .container-fluid {
//       padding-left: 1rem;
//       padding-right: 1rem;
//       margin-left: auto;
//       margin-right: auto;
//       max-width: 1400px;
//     }
//     .bento-card {
//       background: rgba(255,255,255,0.7);
//       backdrop-filter: blur(12px);
//       border: 1px solid rgba(255,255,255,0.2);
//       border-radius: 2.5rem;
//       padding: 2rem;
//       transition: all 0.5s;
//       box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05);
//     }
//     .dark .bento-card {
//       background: rgba(15,23,42,0.7);
//       border-color: rgba(51,65,85,0.5);
//     }
//     .bento-card:hover {
//       border-color: rgba(139,92,246,0.3);
//       box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
//       transform: translateY(-6px);
//     }
//     .neon-gradient-text {
//       background: linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }
//   }
// `;

export async function generateStaticParams() {
  return [{ lang: "id" }, { lang: "en" }];
}

import { ThemeProvider } from "next-themes";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers dict={dict}>
            {children}
            <Toaster
              closeButton
              expand
              richColors
              position="bottom-right"
              theme="system"
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
