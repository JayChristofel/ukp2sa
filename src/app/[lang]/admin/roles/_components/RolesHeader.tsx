"use client";

import React from "react";
import { Shield } from "lucide-react";

export const RolesHeader = () => {
  return (
    <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-8">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Hak Akses & Izin
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1.5 opacity-80">
            Konfigurasi Hierarki & Master Izin Sistem UKP2SA
          </p>
        </div>
      </div>
    </div>
  );
};
