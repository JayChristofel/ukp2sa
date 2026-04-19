"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

export const StatCard = ({
  title,
  value,
  sub,
  icon,
  color,
  change = "0%",
}: StatCardProps) => {
  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");
  const hasChange =
    change !== "0%" &&
    change !== "+0.0%" &&
    change !== "+0%" &&
    change !== "-0.0%" &&
    change !== "0.0%";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-5 md:p-6 lg:p-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-xl relative overflow-hidden group"
    >
      <div
        className={`absolute -right-4 -top-4 size-20 md:size-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all duration-500`}
      />
      <div className="flex justify-between items-start relative z-10">
        <div className="min-w-0">
          <p className="text-[10px] md:text-sm text-slate-500 font-bold mb-1 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black dark:text-white tabular-nums truncate">
            {value}
          </h3>
        </div>
        <div
          className={`p-2.5 md:p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 flex-shrink-0 ml-2`}
        >
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<any>, { 
                size: 20, 
                className: `${(icon.props as any).className || ""} md:size-6` 
              }) 
            : icon}
        </div>
      </div>
      <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-2 relative z-10">
        {hasChange && (
          <span
            className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "text-emerald-500 bg-emerald-500/10"
                : isNegative
                ? "text-rose-500 bg-rose-500/10"
                : "text-slate-400 bg-slate-400/10"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <TrendingUp size={12} className="rotate-180" />
            )}{" "}
            {change}
          </span>
        )}
        <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">{sub}</span>
      </div>
    </motion.div>
  );
};
