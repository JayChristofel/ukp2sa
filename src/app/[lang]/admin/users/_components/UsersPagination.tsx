"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  dict: any;
  lang: string;
}

export const UsersPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  dict,
  lang,
}: UsersPaginationProps) => {
  return (
    <div className="p-6 md:p-10 border-t border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md rounded-b-[3rem] font-display">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">
          {lang === "en" ? "Showing" : "Menampilkan"}{" "}
          <span className="text-navy dark:text-white">
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          {lang === "en" ? "of" : "dari"}{" "}
          <span className="text-primary">{totalItems}</span> users
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-30 border-none"
          >
            <ChevronLeft size={16} />
            {dict?.common?.previous || "Prev"}
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-glow-primary hover:bg-primary/90 transition-all disabled:opacity-30 border-none"
          >
            {dict?.common?.next || "Next"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
