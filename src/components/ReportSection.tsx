"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Report, ReportStatus, ReporterType } from "@/lib/types";
import { Card, Button, Badge } from "./ui";
import {
  Filter,
  Search,
  MapPin,
  Clock,
  Send,
  Info,
  Droplets,
  Lightbulb,
  Construction,
  History,
  User,
  Phone,
  LayoutGrid,
  Building2,
  Users,
  Reply,
  MessageSquare,
  Zap,
  ShieldCheck,
  MapPinned,
  ChevronRight,
  UserCircle,
  PhoneCall,
  CheckCircle2,

  Image as ImageIcon,
  Paperclip,
  X,
  AlertCircle,
  Shield,
  Fingerprint,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  useQueryClient,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { REGENCY_COORDINATES } from "@/lib/constants";
import { publicReportSchema } from "@/lib/validations";

import { useI18n } from "@/app/[lang]/providers";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useUnifiedReports } from "@/hooks/useUnifiedReports";
import { useEffect as useReactEffect } from "react";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("jalan") || cat.includes("road"))
    return <Construction size={24} />;
  if (cat.includes("air") || cat.includes("water"))
    return <Droplets size={24} />;
  if (
    cat.includes("lampu") ||
    cat.includes("light") ||
    cat.includes("penerangan")
  )
    return <Lightbulb size={24} />;
  return <Info size={24} />;
};



const maskPII = (str: string, type: "name" | "phone" | "id") => {
  if (!str) return "";
  if (type === "name") {
    const parts = str.split(" ");
    if (parts.length === 1)
      return parts[0].slice(0, 3) + "*".repeat(parts[0].length - 3);
    return (
      parts[0] +
      " " +
      parts
        .slice(1)
        .map((p) => p[0] + "*".repeat(p.length - 1))
        .join(" ")
    );
  }
  if (type === "phone") {
    return str.slice(0, 4) + "****" + str.slice(-4);
  }
  if (type === "id") {
    return str.slice(0, 6) + "**********";
  }
  return str;
};

