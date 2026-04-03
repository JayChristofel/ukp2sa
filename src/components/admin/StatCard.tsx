"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: "primary" | "accent" | "emerald" | "indigo" | "rose" | "amber";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sub,
  icon,
  color,
  className,
}) => {
  const colorMap = {
    primary:
      "from-primary-500/10 to-primary-500/5 text-primary-500 border-primary-500/20 shadow-primary-500/10",
    accent:
      "from-accent-500/10 to-accent-500/5 text-accent-500 border-accent-500/20 shadow-accent-500/10",
    emerald:
      "from-emerald-500/10 to-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
    indigo:
      "from-indigo-500/10 to-indigo-500/5 text-indigo-500 border-indigo-500/20 shadow-indigo-500/10",
    rose: "from-rose-500/10 to-rose-500/5 text-rose-500 border-rose-500/20 shadow-rose-500/10",
    amber:
      "from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20 shadow-amber-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bento-card relative overflow-hidden group border-slate-200/50 dark:border-slate-800/50",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 size-24 rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-all duration-500 bg-current",
          `text-${color}-500`,
        )}
      />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] text-slate-500 font-black mb-1 uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-3xl font-black dark:text-white tabular-nums">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "p-3 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm",
            colorMap[color],
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
          <ArrowUpRight size={12} className="mr-1" /> LIVE
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          {sub}
        </span>
      </div>
    </motion.div>
  );
};
