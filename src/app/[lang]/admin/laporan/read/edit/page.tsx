"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { ReportStatus } from "@/lib/types";
import { Card, Button } from "@/components/ui";
import { adminReplySchema } from "@/lib/validations";

export default function ReportEditPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          Menyiapkan Form Laporan...
        </div>
      }
    >
      <ReportEditContent />
    </React.Suspense>
  );
}

function ReportEditContent() {
  const router = useRouter();

  const [status, setStatus] = useState(ReportStatus.PENDING);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = adminReplySchema.safeParse({
      status,
      replyContent,
    });

    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }

    // Implementation for update logic goes here
    console.log("Submit valid data:", { status, replyContent });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 font-display">
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.back()}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white uppercase tracking-tighter">
            Manajemen <span className="text-primary italic">Laporan.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Update Status & Berikan Respon Operasional
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <Card className="p-10 border-none rounded-[3rem] shadow-3xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
              Status Progres
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReportStatus)}
              className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl font-bold text-sm outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all"
            >
              <option value={ReportStatus.PENDING}>Menunggu (Pending)</option>
              <option value={ReportStatus.PROCESS}>Diproses (Under Review)</option>
              <option value={ReportStatus.DONE}>Selesai (Resolved)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
              Respon / Balasan Admin
            </label>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full min-h-[200px] p-6 bg-slate-50 dark:bg-slate-900/50 border-none rounded-[2rem] font-medium text-sm outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all leading-relaxed placeholder:text-slate-400"
              placeholder="Berikan instruksi atau update resmi untuk laporan ini..."
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-10 h-16 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-3 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
          >
            <Save size={20} /> Update Status Operasional
          </Button>
        </div>
      </form>
    </div>
  );
}
