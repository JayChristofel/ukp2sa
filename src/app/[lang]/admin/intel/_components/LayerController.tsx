"use client";

import React from "react";
import { CloudRain, Mountain, Info } from "lucide-react";
import { Card } from "@/components/ui";

interface LayerControllerProps {
  layers: any[];
  loadingLayers: boolean;
  effectiveLayer: string;
  onLayerToggle: (id: string) => void;
  si: any;
  common: any;
  alerts: string[];
}

export const LayerController = ({
  layers,
  loadingLayers,
  effectiveLayer,
  onLayerToggle,
  si,
  common,
  alerts,
}: LayerControllerProps) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
        {si.active_layers || "Lapisan Aktif"}
      </h3>
      <div className="space-y-3">
        {loadingLayers ? (
          <div className="py-10 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        ) : (
          layers.map((layer: any) => (
            <button
              key={layer.id}
              onClick={() => onLayerToggle(layer.id)}
              className={`w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all text-left flex items-start gap-4 group ${
                effectiveLayer === layer.id
                  ? "bg-navy text-white border-navy shadow-2xl"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/50"
              }`}
            >
              <div
                className={`p-3 rounded-xl md:rounded-2xl transition-all ${
                  effectiveLayer === layer.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary"
                }`}
              >
                {layer.type === "Rainfall" ? (
                  <CloudRain size={20} />
                ) : (
                  <Mountain size={20} />
                )}
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-black uppercase tracking-tight mb-1">
                  {layer.name}
                </h4>
                <p
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    effectiveLayer === layer.id
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {common.status_label || "Status"}: Live
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <Card className="p-6 bg-amber-500 text-white border-none rounded-[2rem] shadow-xl">
          <Info size={32} className="mb-4 opacity-50" />
          <h4 className="text-lg font-black uppercase tracking-tight mb-2">
            {common.early_warning || "Peringatan Dini"}
          </h4>
          <p className="text-[10px] font-medium leading-relaxed opacity-90 border-l-2 border-white/20 pl-3">
            {alerts[0]}
          </p>
        </Card>
      )}
    </div>
  );
};
