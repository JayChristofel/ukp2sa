"use client";

import React from "react";
import { Button } from "@/components/ui";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface AuditPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  a: any;
  dict: any;
}

export function AuditPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  a,
  dict,
}: AuditPaginationProps) {
  return (
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
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                    onClick={() => onPageChange(pageNum)}
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
                onPageChange(Math.min(totalPages, currentPage + 1))
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
  );
}
