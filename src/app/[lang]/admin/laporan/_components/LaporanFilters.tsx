"use client";

import React from "react";
import { 
  Grid2X2, 
  LayoutGrid, 
  List as ListIcon, 
  Filter, 
  Search 
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface LaporanFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  viewMode: "grid" | "list" | "bento";
  setViewMode: (mode: "grid" | "list" | "bento") => void;
  filterPriority: string;
  setFilterPriority: (val: string) => void;
  filterSource: string;
  setFilterSource: (val: string) => void;
  ar: any;
  common: any;
}

export const LaporanFilters = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filterPriority,
  setFilterPriority,
  filterSource,
  setFilterSource,
  ar,
  common,
}: LaporanFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
        <div className="px-4 py-2 bg-primary/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
          Intelligence Center
        </div>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto">
        {/* View Mode Switcher */}
        <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-1">
          <button
            onClick={() => setViewMode("bento")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "bento"
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "text-slate-400 hover:text-navy dark:hover:text-white"
            }`}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "text-slate-400 hover:text-navy dark:hover:text-white"
            }`}
          >
            <LayoutGrid size={16} />
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

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest gap-2 relative px-4 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
            >
              <Filter size={16} />
              {(filterPriority !== "all" || filterSource !== "all") && (
                <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[8px] border-none shadow-lg">
                  {[filterPriority, filterSource].filter((f) => f !== "all").length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 rounded-3xl p-3 border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50"
          >
            <div className="p-2">
              <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                {ar.priority_label}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterPriority} onValueChange={setFilterPriority}>
                <DropdownMenuRadioItem value="all" className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {ar.all_priority}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high" className="rounded-xl px-3 py-2.5 font-bold text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                  {ar.prio_high}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium" className="rounded-xl px-3 py-2.5 font-bold text-xs text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                  {ar.prio_medium}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low" className="rounded-xl px-3 py-2.5 font-bold text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                  {ar.prio_low}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator className="my-4 bg-slate-100 dark:bg-slate-800" />

              <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                {ar.source_label}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterSource} onValueChange={setFilterSource}>
                <DropdownMenuRadioItem value="all" className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {ar.all_sources}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="laporan" className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {ar.src_reports}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sar" className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {ar.src_sar}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="konflik" className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {ar.src_conflicts}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              {(filterPriority !== "all" || filterSource !== "all") && (
                <>
                  <DropdownMenuSeparator className="my-4 bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    onClick={() => {
                      setFilterPriority("all");
                      setFilterSource("all");
                    }}
                    className="text-[10px] font-black uppercase text-rose-500 justify-center h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                  >
                    {common.reset_filter || "Reset Filter"}
                  </DropdownMenuItem>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="relative flex-1 lg:w-80 group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={ar.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
