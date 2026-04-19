"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useI18n } from "@/app/[lang]/providers";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { Button } from "@/components/ui";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

// Modular Components
import { ClearingHeader } from "./_components/ClearingHeader";
import { ClearingStats } from "./_components/ClearingStats";
import { ClearingTable } from "./_components/ClearingTable";

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
    logActivity("CLEARING_HOUSE_VIEW", "FINANCIAL", "User accessed the budget clearing house for conflict resolution.");
  }, [logActivity]);

  const { data: rawList = [], isLoading } = useQuery({
    queryKey: ["clearingHouseData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000,
  });

  const filteredList = useMemo(() => {
    return rawList.filter((item: any) => {
      const matchSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
      const matchSector = sectorFilter.length === 0 || sectorFilter.includes(item.sector);
      const matchAgency = agencyFilter.length === 0 || agencyFilter.includes(item.agency);

      return matchSearch && matchStatus && matchSector && matchAgency;
    });
  }, [rawList, searchTerm, statusFilter, sectorFilter, agencyFilter]);

  const agencies = useMemo(() => Array.from(new Set(rawList.map((item: any) => item.agency))).filter(Boolean) as string[], [rawList]);
  const sectors = useMemo(() => Array.from(new Set(rawList.map((item: any) => item.sector))).filter(Boolean) as string[], [rawList]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const list = useMemo(() => filteredList.slice(startIndex, startIndex + itemsPerPage), [filteredList, startIndex]);

  const stats = useMemo(() => ({
    totalAligned: rawList.filter((item: any) => item.status === "synced").length,
    potentialDup: rawList.filter((item: any) => item.status === "duplicate").length,
    totalAnalyzed: rawList.length,
  }), [rawList]);

  const handleScan = () => {
    logActivity("CLEARING_HOUSE_SCAN", "FINANCIAL", "User triggered a duplication scan on budget items.");
    addNotification({
      title: "Scanning Duplikasi",
      description: "Clearing Engine sedang melakukan verifikasi tumpang tindih anggaran secara real-time.",
      type: "system",
      priority: "medium",
    });
    toast.info("Clearing Engine v1.0 scanning active...");
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      <ClearingHeader 
        ach={ach} common={common} d={d}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        sectorFilter={sectorFilter} setSectorFilter={setSectorFilter}
        agencyFilter={agencyFilter} setAgencyFilter={setAgencyFilter}
        sectors={sectors} agencies={agencies}
        onScan={handleScan} setCurrentPage={setCurrentPage}
      />

      <ClearingStats stats={stats} ach={ach} />

      <ClearingTable 
        isLoading={isLoading} list={list}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        ach={ach} common={common} d={d} lang={lang}
      />

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 px-4 md:px-8 py-6 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] md:rounded-[2.5rem] border-t border-slate-100 dark:border-slate-800">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            {`Page ${currentPage} of ${totalPages || 1}`}
          </p>

          <Pagination className="w-auto mx-0">
            <PaginationContent className="gap-1 md:gap-2">
              <PaginationItem>
                <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-2 text-[10px] font-black uppercase px-3 md:px-4 h-10 rounded-xl transition-all hover:bg-primary/10 text-primary disabled:opacity-20">
                  <ChevronLeftIcon size={14} /> <span className="hidden md:inline">{common.prev || "Prev"}</span>
                </Button>
              </PaginationItem>
              <div className="flex items-center gap-1 mx-2 md:mx-4">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <PaginationItem key={pageNum}>
                        <button onClick={() => setCurrentPage(pageNum)} className={`size-8 md:size-9 rounded-xl text-[10px] font-black transition-all ${currentPage === pageNum ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"}`}>
                          {pageNum}
                        </button>
                      </PaginationItem>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <PaginationItem key={pageNum}><PaginationEllipsis className="text-slate-300" /></PaginationItem>;
                  }
                  return null;
                })}
              </div>
              <PaginationItem>
                <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-2 text-[10px] font-black uppercase px-3 md:px-4 h-10 rounded-xl transition-all hover:bg-primary/10 text-primary disabled:opacity-20">
                  <span className="hidden md:inline">{common.next || "Next"}</span> <ChevronRightIcon size={14} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full shrink-0">
            {`${filteredList.length} Items Indexed`}
          </p>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
