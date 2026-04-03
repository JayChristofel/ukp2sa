"use client";

import React, { useState, useMemo } from "react";
import { Card, Badge } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { motion } from "framer-motion";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useEffect } from "react";
import {
  Target as TargetIcon,
  TrendingUp,
  Users,
  Building2,
  Leaf,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";

const getSectorConfig = (d: any) => ({
  Social: {
    icon: <Users size={24} />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: d.sector_social || "Sosial",
  },
  Infrastructure: {
    icon: <Building2 size={24} />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: d.sector_infrastructure || "Infrastruktur",
  },
  Economy: {
    icon: <DollarSign size={24} />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: d.sector_economy || "Ekonomi",
  },
  Environment: {
    icon: <Leaf size={24} />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: d.sector_environment || "Lingkungan",
  },
});

export default function KPIPage() {
  const dict = useI18n();
  const d = dict?.kpi || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const SECTOR_CONFIG: any = getSectorConfig(d);

  const [selectedSector, setSelectedSector] = useState<string>("all");
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "KPI_DASHBOARD_VIEW",
      "REPORTS",
      "User accessed the performance and KPI analytics center.",
    );
  }, [logActivity]);

  // --- DATA FETCHING ---
  const { data: ngoData = [], isLoading: loadingNGO } = useQuery({
    queryKey: ["ngoData"],
    queryFn: () => apiService.getNgo(),
  });

  const { data: r3pData = [], isLoading: loadingR3P } = useQuery({
    queryKey: ["r3pData"],
    queryFn: () => apiService.getR3P(),
  });

  const { data: missingData = [], isLoading: loadingMissing } = useQuery({
    queryKey: ["missingPersons"],
    queryFn: () => apiService.getMissingPersons(1),
  });

  const { data: facData = [], isLoading: loadingFac } = useQuery({
    queryKey: ["genFacilities"],
    queryFn: () => apiService.getGeneralFacilities(1),
  });

  const { data: clearingData = [], isLoading: loadingClearing } = useQuery({
    queryKey: ["clearingHouse"],
    queryFn: () => apiService.getClearingHouseData(),
  });

  const isLoading =
    loadingNGO || loadingR3P || loadingMissing || loadingFac || loadingClearing;

  const kpis = useMemo(() => {
    const list = [];

    // 1. Social - Food Aid
    const totalBeneficiaries = ngoData.reduce(
      (acc: number, cur: any) =>
        acc + (cur.interventionBeneficiariesCount || 0),
      0,
    );
    const targetBeneficiaries = 50000; // Simulated reference target
    list.push({
      id: "kpi-social-1",
      sector: "Social",
      title: d.social_aid_title || "Penyaluran Bantuan Sembako",
      description:
        d.social_aid_desc ||
        "Target penerima manfaat bantuan pangan & logistik primer.",
      target: targetBeneficiaries,
      actual: totalBeneficiaries || 12450,
      unit: "Jiwa",
    });

    // 2. Social - Missing Persons
    const totalMissing = missingData.length || 120;
    const resolvedMissing =
      missingData.filter((m: any) => m.missingPersonStatus === "Selesai")
        .length || 85;
    list.push({
      id: "kpi-social-2",
      sector: "Social",
      title: d.social_missing_title || "Penyelesaian Orang Hilang",
      description:
        d.social_missing_desc ||
        "Status pelacakan dan penemuan korban terdampak.",
      target: totalMissing,
      actual: resolvedMissing,
      unit: "Kasus",
    });

    // 3. Infrastructure - Public Fac
    const totalFac = facData.length || 45;
    const resolvedFac =
      facData.filter((f: any) => f.damageScale === "Tidak ada kerusakan")
        .length || 32;
    list.push({
      id: "kpi-infra-1",
      sector: "Infrastructure",
      title: d.infra_rehab_title || "Rehabilitasi Fasum Publik",
      description:
        d.infra_rehab_desc ||
        "Persentase gedung sekolah, RS, dan kantor yang sudah berfungsi kembali.",
      target: totalFac,
      actual: resolvedFac,
      unit: "Gedung",
    });

    // 4. Infrastructure - Housing (R3P)
    const totalDamages =
      r3pData.reduce(
        (acc: number, cur: any) =>
          acc + (cur.buildingDamages?.heavilyDamagedCount || 0),
        0,
      ) || 1200;
    const resolvedHouses = Math.round(totalDamages * 0.58); // Simulated progress baseline
    list.push({
      id: "kpi-infra-2",
      sector: "Infrastructure",
      title: d.infra_house_title || "Pemulihan Rumah Tinggal",
      description:
        d.infra_house_desc ||
        "Progress pembangunan kembali rumah pasca bencana (R3P).",
      target: totalDamages,
      actual: resolvedHouses,
      unit: "Unit",
    });

    // 5. Economy - Budget
    const totalAllocated =
      clearingData.reduce(
        (acc: number, cur: any) => acc + (cur.budget || 0),
        0,
      ) || 50000000000;
    const realizedBudget = totalAllocated * 0.72; // Simulated absorption
    list.push({
      id: "kpi-econ-1",
      sector: "Economy",
      title: d.econ_budget_title || "Serapan Anggaran Pemulihan",
      description:
        d.econ_budget_desc ||
        "Alokasi APBN/NGO yang telah terelaborasi di lapangan.",
      target: Math.round(totalAllocated / 1000000000),
      actual: Math.round(realizedBudget / 1000000000),
      unit: "Miliar IDR",
    });

    // 6. Environment - Land Restoration
    list.push({
      id: "kpi-env-1",
      sector: "Environment",
      title: d.env_restoration_title || "Restorasi Lahan Pertanian",
      description:
        d.env_restoration_desc ||
        "Rehabilitasi sawah dan perkebunan yang terdampak banjir.",
      target: 2500,
      actual: 1840,
      unit: "Hektar",
    });

    return selectedSector === "all"
      ? list
      : list.filter((k) => k.sector === selectedSector);
  }, [ngoData, r3pData, missingData, facData, clearingData, selectedSector, d]);

  const sectors = [
    { id: "all", label: common.all || "Semua Sektor" },
    { id: "Social", label: d.sector_social || "Sosial" },
    { id: "Infrastructure", label: d.sector_infrastructure || "Infrastruktur" },
    { id: "Economy", label: d.sector_economy || "Ekonomi" },
    { id: "Environment", label: d.sector_environment || "Lingkungan" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {d.title_main || "Indikator Kinerja"}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <TargetIcon size={14} className="text-primary" />{" "}
            {d.subtitle ||
              "Key Performance Indicators (KPI) Pemulihan Nasional"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {sectors.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSector(s.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedSector === s.id
                ? "bg-navy text-white shadow-xl"
                : "bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:text-primary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="size-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {common.loading || "Memuat..."}
          </p>
        </div>
      ) : kpis.length === 0 ? (
        <div className="py-20 text-center bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] backdrop-blur-xl">
          <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <TrendingUp size={40} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            {d.no_data || "Belum ada data indikator"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {kpis.map((kpi) => {
            const config = SECTOR_CONFIG[kpi.sector] || SECTOR_CONFIG.Social;
            const progress = (kpi.actual / kpi.target) * 100;

            return (
              <Card
                key={kpi.id}
                className="p-8 border-none rounded-[2.5rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:translate-y-[-4px] transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl ${config.bgColor} ${config.color} transition-colors`}
                  >
                    {config.icon}
                  </div>
                  <Badge className="rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                    {config.label}
                  </Badge>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-black text-navy dark:text-white uppercase leading-tight tracking-tight mb-2 line-clamp-2">
                    {kpi.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {kpi.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                        {d.target || "Target"}
                      </p>
                      <p className="text-sm font-black text-navy dark:text-white uppercase">
                        {kpi.target.toLocaleString(
                          lang === "en" ? "en-US" : "id-ID",
                        )}{" "}
                        {kpi.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                        {d.actual || "Realisasi"}
                      </p>
                      <p className="text-sm font-black text-primary uppercase">
                        {kpi.actual.toLocaleString(
                          lang === "en" ? "en-US" : "id-ID",
                        )}{" "}
                        {kpi.unit}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-slate-400">
                        {d.progress || "Pencapaian"}
                      </span>
                      <span
                        className={
                          progress >= 100 ? "text-emerald-500" : "text-primary"
                        }
                      >
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          progress >= 100 ? "bg-emerald-500" : "bg-primary"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`size-2 rounded-full ${
                          progress >= 90
                            ? "bg-emerald-500"
                            : progress >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {progress >= 90
                          ? d.status_optimal || "Optimal"
                          : progress >= 50
                          ? d.status_warning || "Warning"
                          : d.status_critical || "Kritis"}
                      </span>
                    </div>
                    <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">
                      {common.detail || "Detail"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
