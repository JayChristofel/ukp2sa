"use client";

import React, { useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { Loader2 } from "lucide-react";
import { PARTNERS_DATA } from "@/lib/constants";

// Modular Components
import { FinancialHeader } from "./_components/FinancialHeader";
import { FinancialStats } from "./_components/FinancialStats";
import { SourceCompositionChart } from "./_components/SourceCompositionChart";
import { AbsorptionList } from "./_components/AbsorptionList";

function FinancialProgressContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const dict = useI18n();
  const f = dict?.financial || {};
  const router = useRouter();
  const lang = params.lang as string;
  const partnerIdParam = searchParams.get("partnerId");
  const { logActivity } = useAuditLogger();

  const { data: ngoData = [], isLoading: isLoadingNgo } = useQuery({
    queryKey: ["ngoData"],
    queryFn: () => apiService.getNgo(1),
    staleTime: 30000,
  });

  const { data: clearingHouseData = [], isLoading: isLoadingCH } = useQuery({
    queryKey: ["clearingHouseData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000,
  });

  const isLoading = isLoadingNgo || isLoadingCH;

  const partnerName = partnerIdParam
    ? PARTNERS_DATA.find((x) => x.id === partnerIdParam)?.name || f.national || "Nasional"
    : f.national_consolidation || "Konsolidasi Nasional";

  useEffect(() => {
    logActivity("FINANCIAL_PROGRESS_VIEW", "FINANCIAL", `User accessed detailed financial progress for: ${partnerName}`);
  }, [logActivity, partnerName]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const STAGES = useMemo(() => [
    f.stages?.planning || "Perencanaan",
    f.stages?.approval || "Persetujuan",
    f.stages?.treasury || "Kas Negara",
    f.stages?.transfer || "Transfer",
    f.stages?.done || "Selesai",
  ], [f.stages]);

  const records = useMemo(() => {
    const arr: any[] = [];
    let idCount = 1;
    const getStage = (prog: number) => {
      if (prog >= 90) return STAGES[4];
      if (prog >= 60) return STAGES[3];
      if (prog >= 40) return STAGES[2];
      if (prog >= 20) return STAGES[1];
      return STAGES[0];
    };
    const stableDate = "2024-03-20T00:00:00Z";

    clearingHouseData.filter((col: any) => col.sector !== "NGO / Kemanusiaan").forEach((ch: any) => {
      const alloc = Number(ch.budget || 0);
      const progress = Number(ch.confidence || 0);
      arr.push({ id: `PBG-${idCount++}`, source: (ch.fundingScheme || "").includes("APBN") ? "APBN" : "APBD", programName: ch.title || "Program Strategis", allocation: alloc, realization: (alloc * progress) / 100, percentage: progress, lastUpdate: ch.updated_at || stableDate, disbursementStage: getStage(progress) });
    });

    ngoData.forEach((ngo: any) => {
      const alloc = Number(ngo.interventionEstimatedValueIdr || ngo.budget || 0);
      if (alloc > 0) {
        const progress = Number(ngo.progress || 0); 
        arr.push({ id: `NGO-${idCount++}`, source: "NGO/Donor", programName: `${ngo.parentOrganization?.[0]?.name || ngo.org_name || "NGO Associate"}: ${ngo.interventionActivityDescription?.slice(0, 50) || ngo.title || "Intervensi Kemanusiaan"}`, allocation: alloc, realization: (alloc * progress) / 100, percentage: progress, lastUpdate: ngo.updated_at || stableDate, disbursementStage: getStage(progress) });
      }
    });

    return arr.sort((a, b) => b.allocation - a.allocation);
  }, [ngoData, clearingHouseData, STAGES]);

  const { totalAllocation, totalRealization, overallPercentage } = useMemo(() => {
    const alloc = records.reduce((acc, curr) => acc + curr.allocation, 0);
    const realz = records.reduce((acc, curr) => acc + curr.realization, 0);
    return { totalAllocation: alloc, totalRealization: realz, overallPercentage: alloc > 0 ? (realz / alloc) * 100 : 0 };
  }, [records]);

  const sourceData = useMemo(() => {
    return records.reduce((acc: any[], curr) => {
      const existing = acc.find((a) => a.name === curr.source);
      if (existing) existing.value += curr.allocation;
      else acc.push({ name: curr.source, value: curr.allocation });
      return acc;
    }, []);
  }, [records]);

  const SOURCE_COLORS = ["#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899"];

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm">
          <Loader2 className="size-12 text-primary animate-spin" />
        </div>
      )}

      <FinancialHeader 
        title={f.progress_title || "Progres Finansial"} 
        partnerName={partnerName} 
        onNewInput={() => router.push(`/${lang}/admin/financial/input${partnerIdParam ? `?partnerId=${partnerIdParam}` : ""}`)} 
        lang={lang} 
        inputLabel={f.input_new || "Input Anggaran Baru"} 
      />

      <FinancialStats 
        totalAllocation={totalAllocation} 
        totalRealization={totalRealization} 
        overallPercentage={overallPercentage} 
        f={f} 
        formatCurrency={formatCurrency} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SourceCompositionChart sourceData={sourceData} colors={SOURCE_COLORS} f={f} formatCurrency={formatCurrency} />
        <AbsorptionList records={records} stages={STAGES} lang={lang} f={f} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
}

export default function FinancialProgressPage() {
  const dict = useI18n();
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase text-xs tracking-widest">{dict?.common?.loading || "Memuat Analisis..."}</div>}>
      <FinancialProgressContent />
    </Suspense>
  );
}
