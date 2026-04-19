"use client";

import React from "react";
import { Button, Badge } from "@/components/ui";
import {
  Filter,
  Terminal,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface AuditFiltersProps {
  a: any;
  statusFilter: string[];
  moduleFilter: string[];
  userFilter: string;
  setUserFilter: (val: string) => void;
  toggleFilter: (type: "status" | "module", value: string) => void;
  resetAll: () => void;
  debouncedUserFilter: string;
}

export function AuditFilters({
  a,
  statusFilter,
  moduleFilter,
  userFilter,
  setUserFilter,
  toggleFilter,
  resetAll,
  debouncedUserFilter,
}: AuditFiltersProps) {
  return (
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
                resetAll(); // Simple way to clear before applying presets
                toggleFilter("status", "Error");
                toggleFilter("status", "Warning");
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
                  onClick={resetAll}
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
            onChange={(e) => setUserFilter(e.target.value)}
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
  );
}
