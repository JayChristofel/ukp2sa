"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

interface NotificationHeaderProps {
  n: any;
  dict: any;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationHeader = ({
  n,
  dict,
  onMarkAllRead,
  onClearAll,
}: NotificationHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform font-display"
        >
          <ChevronLeft size={16} /> {dict?.common?.back || "Kembali"}
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white mb-2 tracking-tighter uppercase font-display">
          {n.title_main || "Pusat"}{" "}
          <span className="text-primary italic">
            {n.title_sub || "Notifikasi."}
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none font-display">
            {n.subtitle || "Manajemen Log & Notifikasi Sistem Nasional"}
          </p>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-glow-emerald/20 font-display">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            WebSocket: {n.ws_connected || "Connected"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 font-display">
        <Button
          variant="outline"
          className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-slate-200 dark:border-slate-800"
          onClick={onMarkAllRead}
        >
          <CheckCheck size={16} className="mr-2" />{" "}
          {n.mark_all_read || "Tandai Semua Dibaca"}
        </Button>
        <Button
          variant="danger"
          className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-none transition-all active:scale-90"
          onClick={onClearAll}
        >
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
};
