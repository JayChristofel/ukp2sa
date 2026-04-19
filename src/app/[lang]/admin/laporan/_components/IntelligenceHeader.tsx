"use client";

import React from "react";
import { Globe, ShieldCheck, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layouts";
import Link from "next/link";

interface IntelligenceHeaderProps {
  ar: any;
  common: any;
  lang: string;
}

export const IntelligenceHeader = ({ ar, common, lang }: IntelligenceHeaderProps) => {
  return (
    <PageHeader
      title={
        <>
          {ar.title_main || "Intelligence"}{" "}
          <span className="text-primary italic">
            {ar.title_sub || "Reports."}
          </span>
        </>
      }
      subtitle={
        <>
          <Globe size={14} className="text-primary" />{" "}
          {ar.subtitle || "Pusat Monitoring Aduan & Intelijen Lapangan"}
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {ar.verify_source || "Source Verified"}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>
          <Button
            asChild
            className="bg-primary text-white px-8 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
          >
            <Link href={`/${lang}/admin/laporan/add`} prefetch={true}>
              <Plus size={18} /> {ar.btn_new}
            </Link>
          </Button>
        </div>
      }
    />
  );
};
