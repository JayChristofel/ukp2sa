"use client";

import React from "react";
import { Search, Grid2X2, List as ListIcon } from "lucide-react";

interface AssignmentFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  tabs: { id: string; label: string }[];
  aa: any;
}

export const AssignmentFilters = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  tabs,
  aa,
}: AssignmentFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "text-slate-400 hover:text-primary dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "text-slate-400 hover:text-navy dark:hover:text-white"
            }`}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "text-slate-400 hover:text-navy dark:hover:text-white"
            }`}
          >
            <ListIcon size={16} />
          </button>
        </div>
        <div className="relative flex-1 lg:w-80 group">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={aa.search_placeholder}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
