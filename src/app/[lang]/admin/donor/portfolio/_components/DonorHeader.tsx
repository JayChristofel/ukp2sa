"use client";

import React from "react";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui";

interface DonorHeaderProps {
  dd: any;
  onDownload: () => void;
}

export const DonorHeader = ({ dd, onDownload }: DonorHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase font-display">
          {dd.title_main || "Dampak"}{" "}
          <span className="text-primary italic">
            {dd.title_sub || "Saya."}
          </span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2 font-display">
          <Award size={16} className="text-primary" />{" "}
          {dd.subtitle || "Dashboard Kepercayaan Donatur Personal"}
        </p>
      </div>

      <Button 
        onClick={onDownload}
        className="rounded-2xl px-6 py-6 border-none shadow-xl bg-primary text-white font-black uppercase tracking-widest text-xs flex gap-2 hover:bg-primary/90 transition-all font-display"
      >
        <Download size={18} />{" "}
        {dd.download_report || "Unduh Laporan Keberlanjutan"}
      </Button>
    </div>
  );
};
