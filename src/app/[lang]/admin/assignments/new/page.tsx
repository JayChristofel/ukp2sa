"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, Button, Input } from "@/components/ui";
import { Textarea as TextareaComponent } from "@/components/ui/textarea";
import { Slider as SliderComponent } from "@/components/ui/slider";
import {
  Select as SelectRoot,
  SelectContent as SelectContentRoot,
  SelectItem as SelectItemRoot,
  SelectTrigger as SelectTriggerRoot,
  SelectValue as SelectValueRoot,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Truck,
  Building2,
  Users,
  AlertTriangle,
  MapPin,
  Phone,
  BarChart3,
  Save,
  ClipboardList,
  Sparkles,
  Search,
  Info,
  Link as LinkIcon,
  SearchX,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { cn } from "@/lib/utils";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

const dispatchSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  assignee: z.string().min(2, "Pilih personil/instansi"),
  category: z.enum(["K/L", "Pemda", "Satgas", "NGO"]),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  location: z.string().min(3, "Lokasi tidak boleh kosong"),
  notes: z.string().min(10, "Instruksi minimal 10 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  urgencyScore: z.number().min(0).max(100),
  sourceId: z.string().optional(),
  sourceType: z.string().optional(),
});

type DispatchFormValues = z.infer<typeof dispatchSchema>;

