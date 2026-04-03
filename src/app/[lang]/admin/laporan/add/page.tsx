"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ReportStatus } from "@/lib/types";
import { Card, Button } from "@/components/ui";
import {
  ArrowLeft,
  Send,
  MapPin,
  User,
  Phone,
  Fingerprint,
  LayoutGrid,
  FileText,
  Zap,
  Users,
  Building2,
  History,
  MapPinned,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Shield,
  Image as ImageIcon,
  Paperclip,
  X,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useI18n } from "@/app/[lang]/providers";
import { useUnifiedReports } from "@/hooks/useUnifiedReports";

const REGENCY_OPTIONS = [
  "Banda Aceh",
  "Aceh Besar",
  "Pidie",
  "Pidie Jaya",
  "Bireuen",
  "Lhokseumawe",
  "Aceh Utara",
  "Aceh Timur",
  "Langsa",
  "Aceh Tamiang",
  "Bener Meriah",
  "Aceh Tengah",
  "Gayo Lues",
  "Aceh Tenggara",
  "Aceh Jaya",
  "Aceh Barat",
  "Nagan Raya",
  "Aceh Barat Daya",
  "Aceh Selatan",
  "Subulussalam",
  "Aceh Singkil",
  "Simeulue",
];

const initialForm = {
  fullName: "",
  phone: "",
  nik: "",
  address: "",
  category: "",
  regency: REGENCY_OPTIONS[0],
  district: "",
  village: "",
  description: "",
  urgentSupplies: "",
  urgentServices: "",
  accessToLocation: "accessible",
  latitude: "",
  longitude: "",
  images: [] as File[],
  previewImages: [] as string[],
};

