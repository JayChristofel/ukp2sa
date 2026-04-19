"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { id as idLocale, enUS } from "date-fns/locale";

import { useI18n } from "@/app/[lang]/providers";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

// Modular Components
import { AssignmentsHeader } from "./_components/AssignmentsHeader";
import { AssignmentFilters } from "./_components/AssignmentFilters";
import { AssignmentGrid } from "./_components/AssignmentGrid";
import { AssignmentDetailDialog } from "./_components/AssignmentDetailDialog";
import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AssignmentsPage() {
  const dict = useI18n();
  const params = useParams();
  const aa = dict?.admin_assignments || {};
  const d = dict?.assignments || {};
  const common = dict?.common || {};
  const lang = (params?.lang as string) || "id";
  const locale = lang === "id" ? idLocale : enUS;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity("ASSIGNMENTS_VIEW", "REPORTS", "User accessed the agency assignments orchestration center.");
  }, [logActivity]);

  const { data: rawTasks = [], isLoading } = useQuery({
    queryKey: ["assignmentsData"],
    queryFn: () => apiService.getAssignmentsData(),
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(`Deleting assignment: ${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignmentsData"] });
      toast.success(common.delete_success || "Assignment successfully cleared");
    },
  });

  const filteredTasks = useMemo(() => {
    return rawTasks.filter((task: any) => {
      const matchSearch =
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id?.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeTab === "all") return matchSearch;
      if (activeTab === "pending") return matchSearch && ["Pending", "Assigned", "Searching"].includes(task.status);
      if (activeTab === "active") return matchSearch && ["En Route", "On Site", "Active", "Proses", "Inspection", "Operational"].includes(task.status);
      if (activeTab === "resolved") return matchSearch && ["Resolved", "Verified", "Completed", "Selesai", "Aman", "Guarded"].includes(task.status);
      return matchSearch;
    });
  }, [rawTasks, activeTab, searchTerm]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePing = (assignee: string) => {
    toast.success(`Ping signal dispatched to ${assignee}`);
    addNotification({
      title: "Signal Dispatched",
      description: `Ping signal sent to field operative: ${assignee}`,
      type: "assignment",
      priority: "medium",
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(dict?.common?.confirm_delete || "Hapus tugas ini?")) {
      deleteMutation.mutate(id);
      logActivity("ASSIGNMENT_REMOVED", "REPORTS", `Removed assignment task: ${title}`, "warn");
      addNotification({
        title: "Penugasan Dihapus",
        description: `Tugas "${title}" telah dihapus dari sistem operasional.`,
        type: "assignment",
        priority: "medium",
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      <AssignmentsHeader aa={aa} common={common} lang={lang} totalTasks={rawTasks.length} />

      <AssignmentFilters 
        activeTab={activeTab} setActiveTab={handleTabChange}
        searchTerm={searchTerm} setSearchTerm={handleSearchChange}
        viewMode={viewMode} setViewMode={setViewMode}
        tabs={[
          { id: "all", label: aa.tab_all },
          { id: "pending", label: aa.tab_pending },
          { id: "active", label: aa.tab_active },
          { id: "resolved", label: aa.tab_resolved },
        ]}
        aa={aa}
      />

      <AssignmentGrid 
        isLoading={isLoading} filteredTasks={filteredTasks} paginatedTasks={paginatedTasks}
        viewMode={viewMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        onPing={handlePing} onDelete={handleDelete} onViewDetail={setSelectedTask}
        locale={locale} aa={aa} common={common}
      />

      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 backdrop-blur-xl shadow-sm">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            Showing <span className="text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-primary">{Math.min(currentPage * itemsPerPage, filteredTasks.length)}</span> of <span className="text-navy dark:text-white">{filteredTasks.length}</span> Dispatch Records
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary disabled:opacity-30 transition-all border-none">
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                (i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)) ? (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`size-11 rounded-2xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-navy dark:hover:text-white"}`}>
                    {i + 1}
                  </button>
                ) : (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) ? <span key={i + 1} className="px-1 text-slate-300">...</span> : null
              ))}
            </div>
            <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary disabled:opacity-30 transition-all border-none">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}

      <AssignmentDetailDialog 
        selectedTask={selectedTask} setSelectedTask={setSelectedTask}
        onPing={handlePing} lang={lang} d={d} common={common}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