export default function NewDispatchPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string;
  const dict = useI18n();
  const d = dict?.assignments || {};
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "NEW_ASSIGNMENT_VIEW",
      "REPORTS",
      "User accessed the new assignment dispatch portal.",
    );
  }, [logActivity]);

  const [sourceSearch, setSourceSearch] = useState("");
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  // 1. Fetch Master Data for Auto-fill Dropdowns
  const { data: partners = [] } = useQuery({
    queryKey: ["partnersList"],
    queryFn: () => apiService.getPartners(),
  });

  // 2. Fetch All Possible Sources for the Connector
  const { data: reports = [] } = useQuery({
    queryKey: ["reportAnswers"],
    queryFn: () => apiService.getReportAnswers(),
  });

  const { data: conflicts = [] } = useQuery({
    queryKey: ["clearingHouseSources"],
    queryFn: () => apiService.getClearingHouseData(),
  });

  const { data: missing = [] } = useQuery({
    queryKey: ["missingPersonsSources"],
    queryFn: () => apiService.getMissingPersons(1),
  });

  const { data: posko = [] } = useQuery({
    queryKey: ["poskoSources"],
    queryFn: () => apiService.getPosko(1),
  });

  // 3. Unified Source Aggregator
  const unifiedSources = useMemo(() => {
    const items: any[] = [];

    // [SAR] Missing Persons
    missing.forEach((p: any) =>
      items.push({
        id: p.id,
        type: "SAR",
        label: `[SAR] Pencarian: ${p.name}`,
        location: p.regency || "Wilayah Operasional",
        notes: `Target: ${p.name}. Terakhir terlihat: ${
          p.lastSeenLocation || "Tidak diketahui"
        }. Usia: ${p.age || "-"} thn.`,
        phone: "+62 811-XXXX-XXXX",
        priority: "Critical",
        urgency: 90,
      }),
    );

    // [KONFLIK] Budget Conflicts
    conflicts
      .filter((c: any) => c.status === "duplicate")
      .forEach((c: any) =>
        items.push({
          id: c.id,
          type: "KONFLIK",
          label: `[KONFLIK] Duplikasi: ${c.title}`,
          location: c.location,
          notes: `Indikasi tumpang tindih anggaran di ${c.location}. Agency: ${c.agency}. Dibutuhkan verifikasi lapangan.`,
          phone: "+62 812-XXXX-XXXX",
          priority: "Medium",
          urgency: 45,
        }),
      );

    // [LAPORAN] Citizens Reports
    reports.forEach((r: any) =>
      items.push({
        id: r.id,
        type: "LAPORAN",
        label: `[LAPORAN] Laporan Warga: ${r.title || r.subject}`,
        location: r.location || r.regency,
        notes: `Aduan Masyarakat: "${r.description || r.content}". Status: ${
          r.status
        }.`,
        phone: r.contactPhone || "+62 8XX-XXXX-XXXX",
        priority: r.priority === "HIGH" ? "High" : "Medium",
        urgency: r.priority === "HIGH" ? 75 : 50,
      }),
    );

    // [LOGISTIK] Posko
    posko.forEach((p: any) =>
      items.push({
        id: p.id,
        type: "LOGISTIK",
        label: `[LOGISTIK] Supervisi: Posko ${p.namaPosko}`,
        location: p.kecamatan || p.kabupaten,
        notes: `Posko bantuan terdeteksi di ${
          p.kecamatan
        }. Koordinasi logistik dikoordinasi oleh ${p.koordinator || "BPBD"}.`,
        phone: "+62 852-XXXX-XXXX",
        priority: "High",
        urgency: 65,
      }),
    );

    return items;
  }, [missing, conflicts, reports, posko]);

  const filteredSources = useMemo(() => {
    if (!sourceSearch) return unifiedSources.slice(0, 10);
    return unifiedSources
      .filter((s) => s.label.toLowerCase().includes(sourceSearch.toLowerCase()))
      .slice(0, 10);
  }, [unifiedSources, sourceSearch]);

  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchSchema),
    defaultValues: {
      title: "",
      assignee: "",
      category: "Satgas",
      priority: "Medium",
      location: "",
      notes: "",
      phone: "",
      urgencyScore: 50,
    },
  });

  const watchCategory = useWatch({ control: form.control, name: "category" });
  const watchPriority = useWatch({ control: form.control, name: "priority" });
  const watchUrgency = useWatch({ control: form.control, name: "urgencyScore" });
  const watchSourceId = useWatch({ control: form.control, name: "sourceId" });

  const handleSourceSelect = (source: any) => {
    form.setValue("sourceId", source.id);
    form.setValue("sourceType", source.type);

    // Magic Auto-fill
    form.setValue(
      "title",
      `PENANGANAN ${source.type}: ${source.label.split(": ")[1]}`,
    );
    form.setValue("location", source.location);
    form.setValue("notes", source.notes);
    form.setValue("priority", source.priority);
    form.setValue("urgencyScore", source.urgency);

    // Auto-fill phone based on source if available
    if (source.phone && source.phone !== "+62 8XX-XXXX-XXXX") {
      form.setValue("phone", source.phone);
    }

    setSourceSearch(source.label);
    setIsSourceOpen(false);
    toast.success(`Data dari ${source.type} berhasil dihubungkan!`, {
      icon: <Sparkles className="text-primary size-4" />,
    });
  };

  const handleResetSource = () => {
    form.reset({
      title: "",
      assignee: "",
      category: "Satgas",
      priority: "Medium",
      location: "",
      notes: "",
      phone: "",
      urgencyScore: 50,
      sourceId: undefined,
      sourceType: undefined,
    });
    setSourceSearch("");
    setIsSourceOpen(false);
    toast.info("Hubungan data telah dilepas (Form direset).");
  };

  const onSubmit = async (values: DispatchFormValues) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Mendaftarkan instruksi ke sistem operasional...",
      success: "Penugasan resmi telah di-dispatch ke personil!",
      error: "Gagal memproses dispatch.",
    });

    setTimeout(() => {
      logActivity(
        "ASSIGNMENT_DISPATCHED",
        "REPORTS",
        `Dispatching new task: ${values.title} to ${values.assignee}`,
      );
      addNotification({
        title: "Penugasan Baru",
        description: `Tugas "${values.title}" telah di-dispatch ke ${values.assignee}.`,
        type: "assignment",
        priority: values.priority === "Critical" ? "high" : "medium",
        actionLabel: "Lihat Tugas",
        link: "/admin/assignments",
      });
      router.push(`/${lang}/admin/assignments`);
    }, 2000);
  };

  const selectedCategory = watchCategory;
  const filteredPartners = partners.filter(
    (p) => p.category === selectedCategory,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-display">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-navy dark:hover:text-white"
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-navy dark:text-white uppercase tracking-tighter">
            {d.form_title || "Buat Penugasan Baru"}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            Koordinasi Lintas Sektoral & Satgas Operasional
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Integrated Source Connector */}
        <Card
          className={cn(
            "border-none rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-primary/5 to-white/40 dark:from-primary/10 dark:to-slate-900/40 backdrop-blur-3xl p-8 relative group transition-all duration-500",
            isSourceOpen ? "z-[100] ring-2 ring-primary/20" : "z-10",
          )}
        >
          {/* Contained Background Decoration */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <LinkIcon size={120} className="rotate-12" />
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles size={16} />
              </div>
              <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest">
                {d.field_source || "Hubungkan Sumber Data"}
              </h3>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-primary"
              />
              <input
                type="text"
                value={sourceSearch}
                onChange={(e) => {
                  setSourceSearch(e.target.value);
                  setIsSourceOpen(true);
                }}
                onFocus={() => setIsSourceOpen(true)}
                placeholder={
                  d.field_source_placeholder ||
                  "Cari data laporan, konflik, atau SAR..."
                }
                className="w-full pl-14 pr-6 py-5 bg-white/60 dark:bg-slate-800/60 border-2 border-primary/10 focus:border-primary/40 rounded-3xl text-xs font-bold outline-none ring-4 ring-primary/5 transition-all placeholder:text-slate-400 dark:text-white"
              />

              {watchSourceId && (
                <button
                  type="button"
                  onClick={handleResetSource}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase shadow-lg shadow-rose-500/5 group/reset"
                >
                  <RotateCcw
                    size={12}
                    className="group-hover/reset:rotate-[-180deg] transition-transform duration-500"
                  />
                  Reset
                </button>
              )}

              <AnimatePresence>
                {isSourceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 z-[100] bg-white dark:bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-[400px] overflow-y-auto custom-scrollbar p-3"
                  >
                    {filteredSources.length > 0 ? (
                      <div className="grid gap-2">
                        {filteredSources.map((source) => (
                          <button
                            key={`${source.type}-${source.id}`}
                            type="button"
                            onClick={() => handleSourceSelect(source)}
                            className="w-full text-left p-4 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex items-center justify-between group/item"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "size-10 rounded-xl flex items-center justify-center font-black text-[9px] shadow-sm",
                                  source.type === "SAR"
                                    ? "bg-rose-500 text-white"
                                    : source.type === "LAPORAN"
                                    ? "bg-amber-500 text-white"
                                    : source.type === "LOGISTIK"
                                    ? "bg-blue-500 text-white"
                                    : "bg-purple-500 text-white",
                                )}
                              >
                                {source.type}
                              </div>
                              <div>
                                <p className="text-xs font-black text-navy dark:text-white uppercase tracking-tight">
                                  {source.label.includes(": ")
                                    ? source.label.split(": ")[1]
                                    : source.label}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  {source.location}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              size={14}
                              className="text-slate-300 group-hover/item:text-primary transition-colors translate-x-4 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-400">
                        <SearchX
                          size={32}
                          className="mx-auto mb-2 opacity-20"
                        />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Tidak dapat menemukan data terkait
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[9px] font-bold text-slate-500 flex items-center gap-2 px-2">
              <Info size={12} className="text-primary" />
              Pilih sumber data untuk mengotomatisasi pengisian form di bawah
              ini secara instan.
            </p>
          </div>
        </Card>

        {/* Step 2: Main Form Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none rounded-[2.5rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Truck size={14} className="text-primary" />{" "}
                  {d.field_task_title}
                </label>
                <Input
                  {...form.register("title")}
                  placeholder="Ketik judul penugasan..."
                  className="bg-white/50 dark:bg-slate-800/50 border-none rounded-2xl h-14 font-black uppercase text-[11px] tracking-tight focus:ring-primary/30"
                />
                {form.formState.errors.title && (
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider pl-2">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin size={14} className="text-rose-500" />{" "}
                    {d.field_location}
                  </label>
                  <Input
                    {...form.register("location")}
                    placeholder="Wilayah / Titik Operasi"
                    className="bg-white/50 dark:bg-slate-800/50 border-none rounded-2xl h-14 font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone size={14} className="text-primary" /> {d.field_phone}
                  </label>
                  <Input
                    {...form.register("phone")}
                    placeholder="+62 8xx-xxxx-xxxx"
                    className="bg-white/50 dark:bg-slate-800/50 border-none rounded-2xl h-14 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ClipboardList size={14} className="text-primary" />{" "}
                  {d.field_notes}
                </label>
                <TextareaComponent
                  {...form.register("notes")}
                  placeholder="Instruksi mendetail dari pimpinan/admin..."
                  className="bg-white/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] min-h-[180px] font-medium text-sm p-5 leading-relaxed italic"
                />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-none rounded-[2.5rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />{" "}
                    {d.field_category}
                  </label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    {["Satgas", "K/L", "Pemda", "NGO"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          form.setValue("category", c as any);
                          form.setValue("assignee", "");
                        }}
                        className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all ${
                          watchCategory === c
                            ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                            : "text-slate-400 hover:text-navy dark:hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Users size={14} className="text-primary" />{" "}
                    {d.field_assignee}
                  </label>
                  <SelectRoot
                    onValueChange={(val) => {
                      form.setValue("assignee", val);
                      const partner = partners.find((p) => p.name === val);
                      if (partner?.phone) form.setValue("phone", partner.phone);
                    }}
                    value={useWatch({ control: form.control, name: "assignee" })}
                  >
                    <SelectTriggerRoot className="bg-white/50 dark:bg-slate-800/50 border-none rounded-2xl h-12 font-bold uppercase text-[10px] tracking-widest">
                      <SelectValueRoot placeholder="Pilih Agensi" />
                    </SelectTriggerRoot>
                    <SelectContentRoot className="rounded-2xl border-none shadow-3xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                      {filteredPartners.length > 0 ? (
                        filteredPartners.map((p) => (
                          <SelectItemRoot key={p.id} value={p.name}>
                            {p.name}
                          </SelectItemRoot>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[9px] font-black text-slate-400 uppercase">
                          Input manual (Coming soon)
                        </div>
                      )}
                    </SelectContentRoot>
                  </SelectRoot>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />{" "}
                    {d.field_priority}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Low", "Medium", "High", "Critical"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => form.setValue("priority", p as any)}
                        className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                          watchPriority === p
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-navy dark:hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <BarChart3 size={14} className="text-primary" />{" "}
                      {d.field_urgency}
                    </label>
                    <span className="text-lg font-black text-primary">
                      {watchUrgency}%
                    </span>
                  </div>
                  <SliderComponent
                    value={[watchUrgency]}
                    max={100}
                    step={1}
                    onValueChange={([val]) =>
                      form.setValue("urgencyScore", val)
                    }
                    className="py-4"
                  />
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              className="w-full py-8 shadow-glow-primary rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] gap-3 bg-primary text-white hover:brightness-110 active:scale-[0.98] transition-all border-none"
              disabled={form.formState.isSubmitting}
            >
              <Save size={18} /> {d.submit_dispatch || "Kirim Penugasan"}
            </Button>
          </div>
        </div>
      </form>

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