export default function ReportAddPage() {
  const dict = useI18n();
  const d = dict?.reports || {};
  const ar = dict?.admin_reports || {};
  const common = dict?.common || {};

  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "id";
  const qc = useQueryClient();
  const { topics } = useUnifiedReports(1, lang);

  const getLabel = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj["id"] || "";
  };

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({
    ...initialForm,
    category: topics?.[0]?.id || "",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const addReportMutation = useMutation({
    mutationFn: (newReport: any) => Promise.resolve(newReport),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reportAnswersData"] });
    },
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setForm((prev: any) => ({
        ...prev,
        images: [...prev.images, ...files],
        previewImages: [
          ...prev.previewImages,
          ...files.map((f) => URL.createObjectURL(f)),
        ],
      }));
    }
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

    try {
      // --- Upload Images to R2 first ---
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

      const newReport: any = {
        id: Date.now().toString(),
        title:
          form.description.slice(0, 35) +
          (form.description.length > 35 ? "..." : ""),
        description: form.description,
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
        reporterType: "admin",
        source: "rest",
        createdAt: new Date().toISOString(),
        images: uploadedUrls, // URL asli dari R2
        addendum: {
          additional_info: form.description,
          urgent_supplies: form.urgentSupplies,
          urgent_services: form.urgentServices,
          access_to_location: form.accessToLocation,
          attachment: {
            images: uploadedUrls,
          },
        },
      };

      addReportMutation.mutate(newReport);
      alert(common?.success || "Laporan berhasil dikirim!");
      setStep(1);
      setForm({ ...initialForm, category: topics?.[0]?.id || "" });
      router.push(`/${lang}/admin/laporan`);
    } catch (err) {
      console.error(err);
      alert(d.alert_fail || "Gagal mengirim laporan. Coba lagi nanti.");
    }
  };

  const STEP_LABELS = [
    d.step_1 || "Identitas",
    d.step_2 || "Detail",
    d.step_3 || "Lokasi",
    d.step_4 || "Lampiran",
    d.step_5 || "Konfirmasi",
  ];

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-navy dark:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tight uppercase">
              {ar.title_main || "Buat"}{" "}
              <span className="text-primary italic">
                {ar.new_report || "Laporan."}
              </span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Globe size={14} className="text-primary" />{" "}
              {ar.add_subtitle || "Input Laporan Manual dari Admin"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} />{" "}
            {common.verify_source || "Source Verified"}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> Admin Input
          </div>
        </div>
      </div>

      {/* --- STEP INDICATOR --- */}
      <div className="flex justify-between items-center px-2 md:px-8">
        {STEP_LABELS.map((label, i) => {
          const s = i + 1;
          return (
            <div key={s} className="flex flex-col items-center gap-2 relative">
              <div
                className={cn(
                  "size-10 md:size-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500",
                  step === s
                    ? "bg-primary text-white shadow-glow-primary scale-110"
                    : step > s
                    ? "bg-primary/20 text-primary"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600",
                )}
              >
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              <span
                className={cn(
                  "text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden sm:block",
                  step === s
                    ? "text-primary"
                    : "text-slate-400 dark:text-slate-500",
                )}
              >
                {label}
              </span>
              {s < 5 && (
                <div className="absolute top-5 md:top-6 -right-[60px] md:-right-[80px] w-[50px] md:w-[70px] h-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: step > s ? "100%" : 0 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- FORM CARD --- */}
      <Card className="!p-6 md:!p-16 border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border-t-8 border-primary overflow-hidden">
        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1 — Identitas Pelapor */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex flex-col gap-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput
                    icon={<User size={16} className="text-primary" />}
                    label={d.form_placeholder_name || "Nama Lengkap"}
                    value={form.fullName}
                    onChange={(v) => setForm({ ...form, fullName: v })}
                    placeholder={d.form_placeholder_name || "Nama lengkap"}
                    required
                  />
                  <FormInput
                    icon={<Fingerprint size={16} className="text-primary" />}
                    label={d.form_label_nik || "NIK"}
                    value={form.nik}
                    onChange={(v) => setForm({ ...form, nik: v })}
                    placeholder={d.form_placeholder_nik || "16 digit NIK"}
                    maxLength={16}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput
                    icon={<Phone size={16} className="text-primary" />}
                    label={d.form_label_phone || "No. Telepon"}
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="08..."
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2 — Detail Laporan */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex flex-col gap-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3.5">
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                      <LayoutGrid size={16} className="text-primary" />{" "}
                      {d.category_label || "Pilih Kategori"}
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-inner dark:text-white outline-none"
                    >
                      {topics?.map((topic: any) => (
                        <option
                          key={topic.id}
                          value={topic.id}
                          className="dark:bg-slate-800"
                        >
                          {getLabel(topic.name || topic.title || topic.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                      <History size={16} className="text-primary" />{" "}
                      {d.form_label_access || "Akses ke Lokasi"}
                    </label>
                    <select
                      value={form.accessToLocation}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accessToLocation: e.target.value,
                        })
                      }
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-inner dark:text-white outline-none"
                    >
                      {Object.entries(d.access_options || {}).map(
                        ([key, label]) => (
                          <option
                            key={key}
                            value={key}
                            className="dark:bg-slate-800"
                          >
                            {label as string}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5">
                  <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
                    <FileText size={16} className="text-primary" />{" "}
                    {d.form_label_desc || "Deskripsi Masalah"}
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-inner min-h-[120px] dark:text-white dark:placeholder:text-slate-500 outline-none"
                    placeholder={
                      d.form_placeholder_desc || "Jelaskan masalah..."
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput
                    icon={<Zap size={16} className="text-primary" />}
                    label={d.form_label_urgent_supplies || "Kebutuhan Mendesak"}
                    value={form.urgentSupplies}
                    onChange={(v) => setForm({ ...form, urgentSupplies: v })}
                    placeholder={
                      d.form_placeholder_urgent_supplies ||
                      "Makanan, selimut, dll"
                    }
                  />
                  <FormInput
                    icon={<Users size={16} className="text-primary" />}
                    label={d.form_label_urgent_services || "Layanan Mendesak"}
                    value={form.urgentServices}
                    onChange={(v) => setForm({ ...form, urgentServices: v })}
                    placeholder={
                      d.form_placeholder_urgent_services ||
                      "Evakuasi, medis, dll"
                    }
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3 — Lokasi */}
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
                      <Building2 size={16} className="text-primary" />{" "}
                      {d.form_label_region || "Kabupaten/Kota"}
                    </label>
                    <select
                      value={form.regency}
                      onChange={(e) =>
                        setForm({ ...form, regency: e.target.value })
                      }
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-inner dark:text-white outline-none"
                    >
                      {REGENCY_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className="dark:bg-slate-800"
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FormInput
                    label={d.form_label_district || "Kecamatan"}
                    value={form.district}
                    onChange={(v) => setForm({ ...form, district: v })}
                    placeholder={d.form_placeholder_district || "Kecamatan"}
                  />
                  <FormInput
                    label={d.form_label_village || "Desa/Kelurahan"}
                    value={form.village}
                    onChange={(v) => setForm({ ...form, village: v })}
                    placeholder={d.form_placeholder_village || "Desa/Kelurahan"}
                  />
                </div>

                <FormInput
                  icon={<MapPin size={16} className="text-primary" />}
                  label={d.form_label_address || "Detail Alamat"}
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="Nama jalan, nomor rumah, atau patokan..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                        {d.form_label_latitude || "Latitude"}
                      </label>
                      <input
                        value={form.latitude}
                        readOnly
                        className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono font-bold dark:text-primary outline-none"
                        placeholder="0.0000"
                      />
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                        {d.form_label_longitude || "Longitude"}
                      </label>
                      <input
                        value={form.longitude}
                        readOnly
                        className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono font-bold dark:text-primary outline-none"
                        placeholder="0.0000"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    className="rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all bg-primary text-white"
                  >
                    <MapPinned size={18} className="mr-2" />
                    {d.form_button_get_location || "Gunakan Lokasi Saat Ini"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4 — Lampiran Foto */}
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
                    <ImageIcon size={16} className="text-primary" />{" "}
                    {d.form_label_images || "Foto Bukti"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {form.previewImages.map((src: string, i: number) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                      >
                        <Image
                          src={src}
                          alt={`Preview ${i}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-xl flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all text-slate-400 hover:text-primary group">
                      <Paperclip
                        size={24}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {d.form_button_add_image || "Tambah Foto"}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center italic">
                    {d.form_images_hint ||
                      "Upload foto sebagai bukti pendukung laporan."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5 — Konfirmasi */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                className="flex flex-col gap-10"
              >
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-3xl p-8 space-y-8">
                  <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle size={20} />{" "}
                    {d.confirm_title || "Konfirmasi Data"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {d.confirm_identity || "Identitas Pelapor"}
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
                        {d.confirm_location || "Lokasi Kejadian"}
                      </p>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-navy dark:text-white uppercase">
                          {form.village}, {form.district}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {form.regency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary/20 dark:border-primary/30">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                      {d.confirm_content || "Isi Laporan"}
                    </p>
                    <p className="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-300">
                      &ldquo;{form.description}&rdquo;
                    </p>
                  </div>

                  {form.previewImages.length > 0 && (
                    <div className="pt-6 border-t border-primary/20 dark:border-primary/30">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                        Lampiran ({form.previewImages.length} foto)
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {form.previewImages.map((src: string, i: number) => (
                          <div
                            key={i}
                            className="size-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800"
                          >
                            <Image
                              src={src}
                              alt={`thumb-${i}`}
                              width={80}
                              height={80}
                              unoptimized
                              className="object-cover size-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 p-5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 rounded-2xl">
                  <Shield size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-normal">
                    {d.confirm_disclaimer ||
                      "Data yang Anda kirim akan diverifikasi oleh sistem. Pastikan semua informasi benar dan akurat."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 dark:border-slate-800/50 mt-10">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 rounded-2xl h-16 font-black uppercase text-xs tracking-widest border-slate-200 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {d.button_back || "Kembali"}
              </Button>
            )}
            <Button
              type="submit"
              className="flex-[2] rounded-2xl h-16 font-black uppercase text-xs tracking-widest shadow-glow-primary hover:scale-[1.02] active:scale-95 transition-all bg-primary text-white gap-3"
              disabled={addReportMutation.isPending}
            >
              {step === 5 ? (
                <>
                  <Send size={18} />{" "}
                  {addReportMutation.isPending
                    ? "Mengirim..."
                    : d.button_submit || "Kirim Laporan"}
                </>
              ) : (
                <>
                  <ChevronRight size={18} /> {d.button_next || "Lanjut"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/** Reusable Form Input Component */
function FormInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest opacity-70 dark:text-slate-300">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-inner dark:text-white dark:placeholder:text-slate-500 outline-none"
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
    </div>
  );
}
