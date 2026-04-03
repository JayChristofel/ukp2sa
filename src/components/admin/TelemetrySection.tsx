"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItem {
  label: string;
  status: string;
  color: string;
  progress: number;
}

interface TelemetrySectionProps {
  services: ServiceItem[];
}

export const TelemetrySection: React.FC<TelemetrySectionProps> = ({
  services,
}) => {
  return (
    <div className="bento-card border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-black dark:text-white mb-6 md:mb-8 uppercase tracking-tight">
        Service Telemetry
      </h3>
      <div className="space-y-6 md:space-y-8">
        {services.map((service) => (
          <div key={service.label}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] md:text-xs font-black dark:text-slate-200 uppercase tracking-tight">
                {service.label}
              </span>
              <span
                className={cn(
                  "text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-md border",
                  `bg-${service.color}-500/10 text-${service.color}-500 border-${service.color}-500/20`,
                )}
              >
                {service.status}
              </span>
            </div>
            <div className="h-1.5 md:h-2 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${service.progress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={cn(
                  "h-full rounded-full",
                  `bg-${service.color}-500 shadow-[0_0_12px_rgba(var(--color-rgb),0.5)]`,
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-primary-600/5 border border-primary-600/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert size={32} className="text-primary-500" />
        </div>
        <p className="text-[9px] md:text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-3">
          Security Advisory
        </p>
        <p className="text-[9px] md:text-[10px] text-slate-500 leading-relaxed font-bold italic">
          Enkripsi data via Satellite C-Band aktif. Protokol keamanan lapis 3
          sedang memantau trafik anomali di wilayah pesisir.
        </p>
      </div>
    </div>
  );
};
