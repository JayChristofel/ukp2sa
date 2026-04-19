"use client";

import React from "react";

interface SectorFiltersProps {
  sectors: { id: string; label: string }[];
  selectedSector: string;
  onSelect: (id: string) => void;
}

export const SectorFilters = ({
  sectors,
  selectedSector,
  onSelect,
}: SectorFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      {sectors.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            selectedSector === s.id
              ? "bg-navy text-white shadow-xl"
              : "bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:text-primary"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};
