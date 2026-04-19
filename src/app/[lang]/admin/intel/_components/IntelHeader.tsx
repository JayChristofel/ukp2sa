"use client";

import React from "react";
import { Globe, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/layouts";

interface IntelHeaderProps {
  si: any;
  common: any;
}

export const IntelHeader = ({ si, common }: IntelHeaderProps) => {
  return (
    <PageHeader
      title={
        <>
          {si.title_main || "Satellite"}{" "}
          <span className="text-primary italic">
            {si.title_sub || "Intel."}
          </span>
        </>
      }
      subtitle={
        <>
          <Globe size={14} className="text-primary" />{" "}
          {si.subtitle || "Intelijen Satelit Berbasis Multi-Sumber"}
        </>
      }
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {si.esa_verified || "Terverifikasi ESA"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>
        </div>
      }
    />
  );
};
