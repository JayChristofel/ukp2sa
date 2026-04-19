"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SearchX, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui";
import { TaskCard } from "./TaskCard";
import { TaskListRow } from "./TaskListRow";

interface AssignmentGridProps {
  isLoading: boolean;
  filteredTasks: any[];
  paginatedTasks: any[];
  viewMode: "grid" | "list";
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onPing: (assignee: string) => void;
  onDelete: (id: string, title: string) => void;
  onViewDetail: (task: any) => void;
  locale: any;
  aa: any;
  common: any;
}

export const AssignmentGrid = ({
  isLoading,
  filteredTasks,
  paginatedTasks,
  viewMode,
  searchTerm,
  setSearchTerm,
  onPing,
  onDelete,
  onViewDetail,
  locale,
  aa,
  common,
}: AssignmentGridProps) => {
  return (
    <div className="min-h-[400px]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 text-center"
          >
            <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {common.loading || "Synchronizing Dispatch Center..."}
            </p>
          </motion.div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[3rem] backdrop-blur-xl border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="size-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700 shadow-inner">
              {searchTerm ? <SearchX size={48} /> : <ClipboardList size={48} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
                {aa.empty_title}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed px-6">
                {searchTerm
                  ? `No matching dispatch records for "${searchTerm.toUpperCase()}"`
                  : aa.empty_desc}
              </p>
            </div>
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => setSearchTerm("")}
                className="mt-6 text-[10px] font-black uppercase text-primary hover:bg-primary/5 rounded-2xl px-8 h-12 border border-primary/10 transition-all active:scale-95"
              >
                {common.reset || "RESET ARCHIVE"}
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {viewMode === "grid" && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedTasks.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPing={onPing}
                    onDelete={onDelete}
                    onViewDetail={onViewDetail}
                    locale={locale}
                  />
                ))}
              </motion.div>
            )}
            {viewMode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {paginatedTasks.map((task: any) => (
                  <TaskListRow
                    key={task.id}
                    task={task}
                    onPing={onPing}
                    onDelete={onDelete}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
};
