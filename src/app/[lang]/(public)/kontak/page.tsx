"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
} from "lucide-react";
import { Button, Input, Label, Card } from "@/components/ui";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

import { contactSchema } from "@/lib/validations";

export default function ContactPage() {
  const dict = useI18n();
  const d = dict?.contact || {};
  const dr = dict?.reports || {};
  const common = dict?.common || {};

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = contactSchema.safeParse({
      fullName: form.fullName,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    logActivity(
      "CONTACT_FORM_SUBMITTED",
      "PUBLIC",
      "Citizen submitted a contact/inquiry form.",
    );
    addNotification({
      title: "Inkuiri Publik Baru",
      description:
        "Seseorang telah mengirim pesan melalui formulir kontak publik.",
      type: "system",
      priority: "medium",
      actionLabel: "Lihat Kotak Masuk",
      link: "/admin/notifications",
    });
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="text-primary-500" />,
      label: "Email",
      value: "admin.pemulihanaceh@gmail.com",
    },
    {
      icon: <Phone className="text-accent-500" />,
      label: "Telepon",
      value: "+62 (651) 123456",
    },
    {
      icon: <MapPin className="text-rose-500" />,
      label: d.office_hq || "Kantor Pusat",
      value: "Jl. Teuku Nyak Arief No. 219",
      sub: "Banda Aceh, Aceh 23231",
    },
  ];

  return (
    <div className="flex flex-col gap-20 py-10">
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full">
            {d.sub || "Hubungi Kami"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-navy dark:text-white mt-6 uppercase tracking-tight">
            {d.title_1 || "Ada Pertanyaan?"} <br />
            <span className="neon-gradient-text">
              {d.title_gradient || "Kami Siap Membantu."}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base mt-6">
            {d.description ||
              "Punya kendala infrastruktur atau butuh bantuan teknis? Tim kami siaga 24/7 untuk memastikan pemulihan Aceh berjalan lancar."}
          </p>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                glass
                className="p-6 flex items-start gap-4 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="size-12 rounded-2xl bg-white/50 dark:bg-slate-800/80 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {item.label}
                  </h3>
                  <p className="font-bold text-navy dark:text-white uppercase">
                    {item.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}

          <Card glass className="p-8 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Globe size={120} className="animate-spin-slow" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-primary-500" size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs dark:text-white">
                {d.hours_title || "Jam Operasional"}
              </h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  {common.mon_thu || "Senin - Kamis"}
                </span>
                <span className="font-black dark:text-white">
                  08:00 - 16:30
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  {common.friday || "Jumat"}
                </span>
                <span className="font-black dark:text-white">
                  08:00 - 12:00
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  {common.sat_sun || "Sabtu - Minggu"}
                </span>
                <span className="font-black text-rose-500">
                  {common.closed || "TUTUP"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card glass className="p-8 md:p-12 relative overflow-hidden">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 gap-6"
              >
                <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-glow">
                  <Send size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight">
                    {d.success_title || "Pesan Terkirim!"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {d.success_desc ||
                      "Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 uppercase tracking-widest font-black text-xs"
                >
                  {d.button_another || "Kirim Pesan Lain"}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <MessageSquare className="text-primary-500" />
                    {d.form_title || "Kirim Pesan"}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    {d.form_desc ||
                      "Beritahu kami apa yang bisa kami bantu hari ini."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{dr.form_placeholder_name || "Nama Lengkap"}</Label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({...form, fullName: e.target.value})}
                      placeholder={dr.form_placeholder_name || "Nama Lengkap"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{d.label_email || "Alamat Email"}</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder={d.placeholder_email || "nama@email.com"}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{d.label_subject || "Subjek"}</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    placeholder={d.placeholder_subject || "Tuliskan subjek..."}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{dr.form_label_desc || "Pesan"}</Label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="flex min-h-[160px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all"
                    placeholder={d.placeholder_message || "Tuliskan pesan..."}
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 uppercase tracking-widest font-black text-sm"
                  loading={loading}
                  icon={!loading && <Send size={20} />}
                >
                  {d.button_send || "KIRIM PESAN SEKARANG"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
