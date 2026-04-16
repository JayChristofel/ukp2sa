"use client";

import React, { useState, useMemo } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { TaskStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  Clock,
  MapPin,
  Trash2,
  ArrowRight,
  Users,
  Building2,
  ShieldCheck,
  Heart,
  Bell,
  Loader2,
  Search,
  SearchX,
  List as ListIcon,
  Grid2X2,
  Phone,
  Eye,
  CheckCircle2,
  BarChart3,
  Timer,
  Link as LinkIcon,
  Globe,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

type ViewMode = "grid" | "list";

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "K/L":
      return <Building2 size={16} />;
    case "Pemda":
      return <Users size={16} />;
    case "Satgas":
      return <ShieldCheck size={16} />;
    case "NGO":
      return <Heart size={16} />;
    default:
      return <ClipboardList size={16} />;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    case "Assigned":
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "En Route":
      return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
    case "On Site":
      return "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
    case "Resolved":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Escalated":
      return "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export default function AssignmentsPage() {
  const dict = useI18n();
  const aa = dict?.admin_assignments || {};
  const d = dict?.assignments || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const locale = lang === "id" ? idLocale : enUS;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>("all");
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "ASSIGNMENTS_VIEW",
      "REPORTS",
      "User accessed the agency assignments orchestration center.",
    );
  }, [logActivity]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: rawTasks = [], isLoading } = useQuery({
    queryKey: ["assignmentsData"],
    queryFn: () => apiService.getAssignmentsData(),
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => true, // eslint-disable-line @typescript-eslint/no-unused-vars
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
      if (activeTab === "pending")
        return (
          matchSearch &&
          ["Pending", "Assigned", "Searching"].includes(task.status)
        );
      if (activeTab === "active")
        return (
          matchSearch &&
          [
            "En Route",
            "On Site",
            "Active",
            "Proses",
            "Inspection",
            "Operational",
          ].includes(task.status)
        );
      if (activeTab === "resolved")
        return (
          matchSearch &&
          [
            "Resolved",
            "Verified",
            "Completed",
            "Selesai",
            "Aman",
            "Guarded",
          ].includes(task.status)
        );
      return matchSearch;
    });
  }, [rawTasks, activeTab, searchTerm]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Auto-reset to page 1 on search or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const tabs = [
    { id: "all", label: aa.tab_all },
    { id: "pending", label: aa.tab_pending },
    { id: "active", label: aa.tab_active },
    { id: "resolved", label: aa.tab_resolved },
  ];

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
      logActivity(
        "ASSIGNMENT_REMOVED",
        "REPORTS",
        `Removed assignment task: ${title}`,
        "warn",
      );
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
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight uppercase">
              {aa.title_main || "Agency"}{" "}
              <span className="text-primary italic">
                {aa.title_sub || "Assignments."}
              </span>
            </h1>
            <Badge className="h-7 rounded-xl bg-primary/10 text-primary border-primary/20 font-black text-xs px-3 shadow-sm animate-in fade-in slide-in-from-left duration-500">
              {rawTasks.length}
            </Badge>
          </div>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
            <Globe size={14} className="text-primary" />{" "}
            {aa.subtitle || "Orkestrasi Aksi & Dispatch Lapangan"}
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
          <Button
            asChild
            className="bg-primary text-white px-8 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
          >
            <Link href={`/${lang}/admin/assignments/new`} prefetch={true}>
              <ClipboardList size={18} /> {aa.new_task}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-slate-400 hover:text-primary dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-slate-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-slate-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              <ListIcon size={16} />
            </button>
          </div>
          <div className="relative flex-1 lg:w-80 group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={aa.search_placeholder}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
            />
          </div>
        </div>
      </div>

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
                {searchTerm ? (
                  <SearchX size={48} />
                ) : (
                  <ClipboardList size={48} />
                )}
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
                      onPing={handlePing}
                      onDelete={handleDelete}
                      onViewDetail={setSelectedTask}
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
                      onPing={handlePing}
                      onDelete={handleDelete}
                      onViewDetail={setSelectedTask}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 backdrop-blur-xl shadow-sm">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              Showing{" "}
              <span className="text-primary">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="text-primary">
                {Math.min(currentPage * itemsPerPage, filteredTasks.length)}
              </span>{" "}
              of{" "}
              <span className="text-navy dark:text-white">
                {filteredTasks.length}
              </span>{" "}
              Dispatch Records
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary disabled:opacity-30 disabled:hover:bg-slate-50 transition-all border-none"
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Only show current, first, last, and around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`size-11 rounded-2xl text-[10px] font-black transition-all ${
                          currentPage === pageNumber
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-navy dark:hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-1 text-slate-300">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="ghost"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary disabled:opacity-30 disabled:hover:bg-slate-50 transition-all border-none"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] md:max-h-[85vh] rounded-[2rem] md:rounded-[2.5rem] border-none bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-3xl p-0 overflow-hidden flex flex-col">
          {selectedTask && (
            <>
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                <DialogHeader className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl">
                      {getCategoryIcon(selectedTask.category)}
                    </div>
                    <Badge
                      className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 ${getStatusColor(
                        selectedTask.status,
                      )}`}
                    >
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <DialogTitle className="text-2xl md:text-3xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
                    {selectedTask.title}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1.5 min-w-fit">
                      Case ID: {selectedTask.id}
                    </span>
                    {selectedTask.sourceType && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded-md border border-primary/10 min-w-fit">
                        <LinkIcon size={10} /> {selectedTask.sourceType}{" "}
                        EVIDENCE
                      </span>
                    )}
                    <span className="min-w-fit">
                      • {selectedTask.category} Sector
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Keterangan Tugas
                      </h5>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary/20 pl-4 bg-slate-50 dark:bg-slate-900/50 py-4 rounded-r-xl">
                        &quot;
                        {selectedTask.notes || "Tidak ada catatan tambahan."}
                        &quot;
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Informasi Lokasi & PIC
                      </h5>
                      <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                        <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                            Wilayah Operasional
                          </p>
                          <span>{selectedTask.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                            Penanggung Jawab
                          </p>
                          <span>{selectedTask.assignee}</span>
                        </div>
                      </div>

                      {selectedTask.sourceId && (
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                            <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                              <LinkIcon size={18} />
                            </div>
                            <div>
                              <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                                Referensi Sumber Data
                              </p>
                              <span className="text-primary uppercase tracking-tighter">
                                [{selectedTask.sourceType}] ID:{" "}
                                {selectedTask.sourceId}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Progres & Metrik
                      </h5>
                      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400">
                            Penyelesaian
                          </span>
                          <span className="text-2xl font-black text-primary">
                            {selectedTask.progress}%
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedTask.progress}%` }}
                            className="h-full bg-primary shadow-glow-primary"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-widest">
                              {d.label_created_at || "Waktu Laporan"}
                            </span>
                            <span className="text-navy dark:text-white">
                              {new Date(
                                selectedTask.createdAt,
                              ).toLocaleDateString(lang, {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-widest">
                              {d.label_urgency || "Tingkat Urgensi"}
                            </span>
                            <div className="flex items-center gap-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 h-2 w-28">
                              <div
                                className={`h-full ${
                                  selectedTask.urgencyScore > 75
                                    ? "bg-rose-500"
                                    : "bg-primary"
                                }`}
                                style={{
                                  width: `${selectedTask.urgencyScore}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Kontak Darurat
                      </h5>
                      <Button
                        variant="outline"
                        className="w-full justify-between px-6 py-7 rounded-2xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/5 group"
                      >
                        <div className="flex items-center gap-4">
                          <Phone
                            size={18}
                            className="group-hover:animate-bounce"
                          />
                          <div className="text-left">
                            <p className="text-[8px] opacity-60">HUBUNGI PIC</p>
                            <span>{selectedTask.phone}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 md:p-8 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => handlePing(selectedTask.assignee)}
                    className="flex-1 sm:flex-none px-8 py-5 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Bell size={16} /> Kirim Pengingat
                  </Button>
                  {selectedTask.status === "Resolved" && (
                    <div className="hidden sm:flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-4 border-l border-slate-200 dark:border-slate-700">
                      <CheckCircle2 size={16} /> Terverifikasi
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTask(null)}
                  className="w-full sm:w-auto font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-navy dark:hover:text-white"
                >
                  {common.close_panel || "Tutup Panel"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function TaskCard({
  task,
  onPing,
  onDelete,
  onViewDetail,
  isLarge = false,
  locale,
}: any) {
  const taskDate = task.createdAt ? new Date(task.createdAt) : new Date();
  const validDate = isNaN(taskDate.getTime()) ? new Date() : taskDate;

  const timeLabel = formatDistanceToNow(validDate, {
    addSuffix: true,
    locale,
  });
  const d = useI18n().assignments;

  return (
    <Card
      className={`h-full border-none rounded-[2rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group transition-all hover:bg-white/60 dark:hover:bg-slate-900/60 p-6 flex flex-col cursor-pointer hover:ring-2 hover:ring-primary/20 ${
        isLarge ? "border-primary/20 border" : ""
      }`}
      onClick={() => onViewDetail(task)}
    >
      <div
        className="flex justify-between items-start mb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform">
            {getCategoryIcon(task.category)}
          </div>
          <div>
            <Badge
              className={`rounded-lg border-none font-black uppercase text-[8px] tracking-widest ${getStatusColor(
                task.status,
              )}`}
            >
              {task.status}
            </Badge>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">
              {task.id}
            </p>
          </div>
        </div>
        <div
          className={`px-2.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${
            task.priority === "Critical"
              ? "bg-rose-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
          }`}
        >
          <AlertTriangle size={10} /> {task.priority}
        </div>
      </div>

      <h4
        className={`font-black text-navy dark:text-white uppercase tracking-tighter mb-4 line-clamp-2 ${
          isLarge ? "text-2xl" : "text-lg"
        }`}
      >
        {task.title}
      </h4>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-rose-500" /> {task.location}
          </span>
          <span className="flex items-center gap-1.5 max-w-[120px] truncate">
            <Clock size={12} className="text-amber-500" /> {timeLabel}
          </span>
        </div>

        {isLarge && (
          <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <BarChart3 size={16} className="text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                <span>{d.label_urgency}</span>
                <span>{task.urgencyScore}%</span>
              </div>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${task.urgencyScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Progres Capaian</span>
            <span
              className="font-black"
              style={{
                color: `var(--color-${
                  task.category.toLowerCase() === "keamanan"
                    ? "rose"
                    : task.category.toLowerCase() === "logistik"
                    ? "emerald"
                    : "primary"
                })`,
              }}
            >
              {task.progress || 10}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${
                task.category.toLowerCase() === "sar"
                  ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  : task.category.toLowerCase() === "logistik"
                  ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  : task.category.toLowerCase() === "keamanan"
                  ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
                  : "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
              }`}
              style={{ width: `${task.progress || 10}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex -space-x-2">
          <div
            className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black"
            title={task.assignee || "Unassigned"}
          >
            {(task.assignee || "U").charAt(0)}
          </div>
          <button
            className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 text-white flex items-center justify-center"
            title="Call Coordinator"
          >
            <Phone size={12} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail(task)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onPing(task.assignee)}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <Bell size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id, task.title)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}

function TaskListRow({ task, onPing, onDelete, onViewDetail }: any) {
  return (
    <Card
      className="p-4 border-none rounded-2xl shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all flex items-center gap-6 cursor-pointer"
      onClick={() => onViewDetail(task)}
    >
      <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
        {getCategoryIcon(task.category)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm text-navy dark:text-white uppercase truncate tracking-tight">
          {task.title}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
          {task.id} • {task.location}
        </p>
      </div>
      <div className="hidden md:flex flex-col items-end gap-1 px-4 border-x border-slate-100 dark:border-slate-800 min-w-[150px]">
        <Badge
          className={`rounded-md border-none font-black uppercase text-[7px] tracking-widest ${getStatusColor(
            task.status,
          )}`}
        >
          {task.status}
        </Badge>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Timer size={10} /> {task.updatedAt}
        </p>
      </div>
      <div className="hidden lg:flex flex-col w-32 gap-1.5 text-right px-4">
        <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
          Status Progres
        </p>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              task.category.toLowerCase() === "sar"
                ? "bg-blue-500"
                : task.category.toLowerCase() === "logistik"
                ? "bg-emerald-500"
                : task.category.toLowerCase() === "keamanan"
                ? "bg-rose-500"
                : "bg-primary"
            }`}
            style={{ width: `${task.progress || 10}%` }}
          />
        </div>
      </div>
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewDetail(task)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => onPing(task.assignee)}
          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
        >
          <Bell size={14} />
        </button>
        <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
          <Phone size={14} />
        </button>
        <button
          onClick={() => onDelete(task.id, task.title)}
          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  );
}
