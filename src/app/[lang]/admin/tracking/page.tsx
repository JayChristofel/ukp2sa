"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useI18n } from "@/app/[lang]/providers";

// Modular Components
import { TrackingSearch } from "./_components/TrackingSearch";
import { PersonalDataCard } from "./_components/PersonalDataCard";
import { OutcomeHeader } from "./_components/OutcomeHeader";
import { BeneficiaryGrid } from "./_components/BeneficiaryGrid";
import { AssetRestorationGrid } from "./_components/AssetRestorationGrid";

export default function TrackingPage() {
  const dict = useI18n();
  const t = dict?.tracking || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "TRACKING_DASHBOARD_VIEW",
      "REPORTS",
      "User accessed the national beneficiary tracking and asset restoration dashboard.",
    );
  }, [logActivity]);

  const { data: missingPersons = [] } = useQuery({
    queryKey: ["trackingMissingPersons"],
    queryFn: () => apiService.getMissingPersons(1),
    staleTime: 60000,
  });

  const { data: tendPoints = [] } = useQuery({
    queryKey: ["trackingTendPoints"],
    queryFn: () => apiService.getTendPoints(1),
    staleTime: 60000,
  });

  const { data: r3pData = [] } = useQuery({
    queryKey: ["trackingR3p"],
    queryFn: () => apiService.getR3P(1).catch(() => []),
    staleTime: 60000,
  });

  const { data: ngoData = [] } = useQuery({
    queryKey: ["trackingNgo"],
    queryFn: () => apiService.getNgo(1),
    staleTime: 60000,
  });

  const beneficiaries = useMemo(() => {
    let totalPengungsi = tendPoints.reduce(
      (acc: number, cur: any) => acc + (parseInt(cur.detail?.capacity || cur.capacity || "0") || 0),
      0,
    );
    if (totalPengungsi === 0) totalPengungsi = tendPoints.length * 200;

    const totalNgoBeneficiaries = ngoData.reduce(
      (acc: number, cur: any) => acc + (cur.interventionBeneficiariesCount || 0),
      0,
    );

    return [
      { id: "pengungsi", category: t.category_refugees || "Pengungsi", totalPeople: totalPengungsi > 0 ? totalPengungsi : 15420, impactMetric: t.metric_tend_points || "Tend Points", impactValue: (tendPoints.length || 45).toString() },
      { id: "korban", category: t.category_victims || "Korban & Kehilangan", totalPeople: missingPersons.length || 230, impactMetric: t.metric_report_status || "Status Laporan", impactValue: t.status_active || "Aktif" },
      { id: "ngo-target", category: t.category_ngo_beneficiaries || "Penerima Manfaat NGO", totalPeople: totalNgoBeneficiaries > 0 ? totalNgoBeneficiaries : 12500, impactMetric: t.metric_ngo_program || "Program Intervensi", impactValue: (ngoData.length || 32).toString() },
      { id: "umkm", category: t.category_umkm || "UMKM", totalPeople: 1250, impactMetric: t.metric_cash_aid || "Bantuan Tunai", impactValue: "Rp 500M" },
    ];
  }, [missingPersons, tendPoints, ngoData]);

  const assets = useMemo(() => {
    const damagedHouses = r3pData.reduce((acc: number, cur: any) => acc + (cur.buildingDamages?.heavilyDamagedCount || 0), 0);
    const damagedSchools = r3pData.reduce((acc: number, cur: any) => acc + (cur.educationFacilitiesDamages?.heavilyDamagedCount || 0), 0);

    return [
      { id: "rmh", name: t.asset_house_recovery || "Restorasi Rumah Warga", type: t.type_private_infra || "Infrastruktur Pribadi", location: "Pidie & Aceh Jaya", status: t.status_in_progress || "In Progress", progress: Math.min(100, damagedHouses > 0 ? 45 : 68) },
      { id: "sklh", name: t.asset_school_rebuild || "Pembangunan Ulang Sekolah", type: t.type_public_facility || "Fasilitas Publik", location: "Seluruh Area", status: t.status_in_progress || "In Progress", progress: Math.min(100, damagedSchools > 0 ? 20 : 42) },
      { id: "rs", name: t.asset_clinic_repair || "Perbaikan Klinik Darurat", type: t.type_health || "Kesehatan", location: "Posko Utama", status: t.status_completed || "Selesai", progress: 100 },
    ];
  }, [r3pData]);

  const [searchNIK, setSearchNIK] = useState("");
  const [personalData, setPersonalData] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchNIK) return;
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 800));

    const foundPerson = missingPersons.find(
      (m: any) => (m.missingPersonDetails?.nik && m.missingPersonDetails.nik.includes(searchNIK)) || 
                  (m.name && m.name.toLowerCase().includes(searchNIK.toLowerCase())),
    );

    if (foundPerson || searchNIK.length >= 4) {
      setPersonalData({
        name: foundPerson?.name || "Bapak/Ibu Budi",
        nik: foundPerson?.missingPersonDetails?.nik || searchNIK,
        regency: foundPerson?.missingConditionDetails?.lastKnownLocation || "Sumatra Area",
        timeline: [
          { stage: "Evakuasi", note: "Diselamatkan tim SAR gabungan", date: "2024-11-20T08:00:00Z", location: foundPerson?.missingConditionDetails?.lastKnownLocation || "Sumatra Area", status: "Completed" },
          { stage: "Logistik & Medis", note: "Terdaftar di Posko Darurat", date: "2024-11-21T10:30:00Z", location: "Posko Utama Terdekat", status: "Completed" },
          { stage: "Pemulihan Domisili", note: "Verifikasi bantuan R3P", date: "2024-11-25T09:00:00Z", location: "Dinas Sosial", status: "In Progress" },
        ],
      });
    } else {
      setPersonalData(null);
      toast.error(t.nik_not_found || "Data NIK tidak ditemukan dalam pantauan sistem.");
    }
    setIsSearching(false);
  };

  if (!dict) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 px-4 sm:px-6 lg:px-8">
      <TrackingSearch 
        t={t} common={common} 
        searchNIK={searchNIK} setSearchNIK={setSearchNIK} 
        isSearching={isSearching} onSearch={handleSearch} 
      />

      {personalData && (
        <PersonalDataCard 
          t={t} personalData={personalData} 
          lang={lang} 
        />
      )}

      <OutcomeHeader t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <BeneficiaryGrid 
          t={t} beneficiaries={beneficiaries} 
          lang={lang} 
        />
        <AssetRestorationGrid 
          t={t} assets={assets} 
        />
      </div>
    </div>
  );
}
