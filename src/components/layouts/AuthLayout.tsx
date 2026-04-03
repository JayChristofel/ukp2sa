"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] size-[50%] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] size-[50%] bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bento-card bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Gear Decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin-slow"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 0-2-2h-.44a2 2 0 0 0-2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 0-2 2h.44a2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 0 2 2v-.44a2 2 0 0 0-2-2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors gap-2 group mb-4"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                KEMBALI KE BERANDA
              </Link>

              <div className="flex items-center gap-4 mb-2">
                <div className="size-12 rounded-2xl flex items-center justify-center bg-white/50 dark:bg-slate-800/80 p-2 shadow-glow border border-white/20 dark:border-slate-700/50">
                  <Image
                    src="/assets/logo-ukp2sa.png"
                    alt="Logo Light"
                    width={48}
                    height={48}
                    priority
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <Image
                    src="/assets/logo-ukp2sa.png"
                    alt="Logo Dark"
                    width={48}
                    height={48}
                    priority
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-black text-navy dark:text-white tracking-tight leading-none uppercase">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">{children}</div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                © 2026 UKP2SA - Unit Kerja Percepatan Pemulihan Aceh. ALL RIGHTS
                RESERVED.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
