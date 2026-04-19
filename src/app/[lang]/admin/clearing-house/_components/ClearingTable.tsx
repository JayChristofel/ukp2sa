"use client";

import React from "react";
import { Search, Loader2, SearchX } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { ClearingTableRow } from "./ClearingTableRow";

interface ClearingTableProps {
  isLoading: boolean;
  list: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  ach: any;
  common: any;
  d: any;
  lang: string;
}

export const ClearingTable = ({
  isLoading,
  list,
  searchTerm,
  setSearchTerm,
  ach,
  common,
  d,
  lang,
}: ClearingTableProps) => {
  return (
    <Card className="border-none shadow-2xl rounded-[2rem] md:rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-4 bg-primary text-white rounded-2xl md:rounded-[1.5rem] shadow-glow-primary shrink-0">
              <Search size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-black text-navy dark:text-white uppercase tracking-tight truncate">
                Clearing Engine v1.0
              </h3>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Scanning Active
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-5">{ach.sector_label} / PROYEK</th>
              <th className="px-8 py-5">{ach.sector_label}</th>
              <th className="px-8 py-5">{ach.status_label}</th>
              <th className="px-8 py-5">CONFIDENCE</th>
              <th className="px-8 py-5 text-right font-display text-primary">
                {common.action || "Aksi"}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="size-8 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                    {ach.loading_data}
                  </p>
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] text-slate-300 dark:text-slate-700">
                      <SearchX size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">
                        {ach.empty_title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                        {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : ach.empty_desc}
                      </p>
                    </div>
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-[10px] font-black uppercase text-primary hover:bg-primary/10 rounded-xl px-6"
                      >
                        {common.reset || "Reset Pencarian"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              list.map((item: any) => (
                <ClearingTableRow 
                  key={item.id} 
                  item={item} 
                  ach={ach} 
                  d={d} 
                  common={common} 
                  lang={lang} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
