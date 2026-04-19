"use client";

import React from "react";
import { Badge, Button } from "@/components/ui";
import {
  User,
  Monitor,
  Smartphone,
  Database,
  Lock,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseUserAgent } from "@/lib/uaParser";

interface AuditLogItemProps {
  log: any;
  a: any; // dictionary for audit
  dict: any; // global dictionary
  expandedLogs: string[];
  setExpandedLogs: React.Dispatch<React.SetStateAction<string[]>>;
  handleBlock: (ip: string) => void;
  setUserFilter: (user: string) => void;
}

export function AuditLogItem({
  log,
  a,
  dict,
  expandedLogs,
  setExpandedLogs,
  handleBlock,
  setUserFilter,
}: AuditLogItemProps) {
  const ua = parseUserAgent(log.userAgent);
  const logId = log._id || log.id;
  const isExpanded = expandedLogs.includes(logId);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-0 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl group overflow-hidden">
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
              setExpandedLogs((prev) =>
                prev.includes(logId)
                  ? prev.filter((i) => i !== logId)
                  : [...prev, logId],
              );
            }}
            className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest text-primary hover:bg-primary/5"
          >
            {isExpanded ? a.hide_details || "Hide Details" : a.view_trace || "View Trace"}
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
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/40 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={14} /> {a.metadata_trace || "System Metadata Trace"}
                </h4>
                <div className="bg-navy p-5 rounded-2xl overflow-x-auto">
                  <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed">
                    {JSON.stringify(
                      {
                        level: log.status?.toLowerCase(),
                        module: log.module,
                        ip: log.ipAddress,
                        ua_raw: log.userAgent,
                        event_id: logId,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} /> {a.forensic_log || "Forensic Change Log (Diff)"}
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
                      {a.no_changes_recorded || "No structural changes recorded for this event."}
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
}
