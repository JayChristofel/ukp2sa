"use client";

import React from "react";
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Calendar 
} from "lucide-react";
import { Card } from "@/components/ui";

interface PersonalDataCardProps {
  t: any;
  personalData: any;
  lang: string;
}

export const PersonalDataCard = ({
  t,
  personalData,
  lang,
}: PersonalDataCardProps) => {
  return (
    <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden relative font-display mt-8">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <ShieldCheck size={180} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 relative z-10">
        <div>
          <h3 className="text-4xl font-black text-navy dark:text-white leading-tight uppercase tracking-tight">
            {personalData.name}
          </h3>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
            <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-lg">{personalData.nik}</span>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-rose-500" /> {personalData.regency}
            </span>
          </div>
        </div>
        <div className="px-6 py-2.5 bg-emerald-500/10 text-emerald-600 rounded-full h-fit text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-sm">
          {t.data_verified || "Data Terverifikasi"}
        </div>
      </div>

      <div className="relative z-10 pl-4">
        {/* Timeline Dynamic Line */}
        <div className="absolute left-[23px] top-6 bottom-6 w-1 bg-slate-100 dark:bg-slate-800 rounded-full" />

        <div className="space-y-12">
          {personalData.timeline.map((event: any, idx: number) => (
            <div key={idx} className="flex gap-10 relative group">
              <div
                className={`size-12 rounded-2xl flex items-center justify-center z-10 shadow-2xl border-4 border-white dark:border-slate-900 transition-transform group-hover:scale-110 ${
                  event.status === "Completed"
                    ? "bg-green-500 text-white"
                    : event.status === "In Progress"
                    ? "bg-primary text-white animate-pulse"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {event.status === "Completed" ? (
                  <CheckCircle2 size={20} />
                ) : event.status === "In Progress" ? (
                  <Clock size={20} />
                ) : (
                  <div className="size-3 rounded-full bg-current" />
                )}
              </div>

              <div className="flex-1 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                  <div>
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg uppercase tracking-widest inline-block mb-2">
                      {event.stage}
                    </span>
                    <h4 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
                      {event.note}
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 sm:justify-end tracking-widest">
                      <Calendar size={12} className="text-primary" />{" "}
                      {new Date(event.date).toLocaleDateString(
                        lang === "en" ? "en-US" : "id-ID",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 mt-1 uppercase tracking-widest">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
