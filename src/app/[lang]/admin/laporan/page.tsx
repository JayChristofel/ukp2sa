"use client";

import React, { useState, useMemo } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  SearchX,
  MapPin,
  Calendar,
  Phone,
  Clock,
  Truck,
  Eye,
  CheckCircle2,
  Loader2,
  Filter,
  User,
  Image as ImageIcon,
  FileText,
  Map as MapIcon,
  ExternalLink,
  Maximize2,
  Plus,
  Globe,
  ShieldCheck,
  Zap,
  Grid2X2,
  List as ListIcon,
  LayoutGrid,
} from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/app/[lang]/providers";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

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
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "REPORTS_VIEW",
      "REPORTS",
      "User accessed the citizen report management system.",
    );
  }, [logActivity]);

  const { data: reports = [], isLoading: isReportsLoading } = useQuery({
    queryKey: ["reportAnswersData"],
    queryFn: () => apiService.getReportAnswers(100),
    staleTime: 30000,
  });

  const { data: sarData = [], isLoading: isSARLoading } = useQuery({
    queryKey: ["sarData"],
    queryFn: () => apiService.getMissingPersons(1),
    staleTime: 30000,
  });

  const { data: conflictData = [], isLoading: isConflictsLoading } = useQuery({
    queryKey: ["conflictData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 30000,
  });

  const { data: r3pData = [], isLoading: isR3pLoading } = useQuery({
    queryKey: ["r3pLaporan"],
    queryFn: () => apiService.getR3P(),
    staleTime: 30000,
  });

  const { data: ngoData = [], isLoading: isNgoLoading } = useQuery({
    queryKey: ["ngoLaporan"],
    queryFn: () => apiService.getNgo(),
    staleTime: 30000,
  });

  const isLoading =
    isReportsLoading ||
    isSARLoading ||
    isConflictsLoading ||
    isR3pLoading ||
    isNgoLoading;

  const unifiedIntelligence = useMemo(() => {
    const items: any[] = [];

    // 1. Citizen Reports
    reports.forEach((r: any, idx: number) => {
      const data = r.values || r.result || (typeof r === "object" ? r : {});
      const compositeId = `LAP-${r.id || idx}`;

      // 🧠 Extraction Intelligence: Construct Title from metadata if missing
      const fullName =
        r.respondentInfo?.fullName ||
        data.respondentInfo?.fullName ||
        r.fullName ||
        "";
      const village = r.village || data.village || "";
      const district = r.district || data.district || "";
      const regency = r.regency || data.regency || "Aceh";

      // 🕵️‍♂️ Description Crawler: Find the most substantial text in the answers array
      const rawAnswers = r.answers || data.answers || [];
      let crawledDesc = "";
      if (Array.isArray(rawAnswers)) {
        const longText = rawAnswers.find(
          (a: any) => a.questionType === "long_text" && a.answer,
        );
        if (longText && typeof longText.answer === "string") {
          crawledDesc = longText.answer;
        } else if (
          rawAnswers.length > 0 &&
          typeof rawAnswers[0].answer === "string"
        ) {
          crawledDesc = rawAnswers[0].answer;
        }
      }

      const finalTitle =
        data.title ||
        data.subject ||
        data.subject_laporan ||
        r.title ||
        r.subject ||
        (fullName
          ? `Aduan: ${fullName}${village ? " (" + village + ")" : ""}`
          : `Aduan Warga ${village || district || regency}`);

      const finalLocation = `${village ? village + ", " : ""}${
        district ? district + ", " : ""
      }${regency}`;

      const finalDesc =
        data.description ||
        data.content ||
        data.body ||
        r.description ||
        r.content ||
        crawledDesc ||
        "Klik untuk melihat detail jawaban kuesioner.";

      items.push({
        ...r,
        id: compositeId,
        originalId: r.id,
        sourceType: "LAPORAN",
        displayTitle: finalTitle,
        displayLocation: finalLocation,
        displayDesc: finalDesc,
        displayPriority: (data.priority || r.priority || "MEDIUM")
          .toString()
          .toUpperCase(),
        displayDate:
          data.date || r.date || r.createdAt || new Date().toISOString(),
      });
    });

    // 2. SAR (Missing Persons)
    sarData.forEach((s: any, idx: number) => {
      const compositeId = `SAR-${s.id || idx}`;

      // 🧠 Extraction Intelligence for SAR
      const details = s.missingPersonDetails || {};
      const condition = s.missingConditionDetails || {};

      const ageStr = details.age ? ` (${details.age}th)` : "";
      const genderStr = details.gender
        ? ` [${details.gender === "male" ? "L" : "P"}]`
        : "";

      const physical = details.physicalDescription || "";
      const lastCloth = condition.lastClothing || "";
      const circs = condition.circumstances || "";

      const combinedDesc =
        [
          physical ? `Ciri: ${physical}` : "",
          lastCloth ? `Pakaian terakhir: ${lastCloth}` : "",
          circs ? `Kronologi: ${circs}` : "",
        ]
          .filter(Boolean)
          .join(" | ") || "Membutuhkan bantuan evakuasi segera.";

      items.push({
        ...s,
        id: compositeId,
        originalId: s.id,
        sourceType: "SAR",
        displayTitle: `PENCARIAN: ${s.name}${ageStr}${genderStr}`,
        displayLocation: `Terakhir di ${
          s.lastSeenPoint || s.location || "Aceh"
        }`,
        displayDesc: combinedDesc,
        displayPriority: "HIGH",
        displayDate:
          s.reportedDate || s.date || s.createdAt || new Date().toISOString(),
      });
    });

    // 3. Conflicts (Clearing House)
    conflictData.forEach((c: any, idx: number) => {
      if (c.status === "duplicate") {
        const compositeId = `CNF-${c.id || idx}`;
        items.push({
          ...c,
          id: compositeId,
          originalId: c.id,
          sourceType: "KONFLIK",
          displayTitle: `DUPLIKASI: ${c.title}`,
          displayLocation: c.location,
          displayDesc:
            c.duplicateCause ||
            `Indikasi tumpang tindih anggaran dengan ${c.agency}.`,
          displayPriority: "MEDIUM",
          displayDate: new Date().toISOString(),
        });
      }
    });

    // 4. KERUSAKAN (R3P)
    r3pData.slice(0, 15).forEach((r: any, idx: number) => {
      const area = r.administrativeArea || {};
      const regency = (area.regencyName || "Aceh")
        .replace("Kabupaten ", "")
        .replace("Kota ", "");
      const houses = r.clusters?.find((c: any) => c.key === "houses");
      const heavy =
        houses?.metrics?.find((m: any) => m.key === "house_damage_heavy")
          ?.value || 0;

      if (heavy > 0) {
        items.push({
          ...r,
          id: `R3P-${r.id || idx}`,
          originalId: r.id,
          sourceType: "KERUSAKAN",
          displayTitle: `DATA BNPB: Kerusakan Berat ${heavy} Rumah`,
          displayLocation: `Desa ${area.villageName}, ${regency}`,
          displayDesc: `Laporan resmi verifikasi tingkat kerusakan aset perumahan.`,
          displayPriority: heavy > 100 ? "HIGH" : "MEDIUM",
          displayDate: new Date().toISOString(),
        });
      }
    });

    // 5. INTERVENSI (NGO)
    ngoData.slice(0, 15).forEach((ngo: any, idx: number) => {
      const orgName = ngo.parentOrganization?.[0]?.name || "NGO Khusus";
      const loc = ngo.regency?.[0] || "Aceh";
      items.push({
        ...ngo,
        id: `NGO-${ngo.no || idx}`,
        originalId: ngo.no,
        sourceType: "INTERVENSI",
        displayTitle: `AGENDA NGO: ${orgName}`,
        displayLocation: loc,
        displayDesc:
          ngo.interventionActivityDescription || "Agenda Kemanusiaan",
        displayPriority: "LOW",
        displayDate: new Date().toISOString(),
      });
    });

    return items;
  }, [reports, sarData, conflictData, r3pData, ngoData]);

  const filteredReports = useMemo(() => {
    return unifiedIntelligence.filter((item: any) => {
      const title = item.displayTitle.toLowerCase();
      const location = item.displayLocation.toLowerCase();
      const description = item.displayDesc.toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchSearch =
        !searchTerm ||
        title.includes(search) ||
        location.includes(search) ||
        description.includes(search);

      const matchPriority =
        filterPriority === "all" ||
        item.displayPriority === filterPriority.toUpperCase();
      const matchSource =
        filterSource === "all" ||
        item.sourceType === filterSource.toUpperCase();

      return matchSearch && matchPriority && matchSource;
    });
  }, [unifiedIntelligence, searchTerm, filterPriority, filterSource]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "LOW":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {ar.title_main || "Intelligence"}{" "}
            <span className="text-primary italic">
              {ar.title_sub || "Reports."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
            <Globe size={14} className="text-primary" />{" "}
            {ar.subtitle || "Pusat Monitoring Aduan & Intelijen Lapangan"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {ar.verify_source || "Source Verified"}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>
          <Button
            asChild
            className="bg-primary text-white px-8 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
          >
            <Link href={`/${lang}/admin/laporan/add`} prefetch={true}>
              <Plus size={18} /> {ar.btn_new}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
          {/* Use standard tabs or just some labels, matching Assignments patterns */}
          <div className="px-4 py-2 bg-primary/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
            Intelligence Center
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* View Mode Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode("bento")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "bento"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-slate-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "text-slate-400 hover:text-navy dark:hover:text-white"
              }`}
            >
              <LayoutGrid size={16} />
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

          {/* Filter Dropdown (Now to the left of Search) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest gap-2 relative px-4 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
              >
                <Filter size={16} />
                {(filterPriority !== "all" || filterSource !== "all") && (
                  <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[8px] border-none shadow-lg">
                    {
                      [filterPriority, filterSource].filter((f) => f !== "all")
                        .length
                    }
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 rounded-3xl p-3 border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50"
            >
              <div className="p-2">
                <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                  {ar.priority_label}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {ar.all_priority}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="high"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    {ar.prio_high}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="medium"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                  >
                    {ar.prio_medium}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="low"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                  >
                    {ar.prio_low}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator className="my-4 bg-slate-100 dark:bg-slate-800" />

                <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                  {ar.source_label}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filterSource}
                  onValueChange={setFilterSource}
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {ar.all_sources}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="laporan"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {ar.src_reports}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="sar"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {ar.src_sar}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="konflik"
                    className="rounded-xl px-3 py-2.5 font-bold text-xs text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {ar.src_conflicts}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                {(filterPriority !== "all" || filterSource !== "all") && (
                  <>
                    <DropdownMenuSeparator className="my-4 bg-slate-100 dark:bg-slate-800" />
                    <DropdownMenuItem
                      onClick={() => {
                        setFilterPriority("all");
                        setFilterSource("all");
                      }}
                      className="text-[10px] font-black uppercase text-rose-500 justify-center h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                    >
                      {common.reset_filter || "Reset Filter"}
                    </DropdownMenuItem>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div className="relative flex-1 lg:w-80 group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder={ar.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              {ar.loading_feed}
            </p>
          </div>
        ) : filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="size-20 md:size-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
              <SearchX size={48} />
            </div>
            <p className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter mb-1">
              {ar.empty_title}
            </p>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[280px] md:max-w-[300px] mx-auto leading-relaxed px-4">
              {ar.empty_desc}
            </p>
          </motion.div>
        ) : (
          <div
            className={`grid gap-4 md:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : viewMode === "list"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-4 lg:grid-cols-6"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report: any, idx: number) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  viewMode={viewMode}
                  index={idx}
                  onViewDetail={setSelectedReport}
                  onDispatch={() =>
                    router.push(
                      `/${lang}/admin/assignments/new?reportId=${report.id}`,
                    )
                  }
                  locale={locale}
                  getPriorityColor={getPriorityColor}
                  ar={ar}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] rounded-[2rem] border-none bg-white dark:bg-slate-900 font-display overflow-hidden flex flex-col p-0 shadow-2xl">
          {selectedReport &&
            (() => {
              const r = selectedReport;
              const sourceColor =
                r.sourceType === "SAR"
                  ? "bg-rose-500"
                  : r.sourceType === "KONFLIK"
                  ? "bg-amber-500"
                  : "bg-primary";

              return (
                <>
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <DialogHeader className="mb-6 md:mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 ${getPriorityColor(
                              r.displayPriority,
                            )}`}
                          >
                            {r.displayPriority} {ar.priority_tag}
                          </Badge>
                          <Badge
                            className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 text-white ${sourceColor}`}
                          >
                            {r.sourceType} {ar.evidence_tag}
                          </Badge>
                        </div>
                      </div>
                      <DialogTitle className="text-2xl md:text-3xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
                        {r.displayTitle}
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest mt-2 flex items-center gap-2">
                        {ar.trace_id}: {r.id || "N/A"} •{" "}
                        {r.category || r.sourceType || "General"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 md:space-y-8 py-6 md:py-8 border-y border-slate-100 dark:border-slate-800">
                      {/* 🖼️ Evidence Gallery (Carousel) */}
                      {(r.attachment?.images?.length > 0 ||
                        r.images?.length > 0) && (
                        <div className="space-y-4">
                          <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon size={14} className="text-primary" />{" "}
                            {ar.evidence_images}
                          </h5>
                          <Carousel className="w-full">
                            <CarouselContent className="-ml-2 md:-ml-4">
                              {(r.attachment?.images || r.images || []).map(
                                (img: string, i: number) => (
                                  <CarouselItem
                                    key={i}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                                  >
                                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                                      <Image
                                        src={img}
                                        alt="Evidence"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized
                                        className="object-cover transition-transform group-hover:scale-110"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage(img);
                                        }}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-zoom-in"
                                      >
                                        <Maximize2
                                          size={32}
                                          className="text-white drop-shadow-lg"
                                        />
                                      </button>
                                    </div>
                                  </CarouselItem>
                                ),
                              )}
                            </CarouselContent>
                            <div className="flex justify-end gap-2 mt-4 pr-2">
                              <CarouselPrevious className="static translate-y-0" />
                              <CarouselNext className="static translate-y-0" />
                            </div>
                          </Carousel>
                        </div>
                      )}

                      {/* 🗺️ Geospatial Intelligence Map */}
                      {r.coordinate && (
                        <div className="space-y-4">
                          <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MapIcon size={14} className="text-rose-500" />{" "}
                            {ar.location_gis}
                          </h5>
                          <div className="w-full h-40 md:h-48 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-900/50 relative group">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              src={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}&z=15&output=embed`}
                              allowFullScreen
                            ></iframe>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-xl font-black text-[8px] uppercase tracking-widest gap-2 shadow-lg"
                                asChild
                              >
                                <a
                                  href={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink size={12} />{" "}
                                  {ar.google_maps_btn}
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={14} className="text-primary" />{" "}
                          {ar.intel_detail}
                        </h5>
                        <div className="p-4 md:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary/20 dark:border-primary/40 pl-4 md:pl-6">
                            &quot;{r.displayDesc}&quot;
                          </p>
                        </div>
                      </div>

                      {/* 📋 Source Specific Intelligence Sections */}
                      {r.sourceType === "LAPORAN" && r.answers && (
                        <div className="space-y-4">
                          <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />{" "}
                            {ar.tilikan_results}
                          </h5>
                          <div className="grid grid-cols-1 gap-3">
                            {r.answers.map((ans: any, i: number) => (
                              <div
                                key={i}
                                className="flex flex-col gap-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                              >
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                                  {ans.question}
                                </span>
                                <span className="text-xs font-bold text-navy dark:text-white">
                                  {typeof ans.answer === "object"
                                    ? Array.isArray(ans.answer)
                                      ? ans.answer
                                          .map((a: any) => a.label)
                                          .join(", ")
                                      : ans.answer?.label || "-"
                                    : ans.answer === true
                                    ? "Ya"
                                    : ans.answer === false
                                    ? "Tidak"
                                    : ans.answer || "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {r.sourceType === "SAR" && (
                        <div className="space-y-4">
                          <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} className="text-rose-500" />{" "}
                            {ar.subject_profile}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                              <span className="text-[9px] font-black text-rose-400 uppercase">
                                {ar.age_gender}
                              </span>
                              <p className="text-xs font-bold text-navy dark:text-white">
                                {r.missingPersonDetails?.age || "-"} Tahun /{" "}
                                {r.missingPersonDetails?.gender === "male"
                                  ? "Laki-laki"
                                  : "Perempuan"}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                              <span className="text-[9px] font-black text-rose-400 uppercase">
                                {ar.report_status}
                              </span>
                              <p className="text-xs font-bold text-navy dark:text-white">
                                {r.status || "Aktif"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                        <div className="space-y-4 md:space-y-6">
                          <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                            <div className="size-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                              <MapPin size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                                {ar.focus_area}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="truncate pr-2">
                                  {r.displayLocation}
                                </span>
                                {r.coordinate && (
                                  <a
                                    href={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 shrink-0"
                                  >
                                    <MapIcon size={12} />{" "}
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                            <div className="size-10 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                                {ar.report_time}
                              </p>
                              <span>
                                {new Date(r.displayDate).toLocaleDateString(
                                  lang,
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                          <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                            <div className="size-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                              <User size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                                {ar.reporter_id}
                              </p>
                              <span className="truncate block">
                                {r.respondentInfo?.fullName ||
                                  r.fullName ||
                                  "Anonim"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                            <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                              <Phone size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">
                                {ar.reporter_contact}
                              </p>
                              <span className="truncate block">
                                {r.respondentInfo?.phoneNumber ||
                                  r.contactPhone ||
                                  "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button
                      onClick={() => {
                        logActivity(
                          "REPORT_DISPATCHED",
                          "REPORTS",
                          `Dispatching report intelligence to assignment: ${selectedReport.id}`,
                        );
                        addNotification({
                          title: "Laporan Di-dispatch",
                          description: `Laporan intelijen "${selectedReport.displayTitle}" telah diteruskan untuk penugasan lapangan.`,
                          type: "report",
                          priority: "high",
                          actionLabel: "Buka Penugasan",
                          link: "/admin/assignments",
                        });
                        setSelectedReport(null);
                        router.push(
                          `/${lang}/admin/assignments/new?reportId=${selectedReport.id}`,
                        );
                      }}
                      className="w-full sm:w-auto px-10 py-6 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl gap-3 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
                    >
                      <Truck size={18} /> {ar.dispatch_btn}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedReport(null)}
                      className="w-full sm:w-auto font-black uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-500 hover:text-navy dark:hover:text-white"
                    >
                      {ar.close_btn}
                    </Button>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-[95vw] h-auto p-0 border-none bg-transparent shadow-none overflow-hidden flex items-center justify-center">
          <DialogTitle className="sr-only">Pratinjau Foto Bukti</DialogTitle>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-[90vw] h-[80vh] flex items-center justify-center max-w-4xl"
            >
              <Image
                src={previewImage}
                alt="Full Preview"
                fill
                unoptimized
                className="object-contain rounded-3xl shadow-2xl border-4 border-white/10 backdrop-blur-3xl"
              />
              <div className="absolute top-6 right-6 flex gap-3 z-50">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xl border-none text-white shadow-xl"
                  asChild
                >
                  <a
                    href={previewImage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={18} />
                  </a>
                </Button>
              </div>
            </motion.div>
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

function ReportCard({
  report: item,
  viewMode,
  index,
  onViewDetail,
  onDispatch,
  locale,
  getPriorityColor,
  ar,
}: any) {
  const sourceColor =
    item.sourceType === "SAR"
      ? "bg-rose-500"
      : item.sourceType === "KONFLIK"
      ? "bg-amber-500"
      : "bg-primary";

  const timeLabel = formatDistanceToNow(new Date(item.displayDate), {
    addSuffix: true,
    locale,
  });

  const isBento = viewMode === "bento";
  const isList = viewMode === "list";

  // Logic for Bento Col Spans
  const bentoSpan = isBento
    ? index % 5 === 0
      ? "md:col-span-2 lg:col-span-3"
      : index % 3 === 0
      ? "md:col-span-2 lg:col-span-2"
      : "col-span-1"
    : "";

  if (isList) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        <Card
          className="group border-none rounded-3xl shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-900 transition-all p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:ring-2 hover:ring-primary/20"
          onClick={() => onViewDetail(item)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                className={`rounded-lg border-none font-black uppercase text-[7px] tracking-widest px-2 py-1 ${getPriorityColor(
                  item.displayPriority,
                )}`}
              >
                {item.displayPriority}
              </Badge>
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
                <div className={`size-1.5 rounded-full ${sourceColor}`} />
                {item.sourceType}
              </div>
            </div>
            <h3 className="text-sm md:text-base font-black text-navy dark:text-white uppercase truncate">
              {item.displayTitle}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 italic">
              &quot;{item.displayDesc}&quot;
            </p>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy dark:text-white">
                <MapPin size={10} className="text-rose-500" />{" "}
                {item.displayLocation}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Reported
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy dark:text-white">
                <Clock size={10} className="text-amber-500" /> {timeLabel}
              </div>
            </div>
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={onDispatch}
                size="sm"
                className="h-9 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-black uppercase text-[8px] tracking-widest gap-2 transition-all"
              >
                <Truck size={12} /> Dispatch
              </Button>
              <Button
                onClick={() => onViewDetail(item)}
                size="icon"
                variant="ghost"
                className="size-9 rounded-xl text-slate-400 hover:text-primary"
              >
                <Eye size={14} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={bentoSpan}
    >
      <Card
        className={`h-full border-none rounded-[2rem] md:rounded-[2.5rem] shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:bg-white dark:hover:bg-slate-900 transition-all p-6 md:p-8 flex flex-col cursor-pointer hover:ring-2 hover:ring-primary/20 ${
          isBento ? "min-h-[320px]" : ""
        }`}
        onClick={() => onViewDetail(item)}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <Badge
              className={`rounded-xl border-none font-black uppercase text-[8px] tracking-[0.15em] px-3 py-1.5 w-fit ${getPriorityColor(
                item.displayPriority,
              )}`}
            >
              {item.displayPriority} {ar.priority_tag}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={`size-1.5 rounded-full ${sourceColor}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {item.sourceType}
              </span>
            </div>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
            <Clock size={12} className="text-amber-500" /> {timeLabel}
          </div>
        </div>

        <h3
          className={`${
            isBento && bentoSpan.includes("span-")
              ? "text-xl md:text-2xl"
              : "text-lg md:text-xl"
          } font-black text-navy dark:text-white uppercase tracking-tighter mb-4 line-clamp-2 leading-tight`}
        >
          {item.displayTitle}
        </h3>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed italic">
          &quot;{item.displayDesc}&quot;
        </p>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest font-mono">
            <MapPin size={14} className="text-rose-500" />{" "}
            <span className="truncate">{item.displayLocation}</span>
          </div>

          <div
            className="flex items-center gap-2 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={onDispatch}
              className="flex-1 py-4 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-2xl font-black uppercase text-[9px] tracking-widest gap-2 shadow-sm border-none"
            >
              <Truck size={14} /> Dispatch
            </Button>
            <Button
              onClick={() => onViewDetail(item)}
              variant="outline"
              className="size-11 md:size-12 rounded-2xl flex items-center justify-center border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all p-0"
            >
              <Eye size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
