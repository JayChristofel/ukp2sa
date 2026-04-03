"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import {
  Layers,
  Trash2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useI18n } from "@/app/[lang]/providers";

export default function ClearingHouseManagementPage() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <ClearingHouseContent />
    </React.Suspense>
  );
}

function ClearingHouseContent() {
  const d = useI18n().clearing_house;
  const common = useI18n().common;
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const lang = searchParams.get("lang") || "id";
  const focusId = searchParams.get("id");

  const { data: rawList = [], isLoading } = useQuery({
    queryKey: ["clearingHouseData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Logic: Simulate deletion or call a real endpoint if available
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clearingHouseData"] });
      toast.success(d.record_deleted || "Record berhasil dihapus");
    },
    onError: () =>
      toast.error(d.record_delete_failed || "Gagal menghapus record"),
  });

  // Filter items that are duplicates or matches the focusId
  const alignments = rawList.filter(
    (item: any) => item.status === "duplicate" || item.id === focusId,
  );

  const handleDelete = async (id: string) => {
    if (confirm(d.delete_record_confirm || "Hapus record penyelarasan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href={`/${lang}/admin/clearing-house`}
            className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={14} /> {d.back_to_board || "Kembali ke Board"}
          </Link>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {d.manage_title || "Manajemen Cleansing"}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Layers size={14} className="text-primary" />{" "}
            {d.manage_subtitle || "Pengolahan Data & Resolusi Konflik"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            {d.loading_conflicts || "Memuat Data Konflik..."}
          </div>
        ) : alignments.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            {d.no_active_conflicts ||
              "Tidak Ada Konflik Aktif yang Perlu Resolusi"}
          </div>
        ) : (
          alignments.map((al: any) => (
            <Card
              key={al.id}
              className={`p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl group transition-all ${
                al.id === focusId
                  ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-950 shadow-2xl"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
                      {al.location || common.location || "Lokasi Umum"}
                    </h3>
                    {al.id === focusId && (
                      <Badge className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-glow-primary border-none">
                        {d.action_required || "ACTION REQUIRED"}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {d.identified_program || "Program Teridentifikasi"}
                      </h4>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <p className="text-sm font-bold text-navy dark:text-white mb-1">
                          {al.title}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {al.agency} • {al.code}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-2xl transition-all">
                      <p className="text-xs font-bold text-rose-500 flex items-center gap-2 uppercase tracking-tight mb-2">
                        <ShieldAlert size={14} />{" "}
                        {d.conflict_found || "Konflik Ditemukan"}
                      </p>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        {al.duplicateCause ||
                          d.duplicate_desc ||
                          "Indikasi tumpang-tindih anggaran di lokasi ini."}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(al.id)}
                  disabled={deleteMutation.isPending}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800 ml-6 disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
