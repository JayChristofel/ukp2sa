"use client";

import React, { useMemo } from "react";
import { Card, Badge, Button } from "@/components/ui";
import {
  ShieldCheck,
  History,
  Filter,
  Terminal,
  Download,
  ShieldAlert,
  User,
  Monitor,
  Smartphone,
  Database,
  Lock,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircle,
} from "lucide-react";
import { parseUserAgent } from "@/lib/uaParser";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useI18n } from "@/app/[lang]/providers";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

export default function AuditTrailPage() {
  const dict = useI18n();
  const a = dict?.audit || {};

  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [moduleFilter, setModuleFilter] = React.useState<string[]>([]);
  const [expandedLogs, setExpandedLogs] = React.useState<string[]>([]);
  const [userFilter, setUserFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const debouncedUserFilter = useDebounce(userFilter, 500);

  const {
    data: auditData,
    isLoading,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ["audit-logs", currentPage, debouncedUserFilter],
    queryFn: () => apiService.getAuditLogs(currentPage, itemsPerPage, debouncedUserFilter),
    placeholderData: (previousData) => previousData,
    refetchInterval: 10000,
  });

  const allLogs = useMemo(() => auditData?.data || [], [auditData]);

  const logs = useMemo(() => {
    return allLogs.filter((log: any) => {
      const matchStatus =
        statusFilter.length === 0 || statusFilter.includes(log.status);
      const matchModule =
        moduleFilter.length === 0 || moduleFilter.includes(log.module);
      return matchStatus && matchModule;
    });
  }, [allLogs, statusFilter, moduleFilter]);

  const totalItems = auditData?.stats?.totalEvents || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  React.useEffect(() => {
    const latestError = allLogs.find(
      (l: any) =>
        l.status === "Error" &&
        new Date(l.timestamp) > new Date(Date.now() - 30000),
    );
    if (latestError) {
      toast.error(
        `${a.security_alert || "Security Alert"}: ${latestError.action}`,
        {
          description: latestError.details,
          duration: 5000,
        },
      );
    }
  }, [allLogs, a.security_alert]);

  const handleBlock = (ip: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `${a.blocking_ip || "Blocking IP"} ${ip}...`,
      success: `${
        a.blocked_ip_success || "IP has been blacklisted globally."
      } (${ip})`,
      error: a.block_ip_failed || "Failed to block IP.",
    });
  };

  const stats = useMemo(
    () =>
      auditData?.stats || {
        totalEvents: 0,
        securityGaps: 0,
        activeSessions: 0,
        integrity: {
          totalScore: 0,
          dimensions: { completeness: 0, accuracy: 0, consistency: 0 },
        },
      },
    [auditData],
  );

  const integrity = stats.integrity;

  const toggleFilter = (type: "status" | "module", value: string) => {
    if (type === "status") {
      setStatusFilter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
      setCurrentPage(1);
    } else {
      setModuleFilter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
      setCurrentPage(1);
    }
  };

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert size={48} className="text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-navy dark:text-white uppercase">
            {a.loading_error || "Gagal Memuat Real Data"}
          </h2>
          <p className="text-slate-500 text-xs font-bold">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {a.title_main || "Audit"}{" "}
            <span className="text-primary italic">
              {a.title_sub || "Trail."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-primary font-black uppercase">
              {a.engine_status?.split("&")[0] || "Real Data Engine"}
            </span>{" "}
            & {a.engine_status?.split("&")[1] || "Global Security Log"}
          </p>
        </div>

        <Button className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-900 border-none shadow-xl text-navy dark:text-white font-black uppercase tracking-widest text-[10px] flex gap-2 hover:bg-slate-50 transition-all">
          <Download size={16} /> {a.export_button || "Export Live Audit Log"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
              {a.integrity_title || "Integrity Diagnostics"}
            </h3>
            <Badge
              variant={integrity.totalScore > 80 ? "emerald" : "amber"}
              className="border-none rounded-lg px-3 py-1"
            >
              {integrity.totalScore > 80
                ? a.integrity_healthy || "Healthy System"
                : a.integrity_warning || "Monitoring Needed"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1 text-center border-r border-slate-100 dark:border-slate-800">
              <p className="text-3xl font-black text-primary">
                {integrity.totalScore}%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {a.global_score || "Global Score"}
              </p>
            </div>
            {Object.entries(integrity.dimensions).map(
              ([key, val]: [string, any]) => (
                <div
                  key={key}
                  className="space-y-1 text-center last:border-none border-r border-slate-100 dark:border-slate-800"
                >
                  <p className="text-xl font-black text-navy dark:text-white">
                    {val}%
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest capitalize">
                    {a.integrity_dimensions?.[key] || key}
                  </p>
                </div>
              ),
            )}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-navy text-white relative overflow-hidden">
          <div className="relative z-10">
            <ShieldAlert size={32} className="mb-4 text-rose-500" />
            <h3 className="text-lg font-black uppercase tracking-tight">
              {a.access_title || "Access Control"}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic opacity-80">
              {a.access_desc || "Device & Session Footprints"}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">
                {stats.totalEvents > 1000
                  ? `${(stats.totalEvents / 1000).toFixed(1)}k`
                  : stats.totalEvents}
              </span>
              <span className="text-[10px] font-bold opacity-50 uppercase">
                {stats.activeSessions} {a.sessions_active || "Active Sessions"}
              </span>
            </div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-rose-400">
              {stats.securityGaps} {a.security_gaps || "Security Gaps Detected"}
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 size-40 bg-primary/20 blur-3xl rounded-full" />
        </Card>
      </div>

      <Card
        className={`p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 transition-opacity ${
          isPlaceholderData ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Terminal size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">
                {a.feed_title || "Active Activity Feed"}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                {debouncedUserFilter ? `Filtered by: ${debouncedUserFilter}` : (a.live_stream || "Live Stream Connected")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-2xl h-11 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest gap-2"
                >
                  <Filter size={16} /> {a.filter_button || "Filters"}
                  {(statusFilter.length > 0 || moduleFilter.length > 0) && (
                    <Badge
                      variant="primary"
                      className="size-5 p-0 flex items-center justify-center rounded-full text-[8px] bg-primary text-white border-none"
                    >
                      {statusFilter.length + moduleFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-3 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"
              >
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {a.filter_quick_actions || "Quick Actions"}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter(["Error", "Warning"]);
                    setModuleFilter([]);
                    setCurrentPage(1);
                  }}
                  className="text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 h-10 rounded-xl mb-2 hover:bg-rose-100 dark:hover:bg-rose-500/20 gap-2"
                >
                  <ShieldAlert size={14} />{" "}
                  {a.filter_security_threats || "Security Threats Only"}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {a.filter_event_status || "Event Status"}
                </DropdownMenuLabel>
                {["Success", "Warning", "Error"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleFilter("status", status)}
                    className="text-[11px] font-bold uppercase tracking-tight rounded-xl mb-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {a.status?.[status] || status}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {a.filter_modules || "Modules"}
                </DropdownMenuLabel>
                {["SYSTEM", "FINANCIAL", "AUTH", "REPORTS", "SETTINGS"].map(
                  (mod) => (
                    <DropdownMenuCheckboxItem
                      key={mod}
                      checked={moduleFilter.includes(mod)}
                      onCheckedChange={() => toggleFilter("module", mod)}
                      className="text-[11px] font-bold uppercase tracking-tight rounded-xl mb-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {a.modules?.[mod] || mod}
                    </DropdownMenuCheckboxItem>
                  ),
                )}
                {(statusFilter.length > 0 || moduleFilter.length > 0) && (
                  <>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter([]);
                        setModuleFilter([]);
                        setCurrentPage(1);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-rose-500 justify-center h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      {a.filter_clear_all || "Clear All Filters"}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1 lg:w-80">
              <User
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={userFilter || ""}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  a.search_user_placeholder || "Search activities by user..."
                }
                className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-bold outline-none focus:ring-2 ring-primary/20 transition-all placeholder:text-slate-400"
              />
              {userFilter && (
                <button 
                  onClick={() => setUserFilter("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {a.loading_data || "Syncing Real-time Data..."}
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
            <History size={32} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {a.no_data_found || "Tidak Ada Data Yang Sesuai Filter"}
            </p>
            <Button
              variant="primary"
              className="mt-4 text-[9px] font-black uppercase"
              onClick={() => {
                setStatusFilter([]);
                setModuleFilter([]);
                setUserFilter("");
                setCurrentPage(1);
              }}
            >
              {a.reset_filter_button || "Reset Filter"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => {
              const ua = parseUserAgent(log.userAgent);
              return (
                <div
                  key={log._id || log.id}
                  className="bg-slate-50 dark:bg-slate-800/40 p-0 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl group overflow-hidden"
                >
                  <div className="p-6 flex flex-col lg:flex-row gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-4 rounded-[1.25rem] shadow-sm transition-transform group-hover:scale-110 ${
                          log.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : log.status === "Warning"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {log.action?.includes("LOGIN") ? (
                          <Lock size={20} />
                        ) : (
                          <Database size={20} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              log.status === "Success"
                                ? "emerald"
                                : log.status === "Warning"
                                ? "amber"
                                : "rose"
                            }
                            className="rounded-lg h-5 border-none"
                          >
                            {a.status?.[log.status] || log.status}
                          </Badge>
                          <span className="text-[11px] font-black text-navy dark:text-white uppercase tracking-tight">
                            {log.action || "SYSTEM_EVENT"}
                          </span>
                        </div>
                        <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                          {log.details}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const id = log._id || log.id;
                          setExpandedLogs((prev) =>
                            prev.includes(id)
                              ? prev.filter((i) => i !== id)
                              : [...prev, id],
                          );
                        }}
                        className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest text-primary hover:bg-primary/5"
                      >
                        {expandedLogs.includes(log._id || log.id)
                          ? "Hide Details"
                          : "View Trace"}
                      </Button>
                      {(log.status === "Error" || log.status === "Warning") && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleBlock(log.ipAddress)}
                          className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {a.block_client_button || "Block Client"}
                        </Button>
                      )}
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {ua.isMobile ? (
                          <Smartphone size={16} className="text-slate-400" />
                        ) : (
                          <Monitor size={16} className="text-slate-400" />
                        )}
                        <div className="text-left min-w-[80px]">
                          <p className="text-[9px] font-black text-navy dark:text-white uppercase leading-none">
                            {ua.os}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">
                            {ua.browser}
                          </p>
                          {ua.device !== "Desktop" && (
                            <p className="text-[7px] font-black text-primary uppercase mt-1">
                              {ua.device}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="min-w-[120px]">
                        <div 
                          className="flex items-center justify-end gap-2 mb-1 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setUserFilter(log.userName)}
                        >
                          <span className="text-[10px] font-black text-navy dark:text-white uppercase">
                            {log.userName}
                          </span>
                          <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                        </div>
                        <p className="text-[9px] font-mono font-bold text-slate-400 opacity-80">
                          {log.ipAddress}
                        </p>
                      </div>
                      <div className="min-w-[110px] border-l border-slate-100 dark:border-slate-800 pl-8">
                        <p className="text-[11px] font-black text-navy dark:text-white uppercase leading-none mb-1">
                          {new Date(log.timestamp).toLocaleTimeString(
                            dict?.id === "en" ? "en-US" : "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleDateString(
                            dict?.id === "en" ? "en-US" : "id-ID",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedLogs.includes(log._id || log.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/40 p-6 md:p-8"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Terminal size={14} /> System Metadata Trace
                            </h4>
                            <div className="bg-navy p-5 rounded-2xl overflow-x-auto">
                              <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed">
                                {JSON.stringify(
                                  {
                                    level: log.status?.toLowerCase(),
                                    module: log.module,
                                    ip: log.ipAddress,
                                    ua_raw: log.userAgent,
                                    event_id: (log._id || log.id),
                                  },
                                  null,
                                  2,
                                )}
                              </pre>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Database size={14} /> Forensic Change Log (Diff)
                            </h4>
                            {log.diff ? (
                              <div className="bg-slate-200/50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-300/30">
                                <pre className="text-[10px] font-mono text-navy dark:text-primary leading-relaxed">
                                  {JSON.stringify(log.diff, null, 2)}
                                </pre>
                              </div>
                            ) : (
                              <div className="h-24 flex items-center justify-center bg-slate-200/20 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                                  No structural changes recorded for this event.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 px-6 py-6 bg-slate-50 dark:bg-slate-800/10 rounded-[2.5rem]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />{" "}
            {a.pagination_info
              ?.replace("{current}", String(currentPage))
              .replace("{total}", String(totalPages || 1)) ||
              `Page ${currentPage} of ${totalPages || 1}`}
          </p>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 h-10 rounded-xl transition-all ${
                    currentPage === 1
                      ? "opacity-30"
                      : "hover:bg-primary/10 text-primary"
                  }`}
                >
                  <ChevronLeftIcon size={14} /> {dict?.common?.prev || "Prev"}
                </Button>
              </PaginationItem>

              <div className="flex items-center gap-1 mx-4">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <button
                        onClick={() => setCurrentPage(pageNum)}
                        className={`size-8 rounded-lg text-[10px] font-black transition-all ${
                          currentPage === pageNum
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </PaginationItem>
                  );
                })}
              </div>

              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 h-10 rounded-xl transition-all ${
                    currentPage === totalPages || totalPages === 0
                      ? "opacity-30"
                      : "hover:bg-primary/10 text-primary"
                  }`}
                >
                  {dict?.common?.next || "Next"} <ChevronRightIcon size={14} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            {a.total_events_info?.replace("{total}", String(totalItems)) ||
              `Total: ${totalItems} Events`}
          </p>
        </div>
      </Card>
    </div>
  );
}
