"use client";

import React, { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  Send,
  ShieldCheck,
  UploadCloud,
  Building2,
  Users,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";

import { donorProjectSchema } from "@/lib/validations";

export default function DonorRegistrationPage() {
  const dict = useI18n();
  const dr = dict?.partner_registration || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    institutionName: "",
    partnerType: "International NGO",
    programName: "",
    allocation: 0,
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = donorProjectSchema.safeParse({
      name: form.programName,
      partnerId: form.institutionName, // Using name as ID for placeholder
      allocation: Number(form.allocation),
      realization: 0,
      location: form.location,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        dr.registration_success || "Registrasi Program Berhasil Dikirim!",
      );
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-navy dark:text-white mb-2 tracking-tight uppercase">
          {dr.title_main || "Registrasi Program"}{" "}
          <span className="text-primary italic">
            {dr.title_sub || "Mitra."}
          </span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />{" "}
          {dr.subtitle || "Clearing House & Integration System"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 text-primary">
            <Building2 size={160} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
                  {dr.institution_identity || "Identitas Lembaga"}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {dr.identity_subtitle || "Detail Partner & Penanggung Jawab"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{dr.institution_name_label || "Nama Lembaga/NGO"}</Label>
                <Input
                  value={form.institutionName}
                  onChange={(e) => setForm({...form, institutionName: e.target.value})}
                  placeholder={
                    dr.institution_name_placeholder ||
                    "Contoh: Red Cross International"
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{dr.partner_type_label || "Tipe Partner"}</Label>
                <select 
                  value={form.partnerType}
                  onChange={(e) => setForm({...form, partnerType: e.target.value})}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option>
                    {dr.partner_type_intl_ngo || "International NGO"}
                  </option>
                  <option>
                    {dr.partner_type_national_philanthropy ||
                      "Lembaga Filantropi Nasional"}
                  </option>
                  <option>{dr.partner_type_csr_bumn || "BUMN/CSR"}</option>
                  <option>
                    {dr.partner_type_religious || "Organisasi Keagamaan"}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl bg-white dark:bg-slate-900">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
                  {dr.recovery_program_details || "Detail Program Recovery"}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {dr.program_subtitle || "Rencana Kerja & Alokasi Anggaran"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{dr.program_name_label || "Nama Program"}</Label>
              <Input
                value={form.programName}
                onChange={(e) => setForm({...form, programName: e.target.value})}
                placeholder={
                  dr.program_name_placeholder ||
                  "Contoh: Pembangunan Hunian Tetap Tahap II"
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  {dr.total_fund_commitment_label || "Total Komitmen Dana"} (
                  {lang === "en" ? "USD" : "IDR"})
                </Label>
                <Input
                  type="number"
                  value={form.allocation}
                  onChange={(e) => setForm({...form, allocation: Number(e.target.value)})}
                  placeholder={lang === "en" ? "15.000" : "2.500.000.000"}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {dr.focus_location_label || "Lokasi Fokus (Kecamatan)"}
                </Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  placeholder={
                    dr.focus_location_placeholder || "Meureudu, Pidie Jaya"
                  }
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Label>
                {dr.upload_proposal_label ||
                  "Upload Proposal/Rencana Kerja (.pdf)"}
              </Label>
              <div className="mt-2 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <UploadCloud
                  size={48}
                  className="mb-4 group-hover:scale-110 transition-transform"
                />
                <p className="text-sm font-bold">
                  {dr.upload_drag_drop ||
                    "Drag & drop file di sini atau klik untuk cari"}
                </p>
                <p className="text-[10px] uppercase font-black tracking-widest mt-2 opacity-50">
                  {dr.upload_max_size || "Maks. 10MB"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full md:w-auto px-12 h-14 rounded-[2rem] text-xs uppercase tracking-[0.2em] font-black group"
          >
            {dr.submit_button || "Kirim Registrasi"}{" "}
            <Send
              size={16}
              className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Button>
        </div>
      </form>
    </div>
  );
}
