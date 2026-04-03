"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import { FinancialRecord } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";
import { Plus, Wallet, Loader2, Search } from "lucide-react";

export default function PartnerFinanceModule() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <PartnerFinanceContent />
    </React.Suspense>
  );
}

function PartnerFinanceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const lang = searchParams.get("lang") || "id";
  const dict = useI18n();
  const d = dict?.portal || {};
  const router = useRouter();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data: any[] = []; // await getFinancialRecords(id as string);
        setRecords(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const stats = useMemo(() => {
    const totalAlloc = records.reduce((acc, curr) => acc + curr.allocation, 0);
    const totalReal = records.reduce((acc, curr) => acc + curr.realization, 0);
    const avgPercent = totalAlloc > 0 ? (totalReal / totalAlloc) * 100 : 0;
    return {
      totalAlloc,
      totalReal,
      avgPercent: avgPercent.toFixed(1),
    };
  }, [records]);

  const filtered = records.filter((r) =>
    r.programName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-navy dark:text-white tracking-tighter mb-2 uppercase">
            {d.budget_log_title || "Log Anggaran & Realisasi"}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {d.budget_transparency || "Transparansi Dana Pemulihan"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative group w-64">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict?.common?.search_placeholder || "Cari Program..."}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold outline-none ring-4 ring-transparent focus:ring-primary/10 transition-all placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <Button
            onClick={() =>
              router.push(`/${lang}/portal/partner/id/finance/new?id=${id}`)
            }
            className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <Plus size={18} /> {d.btn_input_realization || "Buat Anggaran"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary text-white rounded-[2rem] border-none shadow-xl shadow-primary/20">
          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
            {dict?.common?.total_allocation || "Total Alokasi"}
          </h4>
          <div className="text-3xl font-black">
            Rp{" "}
            {(stats.totalAlloc / 1000000).toLocaleString(
              lang === "en" ? "en-US" : "id-ID",
            )}{" "}
            Jt
          </div>
        </Card>
        <Card className="p-6 bg-white border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            {dict?.common?.realization_rate || "Realisasi Saat Ini"}
          </h4>
          <div className="text-3xl font-black text-navy">
            {stats.avgPercent}%
          </div>
        </Card>
        <Card className="p-6 bg-white border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/50">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            {d.audit_status || "Status Audit"}
          </h4>
          <div className="text-xl font-black text-emerald-500 uppercase">
            {d.status_clear || "Clear"}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest font-black text-slate-400">
              <th className="px-8 py-6">
                {dict?.financial?.table_program || "Nama Program"}
              </th>
              <th className="px-8 py-6">
                {dict?.financial?.table_allocation || "Alokasi"}
              </th>
              <th className="px-8 py-6">
                {dict?.financial?.table_realization || "Realisasi"}
              </th>
              <th className="px-8 py-6">
                {dict?.financial?.table_progress || "Progress"}
              </th>
              <th className="px-8 py-6">
                {dict?.financial?.table_action || "Update"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="size-8 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                    {dict?.common?.loading_transactions || "Memuat Transaksi..."}
                  </p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-20 text-center font-bold text-slate-400"
                >
                  {dict?.financial?.empty_data ||
                    "Belum ada rekaman finansial."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-navy dark:text-white text-sm">
                      {r.programName}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-2">
                      <Wallet size={10} /> ID: #{r.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-navy dark:text-white text-xs">
                    Rp{" "}
                    {(r.allocation / 1000000).toLocaleString(
                      lang === "en" ? "en-US" : "id-ID",
                    )}{" "}
                    {dict?.financial?.million || "Jt"}
                  </td>
                  <td className="px-8 py-6 font-bold text-primary text-xs">
                    Rp{" "}
                    {(r.realization / 1000000).toLocaleString(
                      lang === "en" ? "en-US" : "id-ID",
                    )}{" "}
                    {dict?.financial?.million || "Jt"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-20">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black dark:text-slate-300">
                        {r.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 underline font-bold text-slate-400 text-[10px] uppercase cursor-pointer hover:text-primary transition-colors">
                    {dict?.common?.detail || "Details"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
