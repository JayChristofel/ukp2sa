"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/app/[lang]/providers";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { id as idLocale, enUS } from "date-fns/locale";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

// Modular Components
import { IntelligenceHeader } from "./_components/IntelligenceHeader";
import { LaporanFilters } from "./_components/LaporanFilters";
import { ReportGrid } from "./_components/ReportGrid";
import { ReportDetailDialog } from "./_components/ReportDetailDialog";

export default function LaporanAdminPage() {
  const dict = useI18n();
  const ar = dict?.admin_reports || {};
  const common = dict?.common || {};
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "id";
  const locale = lang === "id" ? idLocale : enUS;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "bento">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity("REPORTS_VIEW", "REPORTS", "User accessed the citizen report management system.");
  }, [logActivity]);

  // --- DATA FETCHING ---
  const { data: reports = [], isLoading: isReportsLoading } = useQuery({ queryKey: ["reportAnswersData"], queryFn: () => apiService.getReportAnswers(100), staleTime: 30000 });
  const { data: sarData = [], isLoading: isSARLoading } = useQuery({ queryKey: ["sarData"], queryFn: () => apiService.getMissingPersons(1), staleTime: 30000 });
  const { data: conflictData = [], isLoading: isConflictsLoading } = useQuery({ queryKey: ["conflictData"], queryFn: () => apiService.getClearingHouseData(), staleTime: 30000 });
  const { data: r3pData = [], isLoading: isR3pLoading } = useQuery({ queryKey: ["r3pLaporan"], queryFn: () => apiService.getR3P(), staleTime: 30000 });
  const { data: ngoData = [], isLoading: isNgoLoading } = useQuery({ queryKey: ["ngoLaporan"], queryFn: () => apiService.getNgo(), staleTime: 30000 });

  const isLoading = isReportsLoading || isSARLoading || isConflictsLoading || isR3pLoading || isNgoLoading;

  const unifiedIntelligence = useMemo(() => {
    const items: any[] = [];
    
    // 1. Citizen Reports
    reports.forEach((r: any, idx: number) => {
      const data = r.values || r.result || (typeof r === "object" ? r : {});
      const compositeId = `LAP-${r.id || idx}`;
      const fullName = r.respondentInfo?.fullName || data.respondentInfo?.fullName || r.fullName || "";
      const village = r.village || data.village || "";
      const district = r.district || data.district || "";
      const regency = r.regency || data.regency || "Aceh";

      const rawAnswers = r.answers || data.answers || [];
      let crawledDesc = "";
      if (Array.isArray(rawAnswers)) {
        const longText = rawAnswers.find((a: any) => a.questionType === "long_text" && a.answer);
        crawledDesc = (longText && typeof longText.answer === "string") ? longText.answer : (rawAnswers.length > 0 && typeof rawAnswers[0].answer === "string" ? rawAnswers[0].answer : "");
      }

      items.push({
        ...r, id: compositeId, originalId: r.id, sourceType: "LAPORAN",
        displayTitle: data.title || data.subject || data.subject_laporan || r.title || r.subject || (fullName ? `Aduan: ${fullName}${village ? " (" + village + ")" : ""}` : `Aduan Warga ${village || district || regency}`),
        displayLocation: `${village ? village + ", " : ""}${district ? district + ", " : ""}${regency}`,
        displayDesc: data.description || data.content || data.body || r.description || r.content || crawledDesc || "Klik untuk melihat detail jawaban kuesioner.",
        displayPriority: (data.priority || r.priority || "MEDIUM").toString().toUpperCase(),
        displayDate: data.date || r.date || r.createdAt || new Date().toISOString(),
      });
    });

    // 2. SAR
    sarData.forEach((s: any, idx: number) => {
      const details = s.missingPersonDetails || {};
      const condition = s.missingConditionDetails || {};
      items.push({
        ...s, id: `SAR-${s.id || idx}`, originalId: s.id, sourceType: "SAR",
        displayTitle: `PENCARIAN: ${s.name}${details.age ? ` (${details.age}th)` : ""}${details.gender ? ` [${details.gender === "male" ? "L" : "P"}]` : ""}`,
        displayLocation: `Terakhir di ${s.lastSeenPoint || s.location || "Aceh"}`,
        displayDesc: [details.physicalDescription ? `Ciri: ${details.physicalDescription}` : "", condition.lastClothing ? `Pakaian terakhir: ${condition.lastClothing}` : "", condition.circumstances ? `Kronologi: ${condition.circumstances}` : ""].filter(Boolean).join(" | ") || "Membutuhkan bantuan evakuasi segera.",
        displayPriority: "HIGH",
        displayDate: s.reportedDate || s.date || s.createdAt || new Date().toISOString(),
      });
    });

    // 3. Conflicts
    conflictData.forEach((c: any, idx: number) => {
      if (c.status === "duplicate") {
        items.push({
          ...c, id: `CNF-${c.id || idx}`, originalId: c.id, sourceType: "KONFLIK",
          displayTitle: `DUPLIKASI: ${c.title}`,
          displayLocation: c.location,
          displayDesc: c.duplicateCause || `Indikasi tumpang tindih anggaran dengan ${c.agency}.`,
          displayPriority: "MEDIUM", displayDate: new Date().toISOString(),
        });
      }
    });

    // 4. KERUSAKAN (R3P)
    r3pData.slice(0, 15).forEach((r: any, idx: number) => {
      const area = r.administrativeArea || {};
      const heavy = r.clusters?.find((c: any) => c.key === "houses")?.metrics?.find((m: any) => m.key === "house_damage_heavy")?.value || 0;
      if (heavy > 0) {
        items.push({
          ...r, id: `R3P-${r.id || idx}`, originalId: r.id, sourceType: "KERUSAKAN",
          displayTitle: `DATA BNPB: Kerusakan Berat ${heavy} Rumah`,
          displayLocation: `Desa ${area.villageName}, ${area.regencyName?.replace("Kabupaten ", "").replace("Kota ", "")}`,
          displayDesc: `Laporan resmi verifikasi tingkat kerusakan aset perumahan.`,
          displayPriority: heavy > 100 ? "HIGH" : "MEDIUM", displayDate: new Date().toISOString(),
        });
      }
    });

    // 5. INTERVENSI (NGO)
    ngoData.slice(0, 15).forEach((ngo: any, idx: number) => {
      items.push({
        ...ngo, id: `NGO-${ngo.no || idx}`, originalId: ngo.no, sourceType: "INTERVENSI",
        displayTitle: `AGENDA NGO: ${ngo.parentOrganization?.[0]?.name || "NGO Khusus"}`,
        displayLocation: ngo.regency?.[0] || "Aceh",
        displayDesc: ngo.interventionActivityDescription || "Agenda Kemanusiaan",
        displayPriority: "LOW", displayDate: new Date().toISOString(),
      });
    });

    return items;
  }, [reports, sarData, conflictData, r3pData, ngoData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "MEDIUM": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "LOW": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const handleDispatch = (report: any) => {
    logActivity("REPORT_DISPATCHED", "REPORTS", `Dispatching report intelligence: ${report.id}`);
    addNotification({ 
      title: "Laporan Di-dispatch", 
      description: `Laporan intelijen "${report.displayTitle}" telah diteruskan.`, 
      type: "report", 
      priority: "high", 
      actionLabel: "Buka Penugasan", 
      link: "/admin/assignments",
      createdAt: new Date().toISOString()
    });
    setSelectedReport(null);
    router.push(`/${lang}/admin/assignments/new?reportId=${report.id}`);
  };

  const filteredReports = useMemo(() => {
    return unifiedIntelligence.filter((item: any) => {
      const search = searchTerm.toLowerCase();
      const matchSearch = !searchTerm || item.displayTitle.toLowerCase().includes(search) || item.displayLocation.toLowerCase().includes(search) || item.displayDesc.toLowerCase().includes(search);
      const matchPriority = filterPriority === "all" || item.displayPriority === filterPriority.toUpperCase();
      const matchSource = filterSource === "all" || item.sourceType === filterSource.toUpperCase();
      return matchSearch && matchPriority && matchSource;
    });
  }, [unifiedIntelligence, searchTerm, filterPriority, filterSource]);

  // Reset page logic handled directly in Filter props to avoid cascading renders
  const onSearchChange = (val: string) => { setSearchTerm(val); setCurrentPage(1); };
  const onPriorityChange = (val: string) => { setFilterPriority(val); setCurrentPage(1); };
  const onSourceChange = (val: string) => { setFilterSource(val); setCurrentPage(1); };

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      <IntelligenceHeader ar={ar} common={common} lang={lang} />

      <LaporanFilters 
        searchTerm={searchTerm} setSearchTerm={onSearchChange}
        viewMode={viewMode} setViewMode={setViewMode}
        filterPriority={filterPriority} setFilterPriority={onPriorityChange}
        filterSource={filterSource} setFilterSource={onSourceChange}
        ar={ar} common={common}
      />

      <ReportGrid 
        isLoading={isLoading} reports={paginatedReports} viewMode={viewMode}
        onViewDetail={setSelectedReport} onDispatch={handleDispatch}
        locale={locale} getPriorityColor={getPriorityColor} ar={ar}
      />

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {dict?.common?.showing || "Menampilkan"} {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} {dict?.common?.from || "dari"} {filteredReports.length} {dict?.common?.data || "Data"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest h-9"
            >
              {dict?.common?.previous || "Kembali"}
            </Button>
            <div className="flex items-center gap-1 px-4">
              <span className="text-xs font-black text-primary">{currentPage}</span>
              <span className="text-xs font-bold text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-400">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest h-9"
            >
              {dict?.common?.next || "Selanjutnya"}
            </Button>
          </div>
        </div>
      )}

      <ReportDetailDialog 
        report={selectedReport} onClose={() => setSelectedReport(null)}
        lang={lang} ar={ar} getPriorityColor={getPriorityColor}
        setPreviewImage={setPreviewImage} onDispatch={handleDispatch}
      />

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-[95vw] h-auto p-0 border-none bg-transparent shadow-none overflow-hidden flex items-center justify-center">
          <DialogTitle className="sr-only">Pratinjau Foto Bukti</DialogTitle>
          {previewImage && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-[90vw] h-[80vh] flex items-center justify-center max-w-4xl">
              <Image src={previewImage} alt="Full Preview" fill unoptimized className="object-contain rounded-3xl shadow-2xl border-4 border-white/10 backdrop-blur-3xl" />
              <div className="absolute top-6 right-6 flex gap-3 z-50">
                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xl border-none text-white shadow-xl" asChild>
                  <a href={previewImage} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} /></a>
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
