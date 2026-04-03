"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, RefreshCcw, Home, Terminal } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const generatedId = useId().replace(/:/g, "").toUpperCase();
  const reportId = error.digest || generatedId;
  
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[80%] bg-red-500/10 dark:bg-red-500/10 rounded-full blur-[160px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 shadow-bento backdrop-blur-md">
            <AlertCircle className="size-4 animate-pulse" />
            Kesalahan Sistem
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
        >
          Something <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Went Wrong.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-medium"
        >
          {error.message || "Waduh, server kita lagi ngambek atau ada kabel yang putus nih. Santai dulu, tim enginer kita lagi 'sat-set' benerin kok."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => reset()}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
          >
            <RefreshCcw className="size-5 transition-transform group-hover:rotate-180 duration-500" />
            Coba Lagi
          </button>
          <Link
            href={`/${lang}`}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-bento"
          >
            <Home className="size-5" />
            Ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 w-full"
        >
          <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Terminal className="size-3" />
            System Digest: {reportId}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

