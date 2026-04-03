"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Card } from "@/components/ui";
import {
  Globe,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Home,
  Heart,
  Image as ImageIcon,
} from "lucide-react";
import { useMapData } from "@/hooks/useMapData";
import { cn } from "@/lib/utils";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useEffect } from "react";

// --- PERFORMANCE: Dynamic Import for Map Engine ---
// Ini krusial karena Leaflet berat & butuh window object (Client-only)
const MapComponent = dynamic(
  () => import("@/components/sections/MapComponent"),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  },
);

// --- PERFORMANCE: Static Loading Placeholder (Avoids hydration mismatch & Layout shift) ---
const MapLoadingSkeleton = () => (
  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center rounded-2xl md:rounded-[2rem]">
    <div className="size-16 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-4 animate-bounce" />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Initializing Map...
    </p>
  </div>
);

export default function AdminMapPage() {
  const dict = useI18n();
  const dm = dict?.map || {};
  const common = dict?.common || {};
  const acehCenter: [number, number] = [4.6951, 96.7494];
  const { markers, isLoading } = useMapData(acehCenter);
  const [activeTab, setActiveTab] = useState<
    "all" | "reports" | "facilities" | "logistics"
  >("all");
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "MAP_VIEW",
      "INTEL",
      "User accessed the interactive geospatial operational map.",
    );
  }, [logActivity]);

  const handleTabChange = (
    tab: "all" | "reports" | "facilities" | "logistics",
  ) => {
    setActiveTab(tab);
    logActivity(
      "MAP_FILTER_CHANGE",
      "INTEL",
      `User changed map view filter to: ${tab}`,
    );
  };

  // --- DATA AGGREGATION ---
  const data = useMemo(() => {
    return {
      reports: markers.filter((m) => m.type === "report"),
      facilities: markers.filter((m) =>
        [
          "Kesehatan",
          "Pendidikan",
          "Pemerintahan",
          "Keagamaan",
          "police",
        ].includes(m.type),
      ),
      logistics: markers.filter((m) =>
        ["posko", "tend-point", "helipad", "starlink"].includes(m.type),
      ),
      missing: markers.filter((m) => m.type === "missing-person"),
    };
  }, [markers]);

  // Combined feed for the sidebar
  const unifiedFeed = useMemo(() => {
    let filtered = markers;
    if (activeTab === "reports") filtered = data.reports;
    if (activeTab === "facilities") filtered = data.facilities;
    if (activeTab === "logistics") filtered = data.logistics;

    // Sort locally - moved the priority logic outside to keep sort function pure & fast
    const getPriority = (m: any) => {
      if (m.type === "missing-person") return 3;
      if (
        m.status === (dict?.reports?.status_pending || "Menunggu") ||
        m.status === (dict?.reports?.status_process || "Diproses")
      )
        return 2;
      return 1;
    };

    return [...filtered].sort((a, b) => getPriority(b) - getPriority(a));
  }, [markers, activeTab, data, dict]);

  const stats = useMemo(
    () => ({
      totalReports: data.reports.length + data.missing.length,
      criticalFac: data.facilities.filter(
        (f) => f.status === (dict?.reports?.status_process || "Diproses"),
      ).length,
      activeLogistics: data.logistics.length,
    }),
    [data, dict],
  );

  return (
    <div className="space-y-8 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {dm.control_center || "Pusat Kendali"}{" "}
            <span className="text-primary italic">
              {dm.operational_title || "Operasional."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
            <Globe size={14} className="text-primary" />{" "}
            {dm.tactical_integration || "Integrasi Data Taktis Nasional"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} />{" "}
            {dm.verified_source || "Multi-Source Verified"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.sync_active || "Sync Active"}
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {dm.incident_missing || "Incident & Missing"}
            </h3>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-4xl font-black text-navy dark:text-white mb-2">
            {isLoading ? "..." : stats.totalReports}
          </div>
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
            {dm.reports_subtitle || "Laporan Warga & Orang Hilang"}
          </p>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {dm.affected_facilities || "Fasum Terdampak"}
            </h3>
            <Home size={16} className="text-amber-500" />
          </div>
          <div className="text-4xl font-black text-amber-500 mb-2">
            {isLoading ? "..." : stats.criticalFac}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            {dm.facilities_subtitle || "Sekolah & RS Butuh Intervensi"}
          </p>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {dm.aid_distribution || "Distribusi Bantuan"}
            </h3>
            <Heart size={16} className="text-primary" />
          </div>
          <div className="text-4xl font-black text-primary mb-2">
            {isLoading ? "..." : stats.activeLogistics}
          </div>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            {dm.logistics_subtitle || "Posko, Tenda & Titik Pendaratan"}
          </p>
        </Card>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <Card className="p-1 md:p-2 border-none shadow-2xl rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
        <div className="relative h-auto md:h-[80vh] w-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col lg:flex-row">
          {/* MAP SECTION */}
          <div className="flex-1 relative aspect-square md:aspect-auto h-[400px] md:h-full bg-slate-100 dark:bg-slate-800 rounded-2xl md:rounded-[2rem] overflow-hidden m-1 md:m-2 shadow-inner">
            <MapComponent externalMarkers={markers} />

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[450] flex gap-2">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2 md:gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black uppercase text-navy dark:text-white tracking-widest whitespace-nowrap">
                  {markers.length} {dm.objects_detected || "Objek Terdeteksi"}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC SIDEBAR (UNIFIED FEED) */}
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
                  { id: "reports", label: dict.nav.reports || "Laporan" },
                  { id: "facilities", label: dm.facilities_label || "Fasum" },
                  { id: "logistics", label: dm.logistics_label || "Logistik" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
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
              {unifiedFeed.slice(0, 30).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group relative bg-white/80 dark:bg-slate-800/40 p-4 md:p-5 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Urgency Indicator */}
                  {item.type === "missing-person" && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="size-2 rounded-full bg-rose-500 animate-ping" />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={cn(
                        "text-[9px] md:text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider",
                        item.type === "report"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : item.type === "missing-person"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-primary/10 text-primary dark:text-primary-foreground",
                      )}
                    >
                      {dm.items?.[
                        item.markerType || (item.type as keyof typeof dm.items)
                      ] ||
                        item.category ||
                        item.type}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.regency}
                    </span>
                  </div>

                  <h4 className="text-xs md:text-sm font-black text-navy dark:text-white mb-3 leading-snug uppercase tracking-tight line-clamp-2">
                    {item.title}
                  </h4>

                  {/* Dynamic Image / Placeholder */}
                  <div className="aspect-[21/9] md:aspect-[16/9] bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden border border-slate-200/50 dark:border-slate-800 flex items-center justify-center relative group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-all duration-500">
                    {(() => {
                      const d = item.data || {};
                      let imageSrc = null;

                      // 1. Path Laporan
                      const reportImg = d.attachment?.images?.[0];
                      if (reportImg) imageSrc = reportImg;
                      else {
                        // 2. Path Banjir API (Missing persons, Posko, etc)
                        const raw =
                          d.photos ||
                          d.missingPersonPhotos ||
                          d.photo ||
                          d.image ||
                          d.media;
                        if (raw) {
                          if (Array.isArray(raw))
                            imageSrc = raw[0]?.url || raw[0];
                          else if (typeof raw === "string") {
                            if (raw.startsWith("[") || raw.startsWith("{")) {
                              try {
                                const p = JSON.parse(raw);
                                imageSrc = Array.isArray(p)
                                  ? p[0]?.url || p[0]
                                  : p;
                              } catch {
                                imageSrc = raw;
                              }
                            } else {
                              imageSrc = raw;
                            }
                          }
                        }
                      }

                      if (imageSrc) {
                        return (
                          <Image
                            src={imageSrc}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 450px"
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                            unoptimized
                          />
                        );
                      }

                      // Fallback: Neutral Vector Pattern (No Text)
                      return (
                        <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                          <ImageIcon
                            size={40}
                            strokeWidth={1.5}
                            className="opacity-30"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
                          item.status ===
                            (dict?.reports?.status_done || "Selesai")
                            ? "bg-emerald-500"
                            : item.status ===
                              (dict?.reports?.status_process || "Diproses")
                            ? "bg-primary"
                            : "bg-amber-500",
                        )}
                      />
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {item.status === "Selesai"
                          ? dict?.reports?.status_done || "Selesai"
                          : item.status === "Diproses"
                          ? dict?.reports?.status_process || "Diproses"
                          : item.status === "Menunggu"
                          ? dict?.reports?.status_pending || "Menunggu"
                          : item.status}
                      </span>
                    </div>
                    <button className="text-[10px] font-black text-primary dark:text-emerald-400 uppercase tracking-widest hover:underline transition-all underline-offset-4">
                      {common.view_detail || "Detail"}
                    </button>
                  </div>
                </div>
              ))}

              {unifiedFeed.length === 0 && !isLoading && (
                <div className="py-20 text-center opacity-30 italic text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {common.no_data || "Data Tidak Ditemukan"}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
