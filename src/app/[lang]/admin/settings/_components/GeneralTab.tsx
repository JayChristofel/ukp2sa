"use client";

import React from "react";
import { Monitor, Layout } from "lucide-react";
import { Card, Input, Label } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";

interface GeneralTabProps {
  s: any;
}

export const GeneralTab = ({ s }: GeneralTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-10 border-none rounded-[2.5rem] shadow-xl space-y-8 bg-white dark:bg-navy/50">
          <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Monitor size={20} className="text-primary" />{" "}
            {s.visual_identity || "Visual Identity"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                {s.app_name || "App Name"}
              </Label>
              <Input
                defaultValue="UKP2SA Situation Room"
                className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-900 border-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                {s.app_slogan || "App Slogan"}
              </Label>
              <Input
                defaultValue="Monitor, Tindak Lanjut, Pulihkan."
                className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-900 border-none font-bold"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                {s.metadata_desc || "Metadata Description"}
              </Label>
              <Textarea
                defaultValue="Pusat Kendali Pemulihan Nasional UKP2SA: Memantau hasil capaian, penyerapan anggaran, dan sentimen publik."
                className="rounded-3xl px-5 py-4 min-h-[100px] bg-slate-50 dark:bg-slate-900 border-none font-bold resize-none"
              />
            </div>
          </div>
        </Card>
        <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6 bg-white dark:bg-navy/50">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {s.logo_assets || "Logo & Assets"}
          </h3>
          <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary transition-all">
            <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
              <Layout size={32} />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-primary transition-colors tracking-widest text-center leading-relaxed">
              {s.upload_logo || "Upload Logo"}
              <br />
              <span className="lowercase font-bold opacity-60">
                PNG/SVG Max 2MB
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
