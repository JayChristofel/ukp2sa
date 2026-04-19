"use client";

import React from "react";
import { Loader2, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportCard } from "./ReportCard";

interface ReportGridProps {
  isLoading: boolean;
  reports: any[];
  viewMode: "grid" | "list" | "bento";
  onViewDetail: (report: any) => void;
  onDispatch: (report: any) => void;
  locale: any;
  getPriorityColor: (p: string) => string;
  ar: any;
}

export const ReportGrid = ({
  isLoading,
  reports,
  viewMode,
  onViewDetail,
  onDispatch,
  locale,
  getPriorityColor,
  ar,
}: ReportGridProps) => {
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
          {ar.loading_feed}
        </p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl border-2 border-dashed border-slate-200 dark:border-slate-800"
      >
        <div className="size-20 md:size-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
          <SearchX size={48} />
        </div>
        <p className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter mb-1">
          {ar.empty_title}
        </p>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[280px] md:max-w-[300px] mx-auto leading-relaxed px-4">
          {ar.empty_desc}
        </p>
      </motion.div>
    );
  }

  return (
    <div
      className={`grid gap-4 md:gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : viewMode === "list"
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-4 lg:grid-cols-6"
      }`}
    >
      <AnimatePresence mode="popLayout">
        {reports.map((report: any, idx: number) => (
          <ReportCard
            key={report.id}
            report={report}
            viewMode={viewMode}
            index={idx}
            onViewDetail={onViewDetail}
            onDispatch={(e) => {
              e.stopPropagation();
              onDispatch(report);
            }}
            locale={locale}
            getPriorityColor={getPriorityColor}
            ar={ar}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
