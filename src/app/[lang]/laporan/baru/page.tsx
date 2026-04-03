"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";
import { Report, ReportStatus } from "@/lib/types";
import { useI18n } from "@/app/[lang]/providers";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Loader2, Navigation } from "lucide-react";

function LaporanBaruContent() {
  const dict = useI18n();
  const d = dict?.report_new || {};
  const dr = dict?.reports || {};

  const searchParams = useSearchParams();
  const router = useRouter();
  const program = searchParams.get("program");
  const instansi = searchParams.get("instansi");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    regency: "Banda Aceh",
    reporterName: "",
    contactPhone: "",
  });

  const { coords, loading: locLoading, getCurrentLocation } = useGeolocation();

  const handleLocateMe = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setFormData((prev) => ({
        ...prev,
        location: `${prev.location} (Lat: ${loc.latitude.toFixed(
          4,
        )}, Lng: ${loc.longitude.toFixed(4)})`.trim(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      regency: formData.regency,
      reporterName: formData.reporterName,
      contactPhone: formData.contactPhone,
      latitude: coords?.latitude.toString() || "",
      longitude: coords?.longitude.toString() || "",
      timeAgo: dr.time_just_now || "Baru saja",
      status: ReportStatus.PENDING,
      category: program || instansi || "Laporan Umum",
      source: "mobile",
      reporterType: instansi ? "partner" : "masyarakat",
      createdAt: new Date().toISOString(),
    };

    try {
      // await addReport(newReport); // Stubbed
      console.log("Mock report created:", newReport);
      setIsSuccess(true);
      setTimeout(() => router.push(`/${dict?.lang || "id"}`), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="size-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-navy dark:text-white mb-2">
          {d.success_title || "Laporan Terkirim!"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {d.success_desc ||
            "Terima kasih atas kontribusi Anda. Laporan akan segera ditindaklanjuti."}
        </p>
        <p className="text-xs text-slate-400 mt-8">
          {d.redirect || "Mengarahkan kembali ke beranda..."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-navy dark:text-white mb-4">
          {program || instansi
            ? dict?.lang === "en"
              ? "Let's participate in your regional development"
              : "Ayo berpartisipasi dalam pembangunan daerah anda"
            : d.title || "Kirim Laporan Baru"}
        </h1>
        {program && (
          <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
            Program: {program}
          </span>
        )}
        {instansi && (
          <span className="inline-block bg-accent/10 text-accent font-bold px-4 py-2 rounded-full text-sm">
            Instansi: {instansi}
          </span>
        )}
      </div>

      <Card className="p-8 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-navy dark:text-slate-300 ml-2">
              {d.label_what || "Apa yang ingin Anda laporkan?"}
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all overflow-hidden"
                placeholder={d.placeholder_title || "Judul laporan singkat..."}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-navy dark:text-slate-300 ml-2">
              {d.label_detail || "Detail Kejadian/Kendala"}
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
              placeholder={
                d.placeholder_detail ||
                "Ceritakan detail kendala yang Anda temukan..."
              }
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-navy dark:text-slate-300 ml-2">
                {dr.form_label_address || "Lokasi Spesifik"}
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder={
                    dr.form_placeholder_address || "Nama jalan / area..."
                  }
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locLoading}
                  className="absolute right-3 top-2 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  title="Gunakan Lokasi Saat Ini"
                >
                  {locLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Navigation size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-navy dark:text-slate-300 ml-2">
                {dr.form_label_identity || "Nama Pelapor"}
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder={
                    dr.form_placeholder_name || "Nama lengkap Anda..."
                  }
                  value={formData.reporterName}
                  onChange={(e) =>
                    setFormData({ ...formData, reporterName: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-navy dark:text-slate-300 ml-2">
              {dr.form_label_phone || "Nomor Telepon/WA"}
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                required
                type="tel"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="0812xxxx"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-navy text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-navy/20 transition-all disabled:opacity-50 mt-4 group"
          >
            {isSubmitting ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {dr.form_button_submit || "Kirim Laporan"}
                <AlertCircle
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default function LaporanBaruPage() {
  const dict = useI18n();
  const d = dict?.report_new || {};

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-bold">
          {d.loading || "Memuat Form..."}
        </div>
      }
    >
      <LaporanBaruContent />
    </Suspense>
  );
}