export const ReporterBadge = ({ type }: { type: ReporterType }) => {
  const dict = useI18n();
  const rt = dict?.reports?.reporter_types || {};

  const configs: Record<
    ReporterType,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    masyarakat: {
      icon: <Users size={10} />,
      color: "slate",
      label: rt.masyarakat || "Masyarakat",
    },
    pemerintah: {
      icon: <Building2 size={10} />,
      color: "amber",
      label: rt.pemerintah || "Pemerintah",
    },
    admin: {
      icon: <ShieldCheck size={10} />,
      color: "rose",
      label: rt.admin || "Admin",
    },
    partner: {
      icon: <Zap size={10} />,
      color: "indigo",
      label: rt.partner || "Partner",
    },
    ngo: {
      icon: <Users size={10} />,
      color: "teal",
      label: rt.ngo || "NGO",
    },
  };
  const config = configs[type] || configs.masyarakat;
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-${config.color}-500/10 text-${config.color}-500 border border-${config.color}-500/20 text-[9px] font-black uppercase tracking-widest`}
    >
      {config.icon}
      {config.label}
    </div>
  );
};

const ReportSection: React.FC = () => {
  const dict = useI18n();
  const lang = (useParams()?.lang as string) || "id";
  const d = dict?.reports || {};
  const CAT_OPTIONS = d.categories || [];

  const qc = useQueryClient();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const { logActivity } = useAuditLogger();

  useReactEffect(() => {
    logActivity(
      "PUBLIC_REPORTS_VIEW",
      "PUBLIC",
      "Citizen accessed the public reporting feed and infrastructure complaint portal.",
    );
  }, [logActivity]);

  const addReportMutation = useMutation({
    mutationFn: (newReport: any) => apiService.saveReport(newReport),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reportAnswers"] });
    },
  });

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [regencies] = useState(() => 
    Object.keys(REGENCY_COORDINATES).map(name => ({ name, code: name }))
  );
  const ITEMS_PER_PAGE = 10;

  // --- Integrated API Hook ---
  const {
    reports: unifiedReports,
    topics,
    isLoading: unifiedLoading,
  } = useUnifiedReports(100, lang);

  // --- API Fetches (Dynamic) ---
  const [qSpecialQuestions, qTopTopics] = useQueries({
    queries: [
      {
        queryKey: ["specialQuestions"],
        queryFn: () => apiService.getSpecialQuestions(),
        staleTime: 3600000,
      },
      {
        queryKey: ["topTopics"],
        queryFn: () => apiService.getTopics(),
        staleTime: 3600000,
      },
    ],
  });

  const formatCustomTimeAgo = (
    dateStr: string | undefined,
    currentLang: string,
    currentDict: any,
  ) => {
    if (!dateStr) return currentDict.time_just_now || "Baru saja";
    const date = new Date(dateStr);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    const diffHours = Math.floor(diffMin / 60);

    if (diffMin < 60) {
      return `${diffMin} ${currentDict.time_min || "menit"}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${currentDict.time_hour || "jam"}`;
    } else {
      return new Intl.DateTimeFormat(currentLang === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    }
  };

  const reports = React.useMemo(() => {
    return [...unifiedReports]
      .map((r) => {
        const timestamp = new Date(r.createdAt || Date.now()).getTime();
        return {
          ...r,
          timeAgo: formatCustomTimeAgo(r.createdAt, lang, d),
          _timestamp: timestamp,
        };
      })
      .sort((a, b) => {
        return sortBy === "newest"
          ? b._timestamp - a._timestamp
          : a._timestamp - b._timestamp;
      });
  }, [unifiedReports, sortBy, lang, d]);

  /** Helper to safely get the current language label from a bilingual object or string */
  const getLabel = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    // Extract by priority: current lang -> 'id' (default) -> first key -> fallback to empty
    const directVal = obj[lang] || obj["id"];
    if (directVal) return directVal;

    // Fallback for cases where keys might be slightly different or missing
    const keys = Object.keys(obj);
    if (keys.length > 0) return obj[keys[0]];
    return "";
  };

  const demografiQuestions =
    qSpecialQuestions.data?.groups?.demografi?.questions || [];
  const topTopicsData = qTopTopics.data || [];

  const sortedTopics = React.useMemo(() => {
    if (!topics) return [];

    // Move "Trending" topics (top topics) to the front
    const topIds = new Set(topTopicsData.map((t: any) => String(t.topicId)));

    return [...topics].sort((a: any, b: any) => {
      const aIsTop = topIds.has(String(a.id));
      const bIsTop = topIds.has(String(b.id));
      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;
      return 0;
    });
  }, [topics, topTopicsData]);

  const reportsLoading = unifiedLoading;

  const categoryStats = React.useMemo(() => {
    const stats: Record<string, number> = { Semua: reports.length };
    reports.forEach((r) => {
      stats[r.category] = (stats[r.category] || 0) + 1;
    });
    return stats;
  }, [reports]);

  const categories = React.useMemo(() => {
    const list = reports.map((r: any) => r.category);
    return Array.from(new Set(list)).sort();
  }, [reports]);

  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState<any>({
    fullName: "",
    phone: "",
    nik: "",
    address: "",
    category: "",
    regency: "Kota Banda Aceh",
    district: "",
    village: "",
    description: "", // Maps to additional_info (Q8)
    urgentSupplies: "", // Q9
    urgentServices: "", // Q10
    accessToLocation: "accessible", // Q11
    latitude: "",
    longitude: "",
    images: [] as File[],
    previewImages: [] as string[],
    dynamicAnswers: {} as Record<string, any>,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const setDynamicAnswer = (questionId: string | number, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      dynamicAnswers: {
        ...prev.dynamicAnswers,
        [questionId]: value,
      },
    }));
  };

  // --- API Fetches (Topic-Specific Questions) ---
  const { data: topicQuestions, isLoading: loadingTopicQuestions } = useQuery({
    queryKey: ["topicQuestions", form.category],
    queryFn: () => apiService.getQuestionsByTopic(form.category),
    enabled: !!form.category,
    staleTime: 3600000,
  });



  const submitMutation = {
    mutate: (report: Report) => addReportMutation.mutate(report),
    isPending: addReportMutation.isPending,
  };

  const filteredReports = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return reports.filter((report: Report) => {
      const title = (report.title || "").toLowerCase();
      const desc = (report.description || "").toLowerCase();
      const cat = (report.category || "").toLowerCase();
      const reporter = (report.reporterName || "").toLowerCase();
      const loc = (report.location || "").toLowerCase();

      const matchesSearch =
        title.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        reporter.includes(query) ||
        loc.includes(query);

      const matchesStatus = true; // Status filter removed per request

      const matchesCategory =
        selectedCategory === "Semua" || report.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reports, searchQuery, selectedCategory]);

  const visibleReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(
        d.alert_geo_unsupported || "Browser Anda tidak mendukung fitur lokasi.",
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
      },
      () => {
        alert(
          d.alert_geo_fail ||
            "Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.",
        );
      },
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      addFiles(imageFiles);
    }
  };

  const addFiles = (files: File[]) => {
    if (files.length === 0) return;
    setForm((prev: any) => ({
      ...prev,
      images: [...prev.images, ...files],
      previewImages: [
        ...prev.previewImages,
        ...files.map((f) => URL.createObjectURL(f)),
      ],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const removeImage = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
      previewImages: prev.previewImages.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = publicReportSchema.safeParse({
      fullName: form.fullName,
      phone: form.phone,
      nik: form.nik,
      address: form.address,
      category: form.category,
      regency: form.regency,
      district: form.district,
      village: form.village,
      description: form.description || "Laporan Aduan Masyarakat",
    });

    if (!validation.success) {
      alert(validation.error.issues[0].message);
      // Optional: Jump to the step where error happened
      return;
    }

    try {
      // --- Upload Images to R2 first if selected ---
      let uploadedUrls: string[] = [];
      if (form.images && form.images.length > 0) {
        const uploadFormData = new FormData();
        form.images.forEach((file: File) => {
          uploadFormData.append("files", file);
        });
        uploadFormData.append("folder", "ukp2sa-reports");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Upload bukti foto gagal!");
        const uploadData = await uploadRes.json();
        uploadedUrls = uploadData.urls || [];
      }

      // Cari jawaban deskripsi dari pertanyaan dinamis tipe long_text
      const firstLongTextId = topicQuestions?.find(
        (q: any) => q.questionType === "long_text",
      )?.id;
      const finalDesc =
        form.description ||
        (firstLongTextId
          ? String(form.dynamicAnswers[firstLongTextId])
          : "Laporan Aduan Masyarakat");
      const finalTitle =
        finalDesc.slice(0, 35) + (finalDesc.length > 35 ? "..." : "");

      const newReport: any = {
        id: Date.now().toString(),
        title: finalTitle,
        description: finalDesc,
        location: form.address,
        regency: form.regency,
        district: form.district,
        village: form.village,
        reporterName: form.fullName,
        contactPhone: form.phone,
        nik: form.nik,
        latitude: form.latitude,
        longitude: form.longitude,
        timeAgo: d.time_just_now || "Baru saja",
        status: ReportStatus.PROCESS,
        category: form.category,
        reporterType: "masyarakat",
        source: "rest",
        createdAt: new Date().toISOString(),
        images: uploadedUrls, // Simpan URL real dari R2 CDN
        // Addendum data - we map the dynamic answers to answers array
        answers: Object.entries(form.dynamicAnswers).map(([qId, val]) => ({
          questionId: Number(qId),
          answer: val,
        })),
        // Fallback for fields that might be used by other parts of the system
        addendum: {
          additional_info: finalDesc,
          urgent_supplies: form.urgentSupplies,
          urgent_services: form.urgentServices,
          access_to_location: form.accessToLocation,
          attachment: {
            images: uploadedUrls,
          },
        },
      };

      submitMutation.mutate(newReport);

      logActivity(
        "CITIZEN_REPORT_SUBMITTED",
        "PUBLIC",
        `New citizen report submitted: ${finalTitle} at ${form.regency}`,
      );

      // --- Point 1: Integrated Notification ---
      addNotification({
        title: "Laporan Warga Baru",
        description: `Laporan masuk: ${form.description.slice(0, 50)}... di ${
          form.village
        }, ${form.regency}`,
        type: "report",
        priority: "high",
        actionLabel: "Lihat di Peta",
        link: "/admin/map",
      });

      // Handle successful submission
      alert(dict.common?.success || "Laporan berhasil dikirim!");
      setStep(1);
      setForm({
        fullName: "",
        phone: "",
        nik: "",
        address: "",
        category: CAT_OPTIONS[0]?.id || "",
        regency: regencies[0]?.name || "Kota Banda Aceh",
        district: "",
        village: "",
        description: "",
        urgentSupplies: "",
        urgentServices: "",
        accessToLocation: "accessible",
        latitude: "",
        longitude: "",
        images: [],
        previewImages: [],
        dynamicAnswers: {},
      });
    } catch (err) {
      console.error(err);
      alert(d.alert_fail || "Gagal mengirim laporan. Coba lagi nanti.");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="flex flex-col gap-32">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-12"
        id="laporan"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-primary-500/10 pb-10">
          <div className="flex flex-col gap-3">
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest md:tracking-[0.3em] bg-primary-500/10 px-4 py-1.5 rounded-full border border-primary-500/20">
                <History size={14} /> {d.list_sub || "Real-time Feed"}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-500/10 border border-accent-500/20 rounded-full backdrop-blur-md">
                <div className="size-1.5 bg-accent-500 rounded-full animate-pulse shadow-glow" />
                <span className="text-[9px] font-black text-accent-600 dark:text-accent-400 uppercase tracking-widest leading-none">
                  {d.list_live || "Langsung"}
                </span>
              </div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-black text-navy dark:text-white tracking-tight leading-tight"
            >
              {d.list_title || "Laporan Terkini"}
            </motion.h2>
          </div>
          <motion.div
            variants={itemVariants}
            className="flex gap-3 items-center"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={selectedCategory !== "Semua" ? "primary" : "outline"}
                  className="rounded-2xl h-14 px-6 font-bold shadow-bento hover:scale-105 transition-all outline-none"
                >
                  <Filter size={18} className="mr-2" />
                  <span className="hidden sm:inline">
                    {selectedCategory === "Semua"
                      ? d.filter || "Filter"
                      : selectedCategory === "All" ||
                        selectedCategory === "Semua"
                      ? d.all_reports || "Semua Laporan"
                      : selectedCategory}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-4 rounded-[2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-primary-500/10 shadow-2xl"
              >
                <DropdownMenuLabel className="px-2 py-0 mb-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {d.sort_time || "Sortir Waktu"}
                      </span>
                      {((selectedCategory !== "Semua" &&
                        selectedCategory !== "All") ||
                        sortBy !== "newest") && (
                        <button
                          onClick={() => {
                            setSelectedCategory("Semua");
                            setSortBy("newest");
                          }}
                          className="text-[10px] font-bold text-primary-500 hover:underline"
                        >
                          {d.reset || "Reset"}
                        </button>
                      )}
                    </div>
                    <Tabs
                      value={sortBy}
                      onValueChange={(v: any) => setSortBy(v)}
                      className="w-full"
                    >
                      <TabsList className="w-full h-10 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <TabsTrigger value="newest" className="flex-1 text-xs">
                          {d.newest || "Terbaru"}
                        </TabsTrigger>
                        <TabsTrigger value="oldest" className="flex-1 text-xs">
                          {d.oldest || "Terlama"}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-primary-500/5 my-4" />

                <DropdownMenuLabel className="px-2 py-0 mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {d.category_label || "Kategori"}
                  </span>
                </DropdownMenuLabel>

                <ScrollArea className="h-64 pr-2">
                  <DropdownMenuGroup className="flex flex-col gap-1">
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Semua")}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                        selectedCategory === "Semua" ||
                          selectedCategory === "All"
                          ? "bg-primary-500/10 text-primary-600"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800",
                      )}
                    >
                      <span className="text-sm font-bold">
                        {d.all_reports || "Semua Laporan"}
                      </span>
                      <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-500 border-none text-[10px] px-2 py-0">
                        {categoryStats["Semua"]}
                      </Badge>
                    </DropdownMenuItem>

                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                          selectedCategory === cat
                            ? "bg-primary-500/10 text-primary-600"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800",
                        )}
                      >
                        <span className="text-sm font-bold truncate pr-2">
                          {cat}
                        </span>
                        <Badge className="bg-primary-500/10 text-primary-500 border-none text-[10px] px-2 py-0">
                          {categoryStats[cat]}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={searchQuery ? "primary" : "outline"}
              className="rounded-2xl h-14 px-6 font-bold shadow-bento hover:scale-105 transition-all"
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <Search size={18} className="mr-2" />{" "}
              <span className="hidden sm:inline">{d.search || "Telusuri"}</span>
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="relative flex-1 p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-bento dark:shadow-bento-dark">
                <Search
                  className="absolute left-14 top-1/2 -translate-y-1/2 text-primary-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={d.search_placeholder || "Cari laporan..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {reportsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[280px] w-full rounded-[2.5rem] bg-white/20 dark:bg-slate-900/20 animate-pulse border border-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {visibleReports.map((report: Report) => (
                <motion.div
                  layout
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className="group relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 transition-all duration-500 overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 active:scale-[0.98]"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="p-8 flex flex-col h-full gap-6">
                      {/* Header Section */}
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "size-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 border transition-all duration-700 shadow-glow",
                            report.status === ReportStatus.DONE
                              ? "bg-accent-500/10 text-accent-600 border-accent-500/20"
                              : "bg-primary-500/10 text-primary-600 border-primary-500/20",
                          )}
                        >
                          {getCategoryIcon(report.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-navy dark:text-white text-xl tracking-tight line-clamp-2 leading-tight group-hover:text-primary-500 transition-colors mb-2">
                            {report.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <ReporterBadge type={report.reporterType} />
                            <span className="text-[9px] font-black text-primary-500 uppercase tracking-[0.1em] bg-primary-500/5 px-2.5 py-1 rounded-lg border border-primary-500/10">
                              {report.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="flex-1 py-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed font-medium">
                          {report.description}
                        </p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <User size={12} className="text-primary-500" />{" "}
                            {d.reporter_label || "Pelapor"}
                          </span>
                          <span className="font-bold text-navy dark:text-slate-200 text-xs truncate uppercase">
                            {report.reporterName}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 border-l border-slate-200 dark:border-slate-700 pl-4">
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <MapPin size={12} className="text-primary-500" />{" "}
                            {d.location_label || "Lokasi"}
                          </span>
                          <span className="font-bold text-navy dark:text-slate-200 text-xs truncate uppercase">
                            {report.location?.split(",")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-primary-500" />
                          {report.timeAgo}
                        </div>
                        <div className="flex items-center gap-1 text-primary-500">
                          {d.check_detail || "CEK DETIL"}{" "}
                          <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>

                    {report.adminReply && (
                      <div className="mx-8 mb-8 p-5 rounded-3xl bg-navy text-white relative overflow-hidden group/reply animate-in fade-in slide-in-from-bottom-2 border border-white/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12 group-hover/reply:rotate-0 transition-transform duration-500">
                          <Reply size={60} />
                        </div>
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-accent-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                              {d.official_response || "Respon Resmi"}
                            </span>
                          </div>
                          <p className="text-xs font-bold leading-relaxed italic opacity-95">
                            &ldquo;{report.adminReply.content}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      {/* Report Detail Modal */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 ring-1 ring-black/5">
          {selectedReport && (
            <>
              <DialogHeader className="p-8 md:p-10 pb-4">
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={cn(
                      "size-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                      selectedReport.status === ReportStatus.DONE
                        ? "bg-accent-500/10 text-accent-600 border-accent-500/20 shadow-glow"
                        : "bg-primary-500/10 text-primary-600 border-primary-500/20 shadow-glow",
                    )}
                  >
                    {getCategoryIcon(selectedReport.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight leading-none mb-1 truncate">
                      {selectedReport.title}
                    </DialogTitle>
                    <div className="flex items-center gap-3">
                      <ReporterBadge type={selectedReport.reporterType} />
                      <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/5 px-3 py-1.5 rounded-xl border border-primary-500/10">
                        {selectedReport.category}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ID: {selectedReport.id.split("-").pop()}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 px-8 md:px-10 pb-10">
                <div className="space-y-10">
                  {/* Summary & Identity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} /> {d.reporter_party || "Pihak Pelapor"}
                      </h5>
                      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 space-y-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="text-slate-400" size={18} />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              {d.reporter_full_name || "Nama Lengkap"}
                            </p>
                            <p className="font-bold text-navy dark:text-white uppercase mt-1">
                              {maskPII(selectedReport.reporterName, "name")}
                            </p>
                          </div>
                        </div>
                        {(selectedReport.data?.respondentInfo?.phoneNumber ||
                          selectedReport.contactPhone) && (
                          <div className="flex items-center gap-3">
                            <PhoneCall className="text-slate-400" size={18} />
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {d.whatsapp_contact || "Kontak WhatsApp"}
                              </p>
                              <p className="font-bold text-navy dark:text-white mt-1">
                                {maskPII(
                                  selectedReport.data?.respondentInfo
                                    ?.phoneNumber ||
                                    selectedReport.contactPhone,
                                  "phone",
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin size={12} />{" "}
                        {d.incident_location || "Lokasi Kejadian"}
                      </h5>
                      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 space-y-4">
                        <div className="flex items-center gap-3">
                          <MapPinned className="text-slate-400" size={18} />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              Wilayah / Desa
                            </p>
                            <p className="font-bold text-navy dark:text-white uppercase mt-1">
                              {selectedReport.data?.village ||
                                selectedReport.regency}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="text-slate-400" size={18} />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              Waktu Kejadian
                            </p>
                            <p className="font-bold text-navy dark:text-white mt-1 uppercase">
                              {selectedReport.timeAgo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question & Answers List */}
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MessageSquare size={12} /> Data Tanya Jawab Lapangan
                    </h5>
                    <div className="space-y-4">
                      {selectedReport.data?.answers?.map(
                        (ans: any, idx: number) => {
                          const actualAnswer =
                            typeof ans.answer === "string"
                              ? ans.answer
                              : ans.answer?.label ||
                                (Array.isArray(ans.answer)
                                  ? ans.answer
                                      .map((i: any) => i.label)
                                      .join(", ")
                                  : JSON.stringify(ans.answer));

                          return (
                            <div key={idx} className="group/ans">
                              <div className="flex gap-4">
                                <div className="size-8 rounded-xl bg-primary-500/5 text-primary-500 flex items-center justify-center font-black text-xs shrink-0 group-hover/ans:bg-primary-500 group-hover/ans:text-white transition-all">
                                  {idx + 1}
                                </div>
                                <div className="space-y-1.5 pb-6 border-l border-slate-100 dark:border-slate-800 pl-6 ml-[-20px] w-full">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                    Q: {getLabel(ans.question)}
                                  </p>
                                  <p className="text-sm font-bold text-navy dark:text-white leading-relaxed">
                                    {typeof actualAnswer === "object"
                                      ? getLabel(actualAnswer)
                                      : actualAnswer === "true"
                                      ? "Ya"
                                      : actualAnswer === "false"
                                      ? "Tidak"
                                      : actualAnswer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      ) || (
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-bold text-slate-400">
                            Tidak ada data tanya jawab tambahan.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachments Carousel */}
                  {selectedReport.data?.attachment?.images?.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <ImageIcon size={12} /> Lampiran Foto Kejadian (
                          {selectedReport.data.attachment.images.length})
                        </h5>
                        <div className="flex gap-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Gunakan panah untuk navigasi
                          </p>
                        </div>
                      </div>
                      <div className="px-12">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {selectedReport.data.attachment.images.map(
                              (img: string, idx: number) => (
                                <CarouselItem
                                  key={idx}
                                  className="md:basis-1/2 lg:basis-1/3"
                                >
                                  <div className="p-1">
                                    <Card className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group/img cursor-zoom-in relative bg-slate-100 dark:bg-slate-800">
                                      <Image
                                        src={img}
                                        alt={`Lampiran ${idx}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                      />
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <Paperclip
                                          className="text-white"
                                          size={24}
                                        />
                                      </div>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ),
                            )}
                          </CarouselContent>
                          <CarouselPrevious className="-left-6 size-10 bg-white dark:bg-slate-800 shadow-lg border-none hover:bg-primary-500 hover:text-white transition-all" />
                          <CarouselNext className="-right-6 size-10 bg-white dark:bg-slate-800 shadow-lg border-none hover:bg-primary-500 hover:text-white transition-all" />
                        </Carousel>
                      </div>
                    </div>
                  )}

                  {/* Admin Reply if exists */}
                  {selectedReport.adminReply && (
                    <div className="p-8 rounded-[2rem] bg-navy text-white relative overflow-hidden shadow-xl shadow-navy/20">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
                        <Reply size={80} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-accent-500" />
                          <h6 className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Respon Resmi Admin
                          </h6>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic opacity-90">
                          &ldquo;{selectedReport.adminReply.content}&rdquo;
                        </p>
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                          <span>
                            Oleh: {selectedReport.adminReply.repliedBy}
                          </span>
                          <span>{selectedReport.adminReply.repliedAt}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} /> Terverifikasi Sistem
                </div>
                <Button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest shadow-glow hover:scale-105 transition-transform"
                >
                  Tutup Rincian
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        id="kirim-laporan"
        className="flex flex-col gap-12 py-20 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full max-w-5xl bg-primary-500/10 rounded-full blur-[200px] pointer-events-none" />
        <div className="flex flex-col gap-4 text-center items-center relative z-10">
          <motion.span
            variants={itemVariants}
            className="text-primary-600 dark:text-primary-400 font-black tracking-widest md:tracking-[0.4em] text-[10px] uppercase bg-primary-500/10 px-5 py-2.5 rounded-full border border-primary-500/20"
          >
            {d.form_sub || "Suara Komunitas"}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-black text-navy dark:text-white tracking-tight"
          >
            {d.form_title_1 || "Kirim"}{" "}
            <span className="neon-gradient-text">
              {d.form_title_gradient || "Keluhan Anda."}
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-xl max-w-3xl px-8 leading-relaxed"
          >
            {d.form_desc ||
              "Laporkan masalah infrastruktur untuk Aceh yang lebih baik."}
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="max-w-5xl mx-auto w-full px-4 text-left relative z-10"
        >
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-10 px-4 md:px-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="flex flex-col items-center gap-2 relative"
              >
                <div
                  className={cn(
                    "size-10 md:size-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500",
                    step === s
                      ? "bg-primary-500 text-white shadow-glow scale-110"
                      : step > s
                      ? "bg-primary-500/20 text-primary-500"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600",
                  )}
                >
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                <span
                  className={cn(
                    "text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden sm:block",
                    step === s
                      ? "text-primary-500"
                      : "text-slate-400 dark:text-slate-500",
                  )}
                >
                  {s === 1 && d.step_1}
                  {s === 2 && d.step_2}
                  {s === 3 && d.step_3}
                  {s === 4 && d.step_4}
                  {s === 5 && d.step_5}
                </span>
                {s < 5 && (
                  <div className="absolute top-5 md:top-6 -right-[60px] md:-right-[80px] w-[50px] md:w-[70px] h-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block">
                    <motion.div
                      className="h-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: step > s ? "100%" : 0 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Card className="!p-6 md:!p-16 border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border-t-8 border-primary-500 overflow-hidden">
            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Dynamic Demographic Fields */}
                      {[0, 1].map((idx) => {
                        const q = demografiQuestions[idx];
                        const icon =
                          idx === 0 ? (
                            <User size={16} className="text-primary-500" />
                          ) : (
                            <Fingerprint
                              size={16}
                              className="text-primary-500"
                            />
                          );
                        const formKey = idx === 0 ? "fullName" : "nik";
                        const label =
                          getLabel(q?.question) ||
                          (idx === 0
                            ? d.form_placeholder_name
                            : d.form_label_nik);

                        return (
                          <div key={idx} className="flex flex-col gap-3.5">
                            <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                              {icon} {label}
                            </label>
                            <input
                              value={form[formKey]}
                              onChange={(e) =>
                                setForm({ ...form, [formKey]: e.target.value })
                              }
                              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white dark:placeholder:text-slate-500"
                              placeholder={label}
                              maxLength={formKey === "nik" ? 16 : undefined}
                              required
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3.5">
                        <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                          <Phone size={16} className="text-primary-500" />{" "}
                          {getLabel(demografiQuestions[2]?.question) ||
                            d.form_label_phone}
                        </label>
                        <input
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white dark:placeholder:text-slate-500"
                          placeholder="08..."
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-3.5 w-full">
                        <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                          <LayoutGrid size={16} className="text-primary-500" />{" "}
                          {d.category_label || "Pilih Kategori"}
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white"
                        >
                          <option
                            value=""
                            disabled
                            className="dark:bg-slate-800"
                          >
                            Pilih Topik Aduan...
                          </option>
                          {sortedTopics?.map((topic: any) => {
                            const isTrending = topTopicsData.some(
                              (t: any) =>
                                String(t.topicId) === String(topic.id),
                            );
                            return (
                              <option
                                key={topic.id}
                                value={topic.id}
                                className="dark:bg-slate-800"
                              >
                                {isTrending ? "🔥 " : ""}
                                {getLabel(
                                  topic.name || topic.title || topic.label,
                                )}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* --- Topic-Specific Dynamic Questions --- */}
                      {loadingTopicQuestions && (
                        <div className="flex flex-col gap-6 animate-pulse pt-4">
                          <div className="space-y-3">
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                            <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full" />
                          </div>
                          <div className="space-y-3">
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                            <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full" />
                          </div>
                        </div>
                      )}

                      {!loadingTopicQuestions &&
                        topicQuestions &&
                        topicQuestions.length > 0 && (
                          <div className="flex flex-col gap-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <MessageSquare size={12} />{" "}
                                {d.step2_title || "PERTANYAAN TOPIK"}
                              </h5>
                              <p className="text-[10px] font-medium text-slate-400">
                                Detail informasi berdasarkan kategori yang Anda
                                pilih
                              </p>
                            </div>
                            <div className="grid grid-cols-1 gap-10">
                              {topicQuestions.map((q: any) => (
                                <div key={q.id} className="flex flex-col gap-5">
                                  <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-navy/70 dark:text-slate-300">
                                    {getLabel(q.question)}{" "}
                                    {q.required && (
                                      <span className="text-rose-500">*</span>
                                    )}
                                  </label>

                                  {q.questionType === "single_choice" ? (
                                    <div className="grid grid-cols-1 gap-3">
                                      {q.options?.map((opt: any) => {
                                        const isSelected =
                                          form.dynamicAnswers[q.id] === opt.key;
                                        return (
                                          <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() =>
                                              setDynamicAnswer(q.id, opt.key)
                                            }
                                            className={cn(
                                              "w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm flex items-center justify-between group",
                                              isSelected
                                                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-md"
                                                : "border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-primary-300",
                                            )}
                                          >
                                            <span>{getLabel(opt.label)}</span>
                                            <div
                                              className={cn(
                                                "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                isSelected
                                                  ? "border-primary-500 bg-primary-500"
                                                  : "border-slate-300 dark:border-slate-600",
                                              )}
                                            >
                                              {isSelected && (
                                                <div className="size-2 bg-white rounded-full" />
                                              )}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : q.questionType === "boolean" ? (
                                    <div className="grid grid-cols-2 gap-4">
                                      {[
                                        { label: "Ya", value: "true" },
                                        { label: "Tidak", value: "false" },
                                      ].map((opt) => {
                                        const isSelected =
                                          String(form.dynamicAnswers[q.id]) ===
                                          opt.value;
                                        return (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                              setDynamicAnswer(
                                                q.id,
                                                opt.value === "true",
                                              )
                                            }
                                            className={cn(
                                              "flex-1 px-6 py-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm text-center",
                                              isSelected
                                                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                                                : "border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400",
                                            )}
                                          >
                                            {getLabel(opt.label)}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : q.questionType === "long_text" ? (
                                    <textarea
                                      value={form.dynamicAnswers[q.id] || ""}
                                      onChange={(e) =>
                                        setDynamicAnswer(q.id, e.target.value)
                                      }
                                      className="w-full bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm font-bold shadow-inner min-h-[120px] dark:text-white transition-all outline-none"
                                      placeholder="Masukkan jawaban..."
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={form.dynamicAnswers[q.id] || ""}
                                      onChange={(e) =>
                                        setDynamicAnswer(q.id, e.target.value)
                                      }
                                      className="w-full bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm font-bold shadow-inner dark:text-white transition-all outline-none"
                                      placeholder="Ketik di sini..."
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col gap-3.5">
                        <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                          <Building2 size={16} className="text-primary-500" />{" "}
                          {d.form_label_region}
                        </label>
                        <select
                          value={form.regency}
                          onChange={(e) =>
                            setForm({ ...form, regency: e.target.value })
                          }
                          className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white"
                        >
                          {regencies.map((opt) => (
                            <option
                              key={opt.code}
                              value={opt.name}
                              className="dark:bg-slate-800"
                            >
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-3.5">
                        <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                          {d.form_label_district}
                        </label>
                        <input
                          value={form.district}
                          onChange={(e) =>
                            setForm({ ...form, district: e.target.value })
                          }
                          className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white dark:placeholder:text-slate-500"
                          placeholder={d.form_placeholder_district}
                        />
                      </div>
                      <div className="flex flex-col gap-3.5">
                        <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                          {d.form_label_village}
                        </label>
                        <input
                          value={form.village}
                          onChange={(e) =>
                            setForm({ ...form, village: e.target.value })
                          }
                          className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner dark:text-white dark:placeholder:text-slate-500"
                          placeholder={d.form_placeholder_village}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70">
                        <MapPin size={16} className="text-primary-500" /> Detail
                        Alamat
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        className="w-full bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 text-sm font-bold shadow-inner"
                        placeholder="Nama jalan, nomor rumah, atau patokan..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3.5">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                            {d.form_label_latitude}
                          </label>
                          <input
                            value={form.latitude}
                            readOnly
                            className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono font-bold dark:text-primary-400"
                            placeholder="0.0000"
                          />
                        </div>
                        <div className="flex flex-col gap-3.5">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                            {d.form_label_longitude}
                          </label>
                          <input
                            value={form.longitude}
                            readOnly
                            className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono font-bold dark:text-primary-400"
                            placeholder="0.0000"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleGetLocation}
                        variant="primary"
                        className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
                        icon={<MapPinned size={18} />}
                      >
                        {d.form_button_get_location ||
                          "Gunakan Lokasi Saat Ini"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="flex flex-col gap-6">
                      <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                        <ImageIcon size={16} className="text-primary-500" />{" "}
                        {d.form_label_images}
                      </label>

                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                          "relative min-h-[250px] rounded-[2.5rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center gap-6 group overflow-hidden",
                          isDragging
                            ? "border-primary-500 bg-primary-500/10 scale-[1.02]"
                            : "border-slate-200 dark:border-slate-700/50 hover:border-primary-400/50 bg-slate-50/50 dark:bg-slate-800/20",
                        )}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          onChange={handleImageChange}
                        />

                        <div className="flex flex-col items-center gap-4 relative z-10">
                          <div
                            className={cn(
                              "size-16 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                              isDragging
                                ? "bg-primary-500 text-white scale-125 rotate-12"
                                : "text-primary-500",
                            )}
                          >
                            <UploadCloud size={32} />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest">
                              {isDragging
                                ? "Lepas untuk upload!"
                                : "Drag & Drop Gambar"}
                            </h5>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              Atau klik untuk pilih file dari perangkat
                            </p>
                          </div>
                        </div>

                        {/* Animated background decoration */}
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                          <ImageIcon size={120} />
                        </div>
                      </div>

                      {form.previewImages.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 dark:text-slate-500">
                            File Terpilih ({form.previewImages.length})
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <AnimatePresence mode="popLayout">
                              {form.previewImages.map(
                                (src: string, i: number) => (
                                  <motion.div
                                    key={src}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    layout
                                    className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                                  >
                                    <Image
                                      src={src}
                                      alt={`Preview ${i}`}
                                      fill
                                      unoptimized
                                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="size-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                                      >
                                        <X size={20} />
                                      </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                                      File {i + 1}
                                    </div>
                                  </motion.div>
                                ),
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center italic mt-4">
                        {d.form_images_hint ||
                          "Pastikan gambar terlihat jelas untuk memudahkan verifikasi petugas."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.05, opacity: 0 }}
                    className="flex flex-col gap-10"
                  >
                    <div className="bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 dark:border-primary-500/20 rounded-3xl p-8 space-y-8">
                      <h4 className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest flex items-center gap-3">
                        <AlertCircle size={20} /> {d.confirm_title}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {d.confirm_identity}
                          </p>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-navy dark:text-white uppercase">
                              {form.fullName}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              NIK: {form.nik}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              Telp: {form.phone}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {d.confirm_location}
                          </p>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-navy dark:text-white uppercase transition-colors">
                              {form.village}, {form.district}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {form.regency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-primary-500/20 dark:border-primary-500/30">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                          {d.confirm_content}
                        </p>
                        <p className="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-300">
                          &ldquo;{form.description}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 rounded-2xl">
                      <Shield size={20} className="text-amber-500 shrink-0" />
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-normal">
                        {d.confirm_disclaimer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 dark:border-slate-800/50 mt-10">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 rounded-2xl h-16 font-black uppercase text-xs tracking-widest border-slate-200 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {d.button_back}
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-[2] rounded-2xl h-16 font-black uppercase text-xs tracking-widest shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
                  icon={
                    step === 5 ? <Send size={18} /> : <ChevronRight size={18} />
                  }
                  loading={addReportMutation.isPending}
                >
                  {step === 5 ? d.button_submit : d.button_next}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ReportSection;
