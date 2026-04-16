"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShieldAlert,
  CheckCircle2,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Loader2,
  AlertTriangle,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchX,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function ClearingHousePage() {
  const dict = useI18n();
  const ach = dict?.admin_clearing_house || {};
  const d = dict?.clearing_house || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string[]>([]);
  const [agencyFilter, setAgencyFilter] = useState<string[]>([]);
  const itemsPerPage = 8;
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "CLEARING_HOUSE_VIEW",
      "FINANCIAL",
      "User accessed the budget clearing house for conflict resolution.",
    );
  }, [logActivity]);

  const { data: rawList = [], isLoading } = useQuery({
    queryKey: ["clearingHouseData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000, // Optimize for production: 1 min cache
  });

  const filteredList = React.useMemo(() => {
    return rawList.filter((item: any) => {
      const matchSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter.length === 0 || statusFilter.includes(item.status);

      const matchSector =
        sectorFilter.length === 0 || sectorFilter.includes(item.sector);

      const matchAgency =
        agencyFilter.length === 0 || agencyFilter.includes(item.agency);

      return matchSearch && matchStatus && matchSector && matchAgency;
    });
  }, [rawList, searchTerm, statusFilter, sectorFilter, agencyFilter]);

  const agencies = React.useMemo(
    () =>
      Array.from(new Set(rawList.map((item: any) => item.agency))).filter(
        Boolean,
      ) as string[],
    [rawList],
  );

  const sectors = React.useMemo(
    () =>
      Array.from(new Set(rawList.map((item: any) => item.sector))).filter(
        Boolean,
      ) as string[],
    [rawList],
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const list = React.useMemo(
    () => filteredList.slice(startIndex, startIndex + itemsPerPage),
    [filteredList, startIndex, itemsPerPage],
  );

  const stats = React.useMemo(
    () => ({
      totalAligned: rawList.filter((item: any) => item.status === "synced")
        .length,
      potentialDup: rawList.filter((item: any) => item.status === "duplicate")
        .length,
      totalAnalyzed: rawList.length,
    }),
    [rawList],
  );


  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {ach.title_main || "Clearing"}{" "}
            <span className="text-primary italic">
              {ach.title_sub || "House."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
            <Globe size={14} className="text-primary" />{" "}
            {ach.subtitle || "Resolusi Konflik Anggaran & Duplikasi Data"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} />{" "}
            {common.verify_source || "Source Verified"}
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
                  {statusFilter.length +
                    sectorFilter.length +
                    agencyFilter.length >
                    0 && (
                    <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[8px] border-none shadow-lg">
                      {statusFilter.length +
                        sectorFilter.length +
                        agencyFilter.length}
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
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("synced")}
                  onCheckedChange={(checked) => {
                    setStatusFilter((prev) =>
                      checked
                        ? [...prev, "synced"]
                        : prev.filter((s) => s !== "synced"),
                    );
                    setCurrentPage(1);
                  }}
                  className="text-[11px] font-bold uppercase rounded-xl mb-1"
                >
                  {d.status_synced || "SIKRON"}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("duplicate")}
                  onCheckedChange={(checked) => {
                    setStatusFilter((prev) =>
                      checked
                        ? [...prev, "duplicate"]
                        : prev.filter((s) => s !== "duplicate"),
                    );
                    setCurrentPage(1);
                  }}
                  className="text-[11px] font-bold uppercase rounded-xl"
                >
                  {d.status_duplicate || "DUPLIKASI"}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("overlap")}
                  onCheckedChange={(checked) => {
                    setStatusFilter((prev) =>
                      checked
                        ? [...prev, "overlap"]
                        : prev.filter((s) => s !== "overlap"),
                    );
                    setCurrentPage(1);
                  }}
                  className="text-[11px] font-bold uppercase rounded-xl"
                >
                  {d.status_overlap || "TUMPANG TINDIH"}
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {d.filter_sector || "Filter Sektor"}
                </DropdownMenuLabel>
                {sectors.map((s: any) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={sectorFilter.includes(s)}
                    onCheckedChange={(checked) => {
                      setSectorFilter((prev) =>
                        checked ? [...prev, s] : prev.filter((i) => i !== s),
                      );
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
                {agencies.map((a: any) => (
                  <DropdownMenuCheckboxItem
                    key={a}
                    checked={agencyFilter.includes(a)}
                    onCheckedChange={(checked) => {
                      setAgencyFilter((prev) =>
                        checked ? [...prev, a] : prev.filter((i) => i !== a),
                      );
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-bold uppercase rounded-xl mb-1"
                  >
                    {a}
                  </DropdownMenuCheckboxItem>
                ))}

                {statusFilter.length +
                  sectorFilter.length +
                  agencyFilter.length >
                  0 && (
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

            {/* Search Bar Moved Here */}
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
              onClick={() => {
                logActivity(
                  "CLEARING_HOUSE_SCAN",
                  "FINANCIAL",
                  "User triggered a duplication scan on budget items.",
                );
                addNotification({
                  title: "Scanning Duplikasi",
                  description:
                    "Clearing Engine sedang melakukan verifikasi tumpang tindih anggaran secara real-time.",
                  type: "system",
                  priority: "medium",
                });
                toast.info("Clearing Engine v1.0 scanning active...");
              }}
              className="px-8 h-12 shadow-glow-primary rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2"
            >
              <ShieldAlert size={16} /> {d.scan_btn || "Scan Duplikasi"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-6 border-none shadow-xl bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 rounded-3xl">
          <div className="flex items-center gap-4 text-emerald-500 mb-2">
            <CheckCircle2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {ach.conflict_resolved}
            </span>
          </div>
          <p className="text-3xl font-black text-navy dark:text-white transition-colors">
            {stats.totalAligned}
          </p>
        </Card>
        <Card className="p-6 border-none shadow-xl bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10 rounded-3xl">
          <div className="flex items-center gap-4 text-amber-500 mb-2">
            <AlertTriangle size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {ach.duplicate_warning}
            </span>
          </div>
          <p className="text-3xl font-black text-navy dark:text-white transition-colors">
            {stats.potentialDup}
          </p>
        </Card>
        <Card className="p-6 border-none shadow-xl bg-primary/5 dark:bg-primary/10 border-primary/10 rounded-3xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 text-primary mb-2">
            <Layers size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {ach.budget_overlap}
            </span>
          </div>
          <p className="text-3xl font-black text-navy dark:text-white transition-colors">
            {stats.totalAnalyzed}
          </p>
        </Card>
      </div>

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
                          {searchTerm
                            ? `Tidak ada hasil untuk "${searchTerm}"`
                            : ach.empty_desc}
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
                  <tr
                    key={item.id}
                    className="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-[13px] font-black text-navy dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                          {item.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        variant="outline"
                        className="rounded-lg border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-3 py-1 bg-white/50 dark:bg-slate-900/50"
                      >
                        {item.sector}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      {item.status === "synced" ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-black uppercase text-[9px] tracking-widest">
                          <CheckCircle2 size={12} /> {ach.conflict_resolved}
                        </div>
                      ) : item.status === "overlap" ? (
                        <div className="flex items-center gap-1.5 text-amber-500 font-black uppercase text-[9px] tracking-widest">
                          <Layers size={12} /> {d.status_overlap || "OVERLAP"}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-500 font-black uppercase text-[9px] tracking-widest">
                          <AlertTriangle size={12} /> {ach.duplicate_warning}
                        </div>
                      )}
                      <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase truncate max-w-[120px]">
                        {item.reason}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              item.confidence >= 90
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                : "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-black text-navy dark:text-white font-mono">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-[10px] h-10 px-4 font-black uppercase tracking-widest text-primary hover:text-primary-600 hover:bg-primary/5 gap-2 group cursor-pointer rounded-xl transition-all active:scale-95"
                          >
                            {ach.details_btn}
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-slate-900 border-none shadow-2xl rounded-3xl overflow-hidden p-0 flex flex-col gap-0 max-h-[90vh]">
                          <div
                            className={`h-2 w-full shrink-0 ${
                              item.status === "synced"
                                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                : item.status === "overlap"
                                ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                            }`}
                          />
                          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            <DialogHeader className="mb-6 text-left">
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge
                                  className={`rounded-lg font-black uppercase text-[9px] tracking-widest border-none px-3 py-1 ${
                                    item.status === "synced"
                                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                      : item.status === "overlap"
                                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                      : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                                  }`}
                                >
                                  {item.status === "synced"
                                    ? ach.conflict_resolved
                                    : item.status === "overlap"
                                    ? d.status_overlap || "OVERLAP"
                                    : ach.duplicate_warning}
                                </Badge>
                                <span className="text-slate-300 dark:text-slate-700 font-bold">
                                  •
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  {item.sector}
                                </span>
                              </div>
                              <DialogTitle className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight mb-2">
                                {item.title}
                              </DialogTitle>
                              <DialogDescription className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert
                                  size={12}
                                  className="text-primary"
                                />{" "}
                                REFF ID: {item.code}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8">
                              <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {ach.agency_label}
                                </h5>
                                <p className="text-sm font-black text-navy dark:text-white truncate">
                                  {item.agency}
                                </p>
                              </div>
                              <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  FUNDING SCHEME
                                </h5>
                                <p className="text-sm font-black text-navy dark:text-white truncate">
                                  {item.fundingScheme}
                                </p>
                              </div>
                              <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  BUDGET ESTIMATION
                                </h5>
                                <p className="text-sm font-black text-primary">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                  }).format(item.budget || 0)}
                                </p>
                              </div>
                              <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  LOCATION FOCUS
                                </h5>
                                <p className="text-sm font-black text-navy dark:text-white truncate">
                                  {item.location}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3 mb-8 px-2">
                              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                OUTCOME ANALYSIS
                              </h5>
                              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-4">
                                {item.outcome || "-"}
                              </p>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative">
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    CONFIDENCE ALGORITHM
                                  </h5>
                                  <span className="text-xl font-black text-navy dark:text-white">
                                    {item.confidence}%
                                  </span>
                                </div>
                                <div className="h-3 w-full bg-white dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      item.confidence >= 90
                                        ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                        : "bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                    }`}
                                    style={{ width: `${item.confidence}%` }}
                                  />
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                  <div className="size-1.5 rounded-full bg-primary" />
                                  SYSTEM VERIFICATION
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                      VERIFICATION STATUS
                                    </p>
                                    <p className="text-[11px] font-black text-navy dark:text-white uppercase truncate">
                                      {item.status === "synced"
                                        ? "ALIGNED DETECTED"
                                        : item.status === "overlap"
                                        ? "OVERLAP DETECTED"
                                        : "CONFLICT DETECTED"}
                                    </p>
                                  </div>
                                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                      SIMILARITY LEVEL
                                    </p>
                                    <p className="text-[11px] font-black text-navy dark:text-white uppercase">
                                      {item.confidence}%{" "}
                                      {item.confidence >= 90
                                        ? "VALIDATED"
                                        : "POTENTIAL"}
                                    </p>
                                  </div>
                                </div>

                                <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                                  <h5 className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">
                                    RESOLUTION NOTES
                                  </h5>
                                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                    {item.reason || "Verified record structure."}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                {item.status === "duplicate" && (
                                  <Link
                                    href={`/${lang}/admin/clearing-house/manage?id=${item.id}`}
                                    className="w-full"
                                  >
                                    <Button className="w-full bg-rose-500 text-white hover:bg-rose-600 rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 shadow-xl shadow-rose-500/20 transition-all active:scale-95 group">
                                      {ach.details_btn}{" "}
                                      <ArrowRight
                                        size={16}
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                      />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 px-4 md:px-8 py-6 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] md:rounded-[2.5rem] border-t border-slate-100 dark:border-slate-800">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              {`Page ${currentPage} of ${totalPages || 1}`}
            </p>

            <Pagination className="w-auto mx-0">
              <PaginationContent className="gap-1 md:gap-2">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 text-[10px] font-black uppercase px-3 md:px-4 h-10 rounded-xl transition-all hover:bg-primary/10 text-primary disabled:opacity-20"
                  >
                    <ChevronLeftIcon size={14} />{" "}
                    <span className="hidden md:inline">
                      {common.prev || "Prev"}
                    </span>
                  </Button>
                </PaginationItem>

                <div className="flex items-center gap-1 mx-2 md:mx-4">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <button
                            onClick={() => setCurrentPage(pageNum)}
                            className={`size-8 md:size-9 rounded-xl text-[10px] font-black transition-all ${
                              currentPage === pageNum
                                ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </PaginationItem>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis className="text-slate-300" />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                </div>

                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="flex items-center gap-2 text-[10px] font-black uppercase px-3 md:px-4 h-10 rounded-xl transition-all hover:bg-primary/10 text-primary disabled:opacity-20"
                  >
                    <span className="hidden md:inline">
                      {common.next || "Next"}
                    </span>{" "}
                    <ChevronRightIcon size={14} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full shrink-0">
              {`${filteredList.length} Items Indexed`}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
