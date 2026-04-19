"use client";

import React from "react";
import { Activity, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FeedSidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  unifiedFeed: any[];
  isLoading: boolean;
  dm: any;
  common: any;
  dict: any;
}

export const FeedSidebar = ({
  activeTab,
  onTabChange,
  unifiedFeed,
  isLoading,
  dm,
  common,
  dict,
}: FeedSidebarProps) => {
  return (
    <div className="w-full lg:w-[450px] bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-3xl flex flex-col h-[500px] md:h-full border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
      {/* TABS CONTROLLER */}
      <div className="p-4 md:p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-2.5 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl text-primary">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black text-navy dark:text-white uppercase tracking-tight">
              {dm.feed_documentation || "Feed Dokumentasi"}
            </h3>
            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              {dm.integrated_field_update || "Update Lapangan Terpadu"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {[
            { id: "all", label: common.all || "Semua" },
            { id: "reports", label: dict.nav?.reports || "Laporan" },
            { id: "facilities", label: dm.facilities_label || "Fasum" },
            { id: "logistics", label: dm.logistics_label || "Logistik" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={cn(
                "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-navy dark:bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE FEED */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar bg-white/30 dark:bg-transparent">
        {unifiedFeed.slice(0, 30).map((item, idx) => {
          const d = item.data || {};
          let imageSrc = null;
          
          // Priority 1: Supabase/Internal Report Attachments
          const reportImg = d.attachment?.images?.[0] || d.attachments?.[0];
          
          if (reportImg) {
            imageSrc = typeof reportImg === "string" ? reportImg : reportImg.url || reportImg.path;
          } else {
            // Priority 2: Generic fields including 'documentation' from NGO data
            const raw = d.photos || d.missingPersonPhotos || d.photo || d.image || d.media || d.documentation;
            
            if (raw) {
              if (Array.isArray(raw)) {
                imageSrc = raw[0]?.url || raw[0]?.path || raw[0];
              } else if (typeof raw === "string") {
                // If it's a direct URL or a stringified JSON
                if (raw.startsWith("[") || raw.startsWith("{")) {
                  try {
                    const p = JSON.parse(raw);
                    imageSrc = Array.isArray(p) ? p[0]?.url || p[0] : p.url || p;
                  } catch { imageSrc = raw; }
                } else { 
                  // Check if it's a URL
                  if (raw.startsWith("http")) {
                    imageSrc = raw;
                    // Google Drive Transformer: convert view link to direct image link
                    if (raw.includes("drive.google.com")) {
                      const fileId = raw.match(/\/d\/(.+?)\//)?.[1] || raw.split("id=")[1];
                      if (fileId) imageSrc = `https://lh3.googleusercontent.com/d/${fileId.split("&")[0]}`;
                    }
                  }
                }
              }
            }
          }

          return (
            <div
              key={item.id || idx}
              className="group relative bg-white/80 dark:bg-slate-800/40 p-4 md:p-5 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1"
            >
              {item.type === "missing-person" && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="size-2 rounded-full bg-rose-500 animate-ping" />
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <span className={cn(
                  "text-[9px] md:text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider",
                  item.type === "report" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  item.type === "missing-person" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                  "bg-primary/10 text-primary dark:text-primary-foreground"
                )}>
                  {dm.items?.[item.markerType || (item.type as keyof typeof dm.items)] || item.category || item.type}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.regency}
                </span>
              </div>

              <h4 className="text-xs md:text-sm font-black text-navy dark:text-white mb-3 leading-snug uppercase tracking-tight line-clamp-2">
                {item.title}
              </h4>

              <div className="aspect-[21/9] md:aspect-[16/9] bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden border border-slate-200/50 dark:border-slate-800 flex items-center justify-center relative group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-all duration-500">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                    <ImageIcon size={40} strokeWidth={1.5} className="opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "size-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
                    item.status === (dict.reports?.status_done || "Selesai") ? "bg-emerald-500" :
                    item.status === (dict.reports?.status_process || "Diproses") ? "bg-primary" : "bg-amber-500"
                  )} />
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {item.status === "Selesai" ? dict.reports?.status_done || "Selesai" :
                     item.status === "Diproses" ? dict.reports?.status_process || "Diproses" :
                     item.status === "Menunggu" ? dict.reports?.status_pending || "Menunggu" : item.status}
                  </span>
                </div>
                <button className="text-[10px] font-black text-primary dark:text-emerald-400 uppercase tracking-widest hover:underline transition-all underline-offset-4">
                  {common.view_detail || "Detail"}
                </button>
              </div>
            </div>
          );
        })}

        {unifiedFeed.length === 0 && !isLoading && (
          <div className="py-20 text-center opacity-30 italic text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {common.no_data || "Data Tidak Ditemukan"}
          </div>
        )}
      </div>
    </div>
  );
};
