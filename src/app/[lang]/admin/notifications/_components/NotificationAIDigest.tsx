"use client";

import React from "react";
import { Zap, CreditCard, FileText } from "lucide-react";
import { Card, Button } from "@/components/ui";

interface NotificationAIDigestProps {
  n: any;
  dict: any;
  unreadCount: number;
  efficiency: number;
  paymentCount: number;
  reportCount: number;
  onTakeAction: () => void;
}

export const NotificationAIDigest = ({
  n,
  dict,
  unreadCount,
  efficiency,
  paymentCount,
  reportCount,
  onTakeAction,
}: NotificationAIDigestProps) => {
  const cats = dict?.notification?.categories || {};
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2 p-6 sm:p-8 bg-primary/5 border-primary/10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <Zap size={140} className="text-primary fill-primary" />
        </div>
        
        <div className="relative z-10 space-y-6 sm:space-y-4 font-display">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
            <Zap size={14} className="fill-primary" /> {n.status_current || "SITUASI TERKINI"}
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-navy dark:text-white tracking-tighter uppercase leading-tight max-w-xl">
            {dict?.common?.there_is || "ADA"}{" "}
            <span className="text-primary italic">
              {unreadCount} {dict?.common?.notification || "NOTIFIKASI"}
            </span>{" "}
            {n.status_desc || "BARU YANG BUTUH ATENSI CEPAT ANDA HARI INI."}
          </h2>
          
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white dark:border-white/5 shadow-sm">
              <CreditCard size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                {paymentCount} {cats.payment || "ALOKASI DANA"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white dark:border-white/5 shadow-sm">
              <FileText size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                {reportCount} {cats.report || "LAPORAN"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-navy dark:bg-slate-900 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group font-display border-none">
        <div className="absolute -bottom-10 -right-10 size-40 bg-primary/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
            {n.efficiency_title || "EFISIENSI RESPON"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-white tracking-tighter">{efficiency}</span>
            <span className="text-primary italic text-3xl font-black">%</span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-4 leading-relaxed uppercase tracking-wider">
            {unreadCount > 0
              ? (n.efficiency_pending || `MASIH ADA ${unreadCount} LAPORAN PENDING YANG BUTUH RESPON SEGERA.`).replace("{count}", unreadCount.toString())
              : n.efficiency_clear || "SEMUA LAPORAN TELAH TERTANGANI DENGAN BAIK. KERJA BAGUS!"}
          </p>
        </div>
        
        <Button
          onClick={onTakeAction}
          className="relative z-10 w-full mt-8 bg-white hover:bg-slate-100 text-navy font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl border-none shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
        >
          {unreadCount > 0 ? n.take_action || "TANGANI SEGERA" : n.check_history || "CEK RIWAYAT"}
        </Button>
      </Card>
    </div>
  );
};
