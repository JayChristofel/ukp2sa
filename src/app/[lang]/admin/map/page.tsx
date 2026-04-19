"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui";
import { useMapData } from "@/hooks/useMapData";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";

// Modular Components
import { MapHeader } from "./_components/MapHeader";
import { OperationalStats } from "./_components/OperationalStats";
import { FeedSidebar } from "./_components/FeedSidebar";

const MapComponent = dynamic(
  () => import("@/components/sections/MapComponent"),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  },
);

const MapLoadingSkeleton = () => (
  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center rounded-2xl md:rounded-[2rem]">
    <div className="size-16 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-4 animate-bounce" />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing Map...</p>
  </div>
);

export default function AdminMapPage() {
  const dict = useI18n();
  const dm = dict?.map || {};
  const common = dict?.common || {};
  const acehCenter: [number, number] = [4.6951, 96.7494];
  const { markers, isLoading } = useMapData(acehCenter);
  const [activeTab, setActiveTab] = useState<"all" | "reports" | "facilities" | "logistics">("all");
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity("MAP_VIEW", "INTEL", "User accessed the interactive geospatial operational map.");
  }, [logActivity]);

  const handleTabChange = (tab: "all" | "reports" | "facilities" | "logistics") => {
    setActiveTab(tab);
    logActivity("MAP_FILTER_CHANGE", "INTEL", `User changed map view filter to: ${tab}`);
  };

  const data = useMemo(() => ({
    reports: markers.filter((m) => m.type === "report"),
    facilities: markers.filter((m) => ["Kesehatan", "Pendidikan", "Pemerintahan", "Keagamaan", "police"].includes(m.type)),
    logistics: markers.filter((m) => ["posko", "tend-point", "helipad", "starlink"].includes(m.type)),
    missing: markers.filter((m) => m.type === "missing-person"),
  }), [markers]);

  const unifiedFeed = useMemo(() => {
    let filtered = markers;
    if (activeTab === "reports") filtered = data.reports;
    if (activeTab === "facilities") filtered = data.facilities;
    if (activeTab === "logistics") filtered = data.logistics;

    const getPriority = (m: any) => {
      if (m.type === "missing-person") return 3;
      if (m.status === (dict.reports?.status_pending || "Menunggu") || m.status === (dict.reports?.status_process || "Diproses")) return 2;
      return 1;
    };
    return [...filtered].sort((a, b) => getPriority(b) - getPriority(a));
  }, [markers, activeTab, data, dict]);

  const stats = useMemo(() => ({
    totalReports: data.reports.length + data.missing.length,
    criticalFac: data.facilities.filter((f) => f.status === (dict.reports?.status_process || "Diproses")).length,
    activeLogistics: data.logistics.length,
  }), [data, dict]);

  return (
    <div className="space-y-8 pb-20">
      <MapHeader dm={dm} common={common} />
      <OperationalStats stats={stats} isLoading={isLoading} dm={dm} />

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

          <FeedSidebar 
            activeTab={activeTab} onTabChange={handleTabChange}
            unifiedFeed={unifiedFeed} isLoading={isLoading}
            dm={dm} common={common} dict={dict}
          />
        </div>
      </Card>
    </div>
  );
}
