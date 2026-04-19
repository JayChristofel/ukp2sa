"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

const MapLoadingSkeleton = () => (
  <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center animate-pulse">
    <div className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4 animate-bounce" />
    <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
  </div>
);

import { useI18n } from "@/app/[lang]/providers";

export const MapSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.map || {};

  return (
    <section id="peta" className="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Live Intel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tight leading-tight">
            {d.title || "Strategic Recovery Map"}
          </h2>
          <p className="max-w-2xl text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed">
            {d.description || "Real-time visualization of geographic recovery efforts and infrastructure integrity across Aceh."}
          </p>
        </div>
      </div>

      <div className="relative w-full h-[500px] md:h-[700px] rounded-[2.5rem] p-1.5 md:p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
        <div className="absolute inset-0 z-0 rounded-[2.2rem] overflow-hidden m-1.5 md:m-2">
          <MapComponent />
        </div>
      </div>
    </section>
  );
};
