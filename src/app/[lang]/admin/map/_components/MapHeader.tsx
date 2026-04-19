"use client";

import React from "react";
import { Globe, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/layouts";

interface MapHeaderProps {
  dm: any;
  common: any;
}

export const MapHeader = ({ dm, common }: MapHeaderProps) => {
  return (
    <PageHeader
      title={
        <>
          {dm.control_center || "Pusat Kendali"}{" "}
          <span className="text-primary italic">
            {dm.operational_title || "Operasional."}
          </span>
        </>
      }
      subtitle={
        <>
          <Globe size={14} className="text-primary" />{" "}
          {dm.tactical_integration || "Integrasi Data Taktis Nasional"}
        </>
      }
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} />{" "}
            {dm.verified_source || "Multi-Source Verified"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.sync_active || "Sync Active"}
          </div>
        </div>
      }
    />
  );
};
