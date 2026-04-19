"use client";

import React from "react";
import { Filter, Search, ShieldAlert, Globe, ShieldCheck, Zap } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuCheckboxItem, 
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layouts";

interface ClearingHeaderProps {
  ach: any;
  common: any;
  d: any;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string[];
  setStatusFilter: (filter: any) => void;
  sectorFilter: string[];
  setSectorFilter: (filter: any) => void;
  agencyFilter: string[];
  setAgencyFilter: (filter: any) => void;
  sectors: string[];
  agencies: string[];
  onScan: () => void;
  setCurrentPage: (page: number) => void;
}

export const ClearingHeader = ({
  ach,
  common,
  d,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sectorFilter,
  setSectorFilter,
  agencyFilter,
  setAgencyFilter,
  sectors,
  agencies,
  onScan,
  setCurrentPage,
}: ClearingHeaderProps) => {
  const activeFiltersCount = statusFilter.length + sectorFilter.length + agencyFilter.length;

  return (
    <PageHeader
      title={
        <>
          {ach.title_main || "Clearing"}{" "}
          <span className="text-primary italic">
            {ach.title_sub || "House."}
          </span>
        </>
      }
      subtitle={
        <>
          <Globe size={14} className="text-primary" />{" "}
          {ach.subtitle || "Resolusi Konflik Anggaran & Duplikasi Data"}
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {common.verify_source || "Source Verified"}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest gap-2 relative px-4 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
                >
                  <Filter size={14} /> {common.filter || "Filter"}
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[8px] border-none shadow-lg">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-3 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50"
              >
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {d.filter_status || "Filter Status"}
                </DropdownMenuLabel>
                {[
                  { id: "synced", label: d.status_synced || "SIKRON" },
                  { id: "duplicate", label: d.status_duplicate || "DUPLIKASI" },
                  { id: "overlap", label: d.status_overlap || "TUMPANG TINDIH" },
                ].map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s.id}
                    checked={statusFilter.includes(s.id)}
                    onCheckedChange={(checked) => {
                      setStatusFilter((prev: string[]) => checked ? [...prev, s.id] : prev.filter((i) => i !== s.id));
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-bold uppercase rounded-xl mb-1"
                  >
                    {s.label}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {d.filter_sector || "Filter Sektor"}
                </DropdownMenuLabel>
                {sectors.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={sectorFilter.includes(s)}
                    onCheckedChange={(checked) => {
                      setSectorFilter((prev: string[]) => checked ? [...prev, s] : prev.filter((i) => i !== s));
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-bold uppercase rounded-xl mb-1"
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {d.filter_agency || "Filter Instansi"}
                </DropdownMenuLabel>
                {agencies.map((a) => (
                  <DropdownMenuCheckboxItem
                    key={a}
                    checked={agencyFilter.includes(a)}
                    onCheckedChange={(checked) => {
                      setAgencyFilter((prev: string[]) => checked ? [...prev, a] : prev.filter((i) => i !== a));
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-bold uppercase rounded-xl mb-1"
                  >
                    {a}
                  </DropdownMenuCheckboxItem>
                ))}

                {activeFiltersCount > 0 && (
                  <>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter([]);
                        setSectorFilter([]);
                        setAgencyFilter([]);
                        setCurrentPage(1);
                      }}
                      className="text-[10px] font-black uppercase text-rose-500 justify-center h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                    >
                      {common.reset_filter || "Reset Filter"}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full lg:w-64 group">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={ach.search_placeholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <Button
              onClick={onScan}
              className="px-8 h-12 shadow-glow-primary rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2"
            >
              <ShieldAlert size={16} /> {d.scan_btn || "Scan Duplikasi"}
            </Button>
          </div>
        </div>
      }
    />
  );
};
