"use client";

import React from "react";
import { Card } from "../ui";
import dynamic from "next/dynamic";

// Dynamic import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-400">
          {typeof window !== "undefined" &&
          localStorage.getItem("lang") === "en"
            ? "Loading Map..."
            : "Memuat Peta..."}
        </div>
      </div>
    );
  },
});

import { useI18n } from "@/app/[lang]/providers";

export const MapSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.map || {};

  return (
    <section id="peta" className="flex flex-col gap-6 md:gap-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-navy dark:text-white tracking-tight leading-tight">
            {d.title || "Peta Pemulihan Strategis"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
            {d.description ||
              "Visualisasi titik infrastruktur bermasalah di wilayah Aceh"}
          </p>
        </div>
      </div>

      <Card className="relative w-full h-[500px] md:h-[650px] overflow-hidden group border-0 shadow-2xl bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 z-0">
          <MapComponent />
        </div>
      </Card>
    </section>
  );
};
