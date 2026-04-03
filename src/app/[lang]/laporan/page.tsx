"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { PlusCircle, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { motion } from "framer-motion";

export default function LaporanMainPage() {
  const dict = useI18n();
  const c = dict?.common || {};

  return (
    <div className="space-y-12 py-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black text-navy dark:text-white uppercase tracking-tight mb-4">
          Pusat <span className="text-primary italic">Laporan Rakyat.</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
          Suarakan keluhan Anda atau pantau tindak lanjut laporan infrastruktur
          Aceh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div whileHover={{ y: -8 }}>
          <Link href="/laporan/baru">
            <Card className="p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 group hover:border-primary transition-all overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="size-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <PlusCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-3">
                  {c.button_report || "Buat Laporan"}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  Sampaikan kendala infrastruktur atau masalah sosial di wilayah
                  Anda secara langsung dengan geotagging akurat.
                </p>
                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                  Mulai Laporan <ArrowRight size={14} />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -8 }}>
          <Link href="/laporan/cek">
            <Card className="p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 group hover:border-accent transition-all overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 size-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="size-20 bg-accent/10 text-accent rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-3">
                  {c.button_monitor || "Pantau Laporan"}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  Lacak perkembangan laporan Anda secara real-time dan lihat
                  respon dari admin atau instansi terkait.
                </p>
                <div className="flex items-center gap-2 text-accent font-black uppercase text-xs tracking-widest">
                  Cek Status <ArrowRight size={14} />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>

      <div className="p-10 bg-gradient-to-br from-navy to-charcoal rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-white/10 rounded-[2rem] backdrop-blur-md">
          <ShieldCheck size={64} className="text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black uppercase tracking-tight mb-2">
            Transparansi Penanganan
          </h4>
          <p className="text-white/60 text-sm leading-relaxed font-medium">
            Setiap laporan yang masuk akan melewati sistem verifikasi tiga tahap
            (Verifikasi Lapangan, Eskalasi Instansi, dan Tuntas). Kami menjamin
            privasi identitas pelapor.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="px-6 py-3 bg-white/10 rounded-xl text-center">
            <p className="text-[10px] font-black uppercase opacity-60">
              Avg. Respon
            </p>
            <p className="text-xl font-black italic">24 Jam</p>
          </div>
        </div>
      </div>
    </div>
  );
}
