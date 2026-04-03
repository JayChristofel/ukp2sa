"use client";

import React from "react";
import { Waves, TrafficCone, Home, Brush } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui";

import { useI18n } from "@/app/[lang]/providers";

const ICONS = [
  <Waves size={32} key="waves" />,
  <TrafficCone size={32} key="traffic" />,
  <Home size={32} key="home" />,
  <Brush size={32} key="brush" />,
];

const COLORS = [
  { color: "text-red-500", bg: "bg-red-500/10" },
  { color: "text-blue-500", bg: "bg-blue-500/10" },
  { color: "text-primary", bg: "bg-primary/10" },
  { color: "text-accent", bg: "bg-accent/10" },
];

export const ProgramSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.programs || {};

  interface Program {
    name: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }

  const programs: Program[] = (d.program_list || []).map(
    (p: { name: string; desc: string }, i: number) => ({
      ...p,
      icon: ICONS[i] || <Waves size={32} />,
      color: COLORS[i]?.color || "text-primary",
      bg: COLORS[i]?.bg || "bg-primary/10",
    }),
  );

  return (
    <section className="flex flex-col gap-10 md:gap-16" id="program">
      <div className="flex flex-col gap-3 text-center items-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tight leading-tight">
          {d.title || "Program & Pemangku"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-0">
        {programs.map((program) => (
          <Card
            key={program.name}
            className="p-8 md:p-8 flex flex-col items-center text-center group hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer border-slate-100 dark:border-slate-800/50 rounded-[2rem]"
          >
            <div
              className={`size-20 rounded-[2rem] ${program.bg} ${program.color} flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-8 shadow-inner`}
            >
              {program.icon}
            </div>
            <h4 className="font-black text-navy dark:text-white text-xl tracking-tight mb-4 group-hover:text-primary transition-colors">
              {program.name}
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-2 mb-6">
              {program.desc}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-auto">
              <Link
                href={`/${dict.lang || "id"}/portal/program/id?id=${
                  program.name
                }`}
                className="text-[10px] font-black bg-primary text-white px-6 py-2.5 rounded-full hover:bg-navy transition-all uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                {d.button || "Buka Portal Program"}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
