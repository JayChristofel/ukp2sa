"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
  const dict = useI18n();
  const common = dict?.common || {};

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
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

      <div className="relative z-10 w-full max-w-lg sm:max-w-md my-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bento-card bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem]"
        >
          {/* Internal Language Switcher (Responsive Safe) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 relative z-10">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="inline-flex items-center text-[10px] font-black tracking-widest text-slate-400 hover:text-primary transition-colors gap-2 group mb-4 uppercase"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                {common.back_to_home || (dict?.common?.back || "BACK")}
              </Link>

              <div className="flex flex-col gap-4 mb-2">
                <div className="size-14 rounded-[1.25rem] flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-white/5 p-2.5">
                  <Image
                    src="/assets/logo-ukp2sa.png"
                    alt="Logo"
                    width={56}
                    height={56}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl sm:text-3xl font-black text-navy dark:text-white tracking-tighter leading-[1.1] uppercase max-w-[80%]">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">{children}</div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center leading-relaxed max-w-[280px]">
                {common.copyright || "© 2026 UKP2SA - Unit Kerja Percepatan Pemulihan Sumatera Aceh. ALL RIGHTS RESERVED."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
