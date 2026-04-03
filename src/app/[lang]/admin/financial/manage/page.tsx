"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Card, Button } from "@/components/ui";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Wallet,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

function FinancialManagementContent() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const params = useParams();
  const dict = useI18n();
  const f = dict?.financial || {};
  const c = dict?.common || {};
  const router = useRouter();
  const lang = (params?.lang as string) || "id";
  const partnerIdParam = searchParams.get("partnerId");
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "FINANCIAL_MANAGE_VIEW",
      "FINANCIAL",
      `User accessed financial management for partner: ${
        partnerIdParam || "All"
      }`,
    );
  }, [logActivity, partnerIdParam]);

  const records: any = []; // Placeholder for real records logic
  const isLoading: any = false; // Placeholder for loading state

  const deleteRecordMutation: any = {
    mutate: (id: string, cb: any) => {
      cb.onSuccess();
    },
    isPending: false,
  };

  const handleDelete = async (id: string) => {
    if (confirm(c.confirm_delete || "Hapus data ini?")) {
      deleteRecordMutation.mutate(id, {
        onSuccess: () => {
          toast.success(c.delete_success || "Data berhasil dihapus");
          logActivity(
            "FINANCIAL_RECORD_DELETED",
            "FINANCIAL",
            `Deleted financial record: ${id}`,
          );
          addNotification({
            title: "Record Finansial Dihapus",
            description: `Satu entri anggaran (ID: ${id}) telah dihapus dari sistem.`,
            type: "payment",
            priority: "high",
          });
        },
        onError: () => toast.error(c.delete_failed || "Gagal menghapus data"),
      });
    }
  };

  const filteredRecords = records.filter((r: any) =>
    r.programName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-20 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 md:pb-0">
        <div>
          <button
            onClick={() => router.push(`/${lang}/admin/financial/progress`)}
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} />{" "}
            {c.back_to_progress || "Kembali ke Progress"}
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {f.manage_title || "Kelola Finansial"}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-widest flex items-center gap-2 leading-relaxed">
            <Wallet size={14} className="text-primary shrink-0" />{" "}
            {f.manage_desc || "Management Data Anggaran & Realisasi"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder={c.search_placeholder || "Cari Program..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <Button
            onClick={() => router.push(`/${lang}/admin/financial/input`)}
            className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-glow-primary"
          >
            <Plus size={18} className="mr-2" />{" "}
            {f.add_record || "Tambah Record"}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                <th className="px-8 py-6">{f.table_program || "Program"}</th>
                <th className="px-8 py-6">{f.table_allocation || "Alokasi"}</th>
                <th className="px-8 py-6">
                  {f.table_realization || "Realisasi"}
                </th>
                <th className="px-8 py-6">{f.table_progress || "Progress"}</th>
                <th className="px-8 py-6">{f.table_status || "Status"}</th>
                <th className="px-8 py-6 text-right">
                  {f.table_action || "Aksi"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {c.loading || "Loading records..."}
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {f.empty_data || "Belum ada data finansial."}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r: any) => (
                  <tr
                    key={r.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="font-black text-navy dark:text-white text-sm">
                        {r.programName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                        ID: {r.id}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-navy dark:text-white">
                      Rp{" "}
                      {(r.allocation / 1000000).toLocaleString(
                        lang === "id" ? "id-ID" : "en-US",
                      )}{" "}
                      {f.million || "Jt"}
                    </td>
                    <td className="px-8 py-6 font-bold text-navy dark:text-white">
                      Rp{" "}
                      {(r.realization / 1000000).toLocaleString(
                        lang === "id" ? "id-ID" : "en-US",
                      )}{" "}
                      {f.million || "Jt"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${r.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-navy dark:text-white">
                          {r.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          r.status === "Final"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
          <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
              {f.sync_status || "Data Synchronized"}
            </h4>
            <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-bold uppercase opacity-70">
              {f.sync_desc ||
                "Data finansial tersinkronisasi secara real-time dengan server UKP2SA."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialManagementPage() {
  const dict = useI18n();
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase text-xs tracking-widest">
          {dict?.common?.loading || "Loading..."}
        </div>
      }
    >
      <FinancialManagementContent />
    </Suspense>
  );
}
