"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MoveLeft, Home, Search, Compass } from "lucide-react";

export default function NotFoundPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] size-[60%] bg-primary-600/10 dark:bg-primary-500/15 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] size-[60%] bg-accent-600/10 dark:bg-accent-500/15 rounded-full blur-[160px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 bg-white/50 dark:bg-primary-900/30 rounded-2xl border border-primary-100 dark:border-primary-800 shadow-bento backdrop-blur-md">
            <Compass className="size-4 animate-spin-slow" />
            Kode Error: 404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative mb-8"
        >
          <h1 className="text-[120px] md:text-[180px] font-black text-slate-900 dark:text-white leading-none tracking-tighter opacity-10 dark:opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Tersesat di{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                Luar Angkasa?
              </span>
            </h2>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-medium"
        >
          Halaman yang lo cari kayaknya udah pindah planet atau emang nggak
          pernah ada. Coba balik ke markas pusat dulu aja gimana?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href={`/${lang}`}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-primary-500/25 hover:scale-105 active:scale-95"
          >
            <Home className="size-5 transition-transform group-hover:-translate-y-0.5" />
            Kembali ke Pusat
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-bento"
          >
            <MoveLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            Kembali
          </button>
        </motion.div>
      </div>

      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[10%] hidden lg:block"
      >
        <div className="size-20 rounded-[2rem] bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 flex items-center justify-center shadow-2xl">
          <Search className="size-10 text-primary-500/40" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 left-[10%] hidden lg:block"
      >
        <div className="size-16 rounded-full bg-accent-500/10 dark:bg-accent-500/20 blur-xl" />
      </motion.div>
    </div>
  );
}
