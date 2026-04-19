"use client";

import React from "react";
import { 
  Building2, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  ShieldAlert 
} from "lucide-react";
import { Card, Button, Switch } from "@/components/ui";

interface NotificationSettingsProps {
  n: any;
  dict: any;
}

export const NotificationSettings = ({ n, dict }: NotificationSettingsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-display">
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Building2 size={80} />
          </div>
          <div className="relative z-10 space-y-6">
            <div>
              <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter mb-4">
                Identity <span className="text-primary italic">Link.</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Verified WhatsApp
                  </p>
                  <p className="text-sm font-bold text-navy dark:text-white">
                    +62 812-****-5542
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Official Email
                  </p>
                  <p className="text-sm font-bold text-navy dark:text-white">
                    admin.utama@ukp2sa.go.id
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-black text-navy dark:text-white uppercase">
                    {n.notif_system_label || "Sistem Notifikasi"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    {n.master_switch || "Master Switch All Channels"}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg bg-navy dark:bg-slate-950 text-white overflow-hidden relative group">
          <div className="relative z-10 space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary">
              {n.system_behavior || "System Behavior"}
            </h4>
            <div className="space-y-4">
              {[
                { label: n.sound_effects || "Sound Effects", key: "sound" },
                { label: n.browser_push || "Browser Push", key: "push" },
                { label: n.toast_duration || "Toast Duration (Long)", key: "toast" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-tight opacity-70">
                    {item.label}
                  </span>
                  <Switch defaultChecked={item.key !== "push"} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg space-y-6 bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MessageSquare size={100} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
                  WA <span className="text-emerald-500 italic">Broadcast.</span>
                </h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {n.wa_broadcast_desc || "Alert Real-time kriteria prioritas tinggi."}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Laporan Warga (Urgent)", sub: "Notifikasi instan untuk status High Priority" },
                { label: "Pembayaran Berhasil", sub: "Konfirmasi dana masuk" },
                { label: "Alert Pembayaran Gagal", sub: "Peringatan transaksi expired atau ditolak" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase text-navy dark:text-white">{item.label}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase">{item.sub}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg space-y-6 bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Mail size={100} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
                  Email <span className="text-blue-500 italic">Digest.</span>
                </h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {n.email_digest_desc || "Ringkasan berkala & dokumen resmi."}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Laporan Mingguan", sub: "Statistik respon & efisiensi admin" },
                { label: "Official Invoices", sub: "Bukti potong & nota bayar" },
                { label: "Log Keuangan Bulanan", sub: "Rekapitulasi alokasi dana nasional" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase text-navy dark:text-white">{item.label}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase">{item.sub}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-navy dark:text-white uppercase">{n.auto_archive || "Auto-Archive Logs"}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase leading-relaxed max-w-lg">
                {n.auto_archive_desc || "Sistem akan menghapus log yang berumur lebih dari 30 hari secara otomatis untuk efisiensi database."}
              </p>
            </div>
          </div>
          <Button className="w-full md:w-auto h-12 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest bg-navy hover:bg-black text-white shadow-lg border-none">
            {dict?.common?.save_configs || "Simpan Semua Konfigurasi"}
          </Button>
        </div>
      </div>
    </div>
  );
};
