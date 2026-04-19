"use client";

import React from "react";
import { Search } from "lucide-react";

interface TrackingSearchProps {
  t: any;
  common: any;
  searchNIK: string;
  setSearchNIK: (val: string) => void;
  isSearching: boolean;
  onSearch: () => void;
}

export const TrackingSearch = ({
  t,
  common,
  searchNIK,
  setSearchNIK,
  isSearching,
  onSearch,
}: TrackingSearchProps) => {
  return (
    <section className="p-10 bg-primary/5 rounded-[3.5rem] border-2 border-dashed border-primary/20 font-display">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-navy dark:text-white uppercase tracking-tight">
            {t.personal_title || "Personal Recovery Tracking"}
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            {t.personal_desc || "Pantau status pemulihan individu via NIK (Digital ID)"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1 group">
            <Search
              size={20}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder={t.nik_placeholder || "Masukkan 16 Digit NIK..."}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-2xl focus:ring-4 focus:ring-primary/20 font-bold transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
              value={searchNIK}
              onChange={(e) => setSearchNIK(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="px-10 h-[64px] bg-navy dark:bg-primary text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-glow-primary border-none disabled:opacity-50"
          >
            {isSearching ? common.searching || "Mencari..." : common.search || "Search"}
          </button>
        </div>
      </div>
    </section>
  );
};
