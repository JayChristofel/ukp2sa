"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { Loader2, TrendingUp, Users, Building2, Leaf, DollarSign } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";

// Modular Components
import { KPIHeader } from "./_components/KPIHeader";
import { SectorFilters } from "./_components/SectorFilters";
import { KPICard } from "./_components/KPICard";
import { KPIDetailDialog } from "./_components/KPIDetailDialog";

const getSectorConfig = (d: any) => ({
  Social: { icon: <Users size={24} />, color: "text-blue-500", bgColor: "bg-blue-500/10", label: d.sector_social || "Sosial" },
  Infrastructure: { icon: <Building2 size={24} />, color: "text-purple-500", bgColor: "bg-purple-500/10", label: d.sector_infrastructure || "Infrastruktur" },
  Economy: { icon: <DollarSign size={24} />, color: "text-emerald-500", bgColor: "bg-emerald-500/10", label: d.sector_economy || "Ekonomi" },
  Environment: { icon: <Leaf size={24} />, color: "text-green-500", bgColor: "bg-green-500/10", label: d.sector_environment || "Lingkungan" },
});

export default function KPIPage() {
  const dict = useI18n();
  const d = dict?.kpi || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const SECTOR_CONFIG: any = getSectorConfig(d);

  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedKPI, setSelectedKPI] = useState<any>(null);
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity("KPI_DASHBOARD_VIEW", "REPORTS", "User accessed the performance and KPI analytics center.");
  }, [logActivity]);

  // --- DATA FETCHING ---
  const { data: ngoData = [], isLoading: loadingNGO } = useQuery({ queryKey: ["ngoData"], queryFn: () => apiService.getNgo() });
  const { data: r3pData = [], isLoading: loadingR3P } = useQuery({ queryKey: ["r3pData"], queryFn: () => apiService.getR3P() });
  const { data: missingData = [], isLoading: loadingMissing } = useQuery({ queryKey: ["missingPersons"], queryFn: () => apiService.getMissingPersons(1) });
  const { data: facData = [], isLoading: loadingFac } = useQuery({ queryKey: ["genFacilities"], queryFn: () => apiService.getGeneralFacilities(1) });
  const { data: clearingData = [], isLoading: loadingClearing } = useQuery({ queryKey: ["clearingHouse"], queryFn: () => apiService.getClearingHouseData() });
  const { data: villageDistribution = [], isLoading: loadingVillage } = useQuery({ queryKey: ["villageDistribution"], queryFn: () => apiService.getVillageDistribution() });

  const isLoading = loadingNGO || loadingR3P || loadingMissing || loadingFac || loadingClearing || loadingVillage;

  const kpis = useMemo(() => {
    const list = [];
    const safeNgoData = Array.isArray(ngoData) ? ngoData : [];
    const safeMissingData = Array.isArray(missingData) ? missingData : [];
    const safeFacData = Array.isArray(facData) ? facData : [];
    const safeR3pData = Array.isArray(r3pData) ? r3pData : [];
    const safeClearingData = Array.isArray(clearingData) ? clearingData : [];

    // 1. Social - Aid
    list.push({ id: "kpi-social-1", sector: "Social", title: d.social_aid_title || "Penyaluran Bantuan Sembako", description: d.social_aid_desc || "Capaian penerima manfaat bantuan pangan & logistik.", target: 35000, actual: safeNgoData.reduce((acc: number, cur: any) => acc + (cur.interventionBeneficiariesCount || cur.total_population_assisted || 0), 0), unit: "Jiwa" });
    
    // 2. Social - Missing
    list.push({ id: "kpi-social-2", sector: "Social", title: d.social_missing_title || "Penyelesaian Orang Hilang", description: d.social_missing_desc || "Status pelacakan dan penemuan korban terdampak.", target: safeMissingData.length || 1, actual: safeMissingData.filter((m: any) => m.missingPersonStatus === "Selesai" || m.status === "Ditemukan").length, unit: "Kasus" });

    // 3. Infrastructure - Schools
    const schools = safeFacData.filter(f => f.isSchool || (f.name || "").match(/SD|Sekolah/i));
    list.push({ id: "kpi-infra-1", sector: "Infrastructure", title: d.infra_rehab_title || "Fungsionalitas Sekolah", description: d.infra_rehab_desc || "Jumlah sekolah yang telah beroperasi kembali.", target: schools.length || 1, actual: schools.filter(f => f.damageScale === "Tidak ada kerusakan" || f.status === "Aktif").length, unit: "Sekolah" });

    // 4. Infrastructure - Housing
    list.push({ id: "kpi-infra-2", sector: "Infrastructure", title: d.infra_house_title || "Pemulihan Rumah Tinggal", description: d.infra_house_desc || "Capaian pembangunan kembali rumah warga (R3P).", target: safeR3pData.reduce((acc: number, cur: any) => acc + (cur.buildingDamages?.heavilyDamagedCount || 0), 0) || 1, actual: safeR3pData.reduce((acc: number, cur: any) => acc + (cur.buildingDamages?.notDamagedCount || 0), 0), unit: "Unit" });

    // 5. Economy - Budget
    const totalAllocated = safeClearingData.reduce((acc: number, cur: any) => acc + (Number(cur.budget) || 0), 0) + safeNgoData.reduce((acc: number, cur: any) => acc + (Number(cur.interventionEstimatedValueIdr || cur.budget || 0)), 0);
    const realizedBudget = safeClearingData.reduce((acc: number, cur: any) => acc + (Number(cur.budget || 0) * (Number(cur.confidence || 0) / 100)), 0) + safeNgoData.reduce((acc: number, cur: any) => acc + (Number(cur.interventionEstimatedValueIdr || cur.budget || 0) * 0.65), 0);
    list.push({ id: "kpi-econ-1", sector: "Economy", title: d.econ_budget_title || "Pemanfaatan Dana Bantuan", description: d.econ_budget_desc || "Total dana terealisasi dari Clearing House & NGO.", target: Math.round(totalAllocated / 1e9) || 1, actual: totalAllocated < 1e9 ? (realizedBudget / 1e9).toFixed(2) : Math.round(realizedBudget / 1e9), unit: "Miliar IDR" });

    // 6. Environment
    list.push({ id: "kpi-env-1", sector: "Environment", title: d.env_restoration_title || "Restorasi Lahan Pertanian", description: d.env_restoration_desc || "Capaian pembersihan dan pengaktifan kembali sawah.", target: 2500, actual: Math.round(1840 + villageDistribution.reduce((acc, cur) => acc + (Number(cur.recoveredArea) || 0), 0)), unit: "Hektar" });

    return selectedSector === "all" ? list : list.filter((k) => k.sector === selectedSector);
  }, [ngoData, r3pData, missingData, facData, clearingData, villageDistribution, selectedSector, d]);

  const sectors = [
    { id: "all", label: common.all || "Semua Sektor" },
    { id: "Social", label: d.sector_social || "Sosial" },
    { id: "Infrastructure", label: d.sector_infrastructure || "Infrastruktur" },
    { id: "Economy", label: d.sector_economy || "Ekonomi" },
    { id: "Environment", label: d.sector_environment || "Lingkungan" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <KPIHeader title={d.title_main || "Indikator Kinerja"} subtitle={d.subtitle || "Key Performance Indicators (KPI) Pemulihan Nasional"} />

      <SectorFilters sectors={sectors} selectedSector={selectedSector} onSelect={setSelectedSector} />

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="size-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{common.loading || "Memuat..."}</p>
        </div>
      ) : kpis.length === 0 ? (
        <div className="py-20 text-center bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] backdrop-blur-xl">
          <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <TrendingUp size={40} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{d.no_data || "Belum ada data indikator"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {kpis.map((kpi) => (
            <KPICard 
              key={kpi.id} 
              kpi={kpi} 
              config={SECTOR_CONFIG[kpi.sector] || SECTOR_CONFIG.Social} 
              lang={lang} 
              dict={dict} 
              common={common}
              onViewDetail={() => setSelectedKPI({ ...kpi, config: SECTOR_CONFIG[kpi.sector] || SECTOR_CONFIG.Social })}
            />
          ))}
        </div>
      )}

      {selectedKPI && (
        <KPIDetailDialog
          kpi={selectedKPI}
          config={selectedKPI.config}
          onClose={() => setSelectedKPI(null)}
          dict={dict}
          common={common}
          lang={lang}
        />
      )}
    </div>
  );
}
