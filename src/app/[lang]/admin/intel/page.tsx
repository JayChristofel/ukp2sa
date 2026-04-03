"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, Badge } from "@/components/ui";
import {
  CloudRain,
  Mountain,
  ShieldCheck,
  Zap,
  Info,
  Globe,
  Home,
  Construction,
  Heart,
  Users,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useI18n } from "@/app/[lang]/providers";

const MapComponent = dynamic(
  () => import("@/components/sections/MapComponent"),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  },
);

const MapLoadingSkeleton = () => (
  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex flex-col items-center justify-center rounded-[2rem]">
    <div className="size-16 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-4 animate-pulse duration-1000" />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Establishing Satellite Uplink...
    </p>
  </div>
);

export default function SatelliteIntelPage() {
  const dict = useI18n();
  const si = dict?.satellite_intel || {};
  const common = dict?.common || {};
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "INTEL_REPORTS_VIEW",
      "INTEL",
      "User accessed the satellite intelligence and vulnerability analysis center.",
    );
  }, [logActivity]);

  const handleLayerToggle = (layerId: string) => {
    setActiveLayer(activeLayer === layerId ? null : layerId);
    logActivity(
      "INTEL_LAYER_TOGGLE",
      "INTEL",
      `Toggled satellite intelligence layer: ${layerId}`,
    );
  };

  // --- FETCH SATELLITE LAYERS ---
  const { data: layers = [], isLoading: loadingLayers } = useQuery({
    queryKey: ["satelliteLayers"],
    queryFn: () => apiService.getSatelliteLayers(),
  });

  // --- FETCH SATELLITE METRICS (LIVE WEATHER) ---
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ["satelliteMetrics"],
    queryFn: () => apiService.getSatelliteMetrics(),
    refetchInterval: 300000,
  });

  // --- R3P BY REGENCY (Damage Analysis) ---
  const { data: r3pByRegency = [] } = useQuery({
    queryKey: ["intelR3PRegency"],
    queryFn: () => apiService.getR3PByRegency(),
    staleTime: 30000,
  });

  // --- NGO DATA (Coverage Analysis) ---
  const { data: ngoData = [] } = useQuery({
    queryKey: ["intelNgo"],
    queryFn: () => apiService.getNgo(),
    staleTime: 30000,
  });

  // R3P Regency Ranking — sorted by heavy house damage
  const r3pRanking = useMemo(() => {
    // Utility for metric lookup - pure & efficient
    const getMetricValue = (metrics: any[] | undefined, key: string) =>
      metrics?.find((m: any) => m.key === key)?.value || 0;

    return r3pByRegency
      .map((item: any) => {
        const area = item.administrativeArea || {};
        const houses = item.clusters?.find((c: any) => c.key === "houses");
        const roads = item.clusters?.find(
          (c: any) => c.key === "infrastructureTransportation",
        );

        const heavyHouses = getMetricValue(houses?.metrics, "house_damage_heavy");
        const mediumHouses = getMetricValue(houses?.metrics, "house_damage_medium");
        const lightHouses = getMetricValue(houses?.metrics, "house_damage_light");
        const heavyRoad =
          getMetricValue(roads?.metrics, "neighborhood_road_damage_heavy_meter") +
          getMetricValue(roads?.metrics, "regency_road_damage_heavy_meter");

        return {
          regency: area.regencyName || "Unknown",
          heavyHouses,
          mediumHouses,
          lightHouses,
          totalHouses: heavyHouses + mediumHouses + lightHouses,
          heavyRoadKm: Math.round(heavyRoad / 1000),
        };
      })
      .sort((a: any, b: any) => b.heavyHouses - a.heavyHouses)
      .slice(0, 8);
  }, [r3pByRegency]);

  // NGO Coverage grouped by organization
  const ngoGrouped = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        count: number;
        beneficiaries: number;
        regencies: Set<string>;
      }
    >();
    ngoData.forEach((item: any) => {
      const orgName = item.parentOrganization?.[0]?.name || "Lainnya";
      const existing = map.get(orgName) || {
        name: orgName,
        count: 0,
        beneficiaries: 0,
        regencies: new Set(),
      };
      existing.count++;
      existing.beneficiaries += item.interventionBeneficiariesCount || 0;
      (item.regency || []).forEach((r: string) => existing.regencies.add(r));
      map.set(orgName, existing);
    });
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .map((o) => ({ ...o, regencies: Array.from(o.regencies) }));
  }, [ngoData]);

  // Derive effective layer to avoid synchronous setState in useEffect
  const effectiveLayer = activeLayer || layers[0]?.id;

  const alerts =
    metrics?.precipitation && metrics.precipitation > 5
      ? [
          si.high_rainfall_warning ||
            "Peringatan Curah Hujan Tinggi Terdeteksi di koordinat operasional.",
        ]
      : [];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {si.title_main || "Satellite"}{" "}
            <span className="text-primary italic">
              {si.title_sub || "Intel."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <Globe size={14} className="text-primary" />{" "}
            {si.subtitle || "Intelijen Satelit Berbasis Multi-Sumber"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {si.esa_verified || "Terverifikasi ESA"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            {si.active_layers || "Lapisan Aktif"}
          </h3>
          <div className="space-y-3">
            {loadingLayers ? (
              <div className="py-10 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            ) : (
              layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => handleLayerToggle(layer.id)}
                  className={`w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all text-left flex items-start gap-4 group ${
                    effectiveLayer === layer.id
                      ? "bg-navy text-white border-navy shadow-2xl"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl md:rounded-2xl transition-all ${
                      effectiveLayer === layer.id
                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary"
                    }`}
                  >
                    {layer.type === "Rainfall" ? (
                      <CloudRain size={20} />
                    ) : (
                      <Mountain size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-tight mb-1">
                      {layer.name}
                    </h4>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-widest ${
                        activeLayer === layer.id
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {common.status_label || "Status"}: Live
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {alerts.length > 0 && (
            <Card className="p-6 bg-amber-500 text-white border-none rounded-[2rem] shadow-xl">
              <Info size={32} className="mb-4 opacity-50" />
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                {common.early_warning || "Peringatan Dini"}
              </h4>
              <p className="text-[10px] font-medium leading-relaxed opacity-90 border-l-2 border-white/20 pl-3">
                {alerts[0]}
              </p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Card className="p-2 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="relative h-[70vh] w-full rounded-[2rem] overflow-hidden">
              <MapComponent showMarkers={false} />
              <div className="absolute top-4 right-4 md:top-6 md:right-16 z-[450]">
                <Badge className="bg-navy/80 backdrop-blur-md text-white border-white/10 rounded-lg px-4 py-2 flex items-center gap-2 shadow-2xl">
                  <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
                    {si.active_analysis || "Active Analysis"}:{" "}
                    {layers.find((l) => l.id === effectiveLayer)?.name || "N/A"}
                  </span>
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                {si.cloud_coverage || "Cloud Coverage"}
              </h3>
              <div className="text-4xl font-black text-navy dark:text-white mb-2">
                {loadingMetrics ? "..." : metrics?.cloudCoverage || 0}%
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${metrics?.cloudCoverage || 0}%` }}
                />
              </div>
            </Card>

            <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                {si.insar_deviation || "INSAR Deviation"}
              </h3>
              <div className="text-4xl font-black text-amber-500 mb-2">
                {loadingMetrics ? "..." : metrics?.insarDeviation || "N/A"}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {si.ground_displacement_data ||
                  "Data Pergeseran Tanah (Hari Ini)"}
              </p>
            </Card>

            <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                {si.precision_level || "Precision Level"}
              </h3>
              <div className="text-4xl font-black text-emerald-500 mb-2">
                {loadingMetrics
                  ? "..."
                  : metrics?.precisionLevelValue || "98.2%"}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sentinel-2 Optimized
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* --- R3P DAMAGE RANKING & NGO COVERAGE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* R3P Damage Ranking */}
        <Card className="p-6 md:p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">
                {si.damage_ranking || "Damage Ranking"}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {si.r3p_source || "Sumber: R3P Banjir Sumatra"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {r3pRanking.map((item: any, idx: number) => (
              <div
                key={item.regency}
                className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div
                  className={`size-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    idx < 3
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-navy dark:text-white uppercase truncate">
                    {item.regency}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <Home size={10} className="inline mr-1" />
                    {item.totalHouses.toLocaleString()} rumah
                    {item.heavyRoadKm > 0 && (
                      <>
                        {" "}
                        • <Construction size={10} className="inline mx-1" />
                        {item.heavyRoadKm} km jalan
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.heavyHouses > 10000
                        ? "bg-rose-500/10 text-rose-500"
                        : item.heavyHouses > 1000
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {item.heavyHouses.toLocaleString()} berat
                  </span>
                </div>
              </div>
            ))}
            {r3pRanking.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  {common.loading || "Memuat data..."}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* NGO Coverage */}
        <Card className="p-6 md:p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl">
              <Heart size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">
                {si.ngo_coverage || "NGO Coverage"}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {ngoData.length} {si.active_interventions || "Intervensi Aktif"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {ngoGrouped.map((org: any) => (
              <div
                key={org.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-tight">
                    {org.name}
                  </h4>
                  <Badge className="bg-pink-500/10 text-pink-500 border-none text-[9px] font-black uppercase">
                    {org.count} program
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {org.beneficiaries > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={10} className="text-pink-500" />{" "}
                      {org.beneficiaries.toLocaleString()} jiwa
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin size={10} className="text-primary" />{" "}
                    {org.regencies.length} wilayah
                  </span>
                </div>
                {org.regencies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {org.regencies.slice(0, 4).map((r: string) => (
                      <span
                        key={r}
                        className="text-[8px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
                      >
                        {r}
                      </span>
                    ))}
                    {org.regencies.length > 4 && (
                      <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        +{org.regencies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {ngoGrouped.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  {common.loading || "Memuat data..."}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
