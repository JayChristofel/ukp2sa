"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, Badge } from "@/components/ui";

const MapComponent = dynamic(
  () => import("@/components/sections/MapComponent"),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  },
);

const MapLoadingSkeleton = () => (
  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center rounded-[2rem]">
    <div className="size-16 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-4 animate-pulse duration-1000" />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Establishing Satellite Uplink...
    </p>
  </div>
);

interface IntelMapSectionProps {
  externalMarkers: any[];
  activeLayerName: string;
  si: any;
}

export const IntelMapSection = ({
  externalMarkers,
  activeLayerName,
  si,
}: IntelMapSectionProps) => {
  return (
    <Card className="p-2 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
      <div className="relative h-[70vh] w-full rounded-[2rem] overflow-hidden">
        <MapComponent showMarkers={true} externalMarkers={externalMarkers} />
        <div className="absolute top-4 right-4 md:top-6 md:right-16 z-[450]">
          <Badge className="bg-navy/80 backdrop-blur-md text-white border-white/10 rounded-lg px-4 py-2 flex items-center gap-2 shadow-2xl">
            <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
              {si.active_analysis || "Active Analysis"}: {activeLayerName}
            </span>
          </Badge>
        </div>
      </div>
    </Card>
  );
};
