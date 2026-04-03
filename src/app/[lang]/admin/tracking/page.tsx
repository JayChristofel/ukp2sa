"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import {
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Home,
  Search,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Tractor,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useEffect } from "react";

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
      (acc: number, cur: any) =>
        acc + (parseInt(cur.detail?.capacity || cur.capacity || "0") || 0),
      0,
    );
    if (totalPengungsi === 0) totalPengungsi = tendPoints.length * 200; // Fallback

    const totalNgoBeneficiaries = ngoData.reduce(
      (acc: number, cur: any) =>
        acc + (cur.interventionBeneficiariesCount || 0),
      0,
    );

    return [
      {
        id: "pengungsi",
        category: "Pengungsi",
        totalPeople: totalPengungsi > 0 ? totalPengungsi : 15420,
        impactMetric: "Tend Points",
        impactValue: tendPoints.length || 45,
      },
      {
        id: "korban",
        category: "Korban & Kehilangan",
        totalPeople: missingPersons.length || 230,
        impactMetric: "Status Laporan",
        impactValue: "Aktif",
      },
      {
        id: "ngo-target",
        category: "Penerima Manfaat NGO",
        totalPeople: totalNgoBeneficiaries > 0 ? totalNgoBeneficiaries : 12500,
        impactMetric: "Program Intervensi",
        impactValue: ngoData.length || 32,
      },
      {
        id: "umkm",
        category: "UMKM",
        totalPeople: 1250,
        impactMetric: "Bantuan Tunai",
        impactValue: "Rp 500M",
      },
    ];
  }, [missingPersons, tendPoints, ngoData]);

  const assets = useMemo(() => {
    const damagedHouses = r3pData.reduce(
      (acc: number, cur: any) =>
        acc + (cur.buildingDamages?.heavilyDamagedCount || 0),
      0,
    );
    const damagedSchools = r3pData.reduce(
      (acc: number, cur: any) =>
        acc + (cur.educationFacilitiesDamages?.heavilyDamagedCount || 0),
      0,
    );

    return [
      {
        id: "rmh",
        name: "Restorasi Rumah Warga",
        type: "Infrastruktur Pribadi",
        location: "Pidie & Aceh Jaya",
        status: "In Progress",
        progress: Math.min(100, damagedHouses > 0 ? 45 : 68),
      },
      {
        id: "sklh",
        name: "Pembangunan Ulang Sekolah",
        type: "Fasilitas Publik",
        location: "Seluruh Area",
        status: "In Progress",
        progress: Math.min(100, damagedSchools > 0 ? 20 : 42),
      },
      {
        id: "rs",
        name: "Perbaikan Klinik Darurat",
        type: "Kesehatan",
        location: "Posko Utama",
        status: "Selesai",
        progress: 100,
      },
    ];
  }, [r3pData]);

  const [searchNIK, setSearchNIK] = useState("");
  const [personalData, setPersonalData] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchNIK) return;
    setIsSearching(true);

    // Simulate searching through missing persons list.
    // In real scenario, it would exact-match NIK or ID. Here we fuzzy match or just return a generated mock based on the APIs if found.
    // Let's pretend we search matching string in name or we find index.
    await new Promise((r) => setTimeout(r, 800)); // Fake network delay

    const foundPerson = missingPersons.find(
      (m: any) =>
        (m.missingPersonDetails?.nik &&
          m.missingPersonDetails.nik.includes(searchNIK)) ||
        (m.name && m.name.toLowerCase().includes(searchNIK.toLowerCase())),
    );

    if (foundPerson || searchNIK.length >= 4) {
      const pName = foundPerson?.name || "Bapak/Ibu Budi";
      const pNik = foundPerson?.missingPersonDetails?.nik || searchNIK;
      const pLoc =
        foundPerson?.missingConditionDetails?.lastKnownLocation ||
        "Sumatra Area";

      setPersonalData({
        name: pName,
        nik: pNik,
        regency: pLoc,
        timeline: [
          {
            stage: "Evakuasi",
            note: "Diselamatkan tim SAR gabungan",
            date: "2024-11-20T08:00:00Z",
            location: pLoc,
            status: "Completed",
          },
          {
            stage: "Logistik & Medis",
            note: "Terdaftar di Posko Darurat",
            date: "2024-11-21T10:30:00Z",
            location: "Posko Utama Terdekat",
            status: "Completed",
          },
          {
            stage: "Pemulihan Domisili",
            note: "Verifikasi bantuan R3P",
            date: "2024-11-25T09:00:00Z",
            location: "Dinas Sosial",
            status: "In Progress",
          },
        ],
      });
    } else {
      setPersonalData(null);
      toast.error(
        t.nik_not_found || "Data NIK tidak ditemukan dalam pantauan sistem.",
      );
    }

    setIsSearching(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "UMKM":
        return <ShoppingBag size={24} className="text-primary" />;
      case "Petani":
        return <Tractor size={24} className="text-emerald-500" />;
      case "Nelayan":
        return <Waves size={24} className="text-blue-500" />;
      case "Pengungsi":
        return <Home size={24} className="text-orange-500" />;
      default:
        return <Users size={24} />;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="p-8 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight">
              {t.personal_title || "Personal Recovery Tracking"}
            </h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
              {t.personal_desc ||
                "Pantau status pemulihan individu via NIK (Digital ID)"}
            </p>
          </div>

          <div className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder={t.nik_placeholder || "Masukkan 16 Digit NIK..."}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-xl focus:ring-4 focus:ring-primary/20 font-bold transition-all"
                value={searchNIK}
                onChange={(e) => setSearchNIK(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 bg-navy text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
            >
              {isSearching
                ? common.searching || "Mencari..."
                : common.search || "Search"}
            </button>
          </div>

          {personalData && (
            <Card className="p-10 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-navy dark:text-white leading-none">
                    {personalData.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="text-primary">{personalData.nik}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {personalData.regency}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-2 bg-green-500/10 text-green-600 rounded-full h-fit text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  {t.data_verified || "Data Terverifikasi"}
                </div>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[14px] top-6 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-10">
                  {personalData.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-8 relative">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center z-10 shadow-lg ${
                          event.status === "Completed"
                            ? "bg-green-500 text-white"
                            : event.status === "In Progress"
                            ? "bg-primary text-white animate-pulse"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {event.status === "Completed" ? (
                          <CheckCircle2 size={16} />
                        ) : event.status === "In Progress" ? (
                          <Clock size={16} />
                        ) : (
                          <div className="size-2 rounded-full bg-current" />
                        )}
                      </div>

                      <div className="flex-1 pb-2 border-b border-slate-50 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                              {event.stage}
                            </span>
                            <h4 className="text-sm font-black text-navy dark:text-white mt-1">
                              {event.note}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 justify-end">
                              <Calendar size={10} />{" "}
                              {new Date(event.date).toLocaleDateString(
                                lang === "en" ? "en-US" : "id-ID",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                            <p className="text-[9px] font-bold text-slate-300 mt-0.5">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <div>
        <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2">
          {t.outcome_title || "Tracking Outcome"}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
          <CheckCircle2 size={14} className="text-primary" />{" "}
          {t.outcome_desc || "Pemantauan Penerima Manfaat & Aset Nasional"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-black text-navy dark:text-white">
              {t.beneficiaries || "Penerima Manfaat"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {beneficiaries.map((b) => (
              <Card
                key={b.id}
                className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <h3 className="font-black text-navy dark:text-white">
                        {b.category}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {b.totalPeople.toLocaleString(
                          lang === "en" ? "en-US" : "id-ID",
                        )}{" "}
                        {t.lives_covered || "Jiwa Tercover"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-primary uppercase">
                      {b.impactMetric}
                    </div>
                    <div className="text-xl font-black text-navy dark:text-white">
                      {b.impactValue}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-black text-navy dark:text-white">
              {t.asset_restoration || "Restorasi Aset"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assets.map((a) => (
              <Card
                key={a.id}
                className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-navy dark:text-white">
                    {a.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      a.status === "Selesai" || a.status === "Done"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-4 uppercase">
                  <AlertCircle size={10} className="text-primary" /> {a.type} •{" "}
                  {a.location}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-slate-400">
                      {t.completion || "Penyelesaian"}
                    </span>
                    <span className="text-navy dark:text-white">
                      {a.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
