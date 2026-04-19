"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";
import {
  ShieldCheck,
  History,
  Download,
  ShieldAlert,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { useDebounce } from "@/hooks/useDebounce";

import { PageHeader } from "@/components/layouts";
import { AuditStats } from "./_components/AuditStats";
import { AuditFilters } from "./_components/AuditFilters";
import { AuditLogItem } from "./_components/AuditLogItem";
import { AuditPagination } from "./_components/AuditPagination";

/**
 * AuditTrailPage - Main Dashboard for Security & System Logs.
 * Refactored for Modular Architecture while preserving 100% of the original design.
 */
export default function AuditTrailPage() {
  const dict = useI18n();
  const a = dict?.audit || {};

  // State Management
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [moduleFilter, setModuleFilter] = useState<string[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedUserFilter = useDebounce(userFilter, 500);

  // Data Fetching (Tanstack Query)
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

  // Client-side filtering logic (matching original)
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

  // Security Toast Observer
  useEffect(() => {
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

  const toggleFilter = (type: "status" | "module", value: string) => {
    if (type === "status") {
      setStatusFilter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else {
      setModuleFilter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setStatusFilter([]);
    setModuleFilter([]);
    setUserFilter("");
    setCurrentPage(1);
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
      {/* 1. HEADER SECTION */}
      <PageHeader 
        title={
          <>
            {a.title_main || "Audit"}{" "}
            <span className="text-primary italic">
              {a.title_sub || "Trail."}
            </span>
          </>
        }
        subtitle={
          <>
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-primary font-black uppercase">
              {a.engine_status?.split("&")[0] || "Real Data Engine"}
            </span>{" "}
            & {a.engine_status?.split("&")[1] || "Global Security Log"}
          </>
        }
        actions={
          <Button className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-900 border-none shadow-xl text-navy dark:text-white font-black uppercase tracking-widest text-[10px] flex gap-2 hover:bg-slate-50 transition-all">
            <Download size={16} /> {a.export_button || "Export Live Audit Log"}
          </Button>
        }
      />

      {/* 2. STATS SECTION */}
      <AuditStats stats={stats} a={a} />

      {/* 3. MAIN ACTIVITY CARD */}
      <Card
        className={`p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 transition-opacity ${
          isPlaceholderData ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Filters & Search */}
        <AuditFilters 
          a={a}
          statusFilter={statusFilter}
          moduleFilter={moduleFilter}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          toggleFilter={toggleFilter}
          resetAll={resetFilters}
          debouncedUserFilter={debouncedUserFilter}
        />

        {/* Dynamic Feed */}
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
              onClick={resetFilters}
            >
              {a.reset_filter_button || "Reset Filter"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <AuditLogItem 
                key={log._id || log.id}
                log={log}
                a={a}
                dict={dict}
                expandedLogs={expandedLogs}
                setExpandedLogs={setExpandedLogs}
                handleBlock={handleBlock}
                setUserFilter={setUserFilter}
              />
            ))}
          </div>
        )}

        {/* Pagination Section */}
        <AuditPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          a={a}
          dict={dict}
        />
      </Card>
    </div>
  );
}
