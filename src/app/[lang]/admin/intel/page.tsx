"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useI18n } from "@/app/[lang]/providers";
import { REGENCY_COORDINATES } from "@/lib/constants";

// Modular Components
import { IntelHeader } from "./_components/IntelHeader";
import { LayerController } from "./_components/LayerController";
import { IntelMapSection } from "./_components/IntelMapSection";
import { MetricCards } from "./_components/MetricCards";
import { VulnerabilityAnalysis } from "./_components/VulnerabilityAnalysis";

export default function SatelliteIntelPage() {
  const dict = useI18n();
  const si = dict?.satellite_intel || {};
  const common = dict?.common || {};
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity("INTEL_REPORTS_VIEW", "INTEL", "User accessed the satellite intelligence and vulnerability analysis center.");
  }, [logActivity]);

  const handleLayerToggle = (layerId: string) => {
    setActiveLayer(activeLayer === layerId ? null : layerId);
    logActivity("INTEL_LAYER_TOGGLE", "INTEL", `Toggled satellite intelligence layer: ${layerId}`);
  };

  // --- DATA FETCHING ---
  const { data: layers = [], isLoading: loadingLayers } = useQuery({ queryKey: ["satelliteLayers"], queryFn: () => apiService.getSatelliteLayers() });
  const { data: metrics, isLoading: loadingMetrics } = useQuery({ queryKey: ["satelliteMetrics"], queryFn: () => apiService.getSatelliteMetrics(), refetchInterval: 300000 });
  const { data: r3pByRegency = [] } = useQuery({ queryKey: ["intelR3PRegency"], queryFn: () => apiService.getR3PByRegency(), staleTime: 30000 });
  const { data: ngoData = [] } = useQuery({ queryKey: ["intelNgo"], queryFn: () => apiService.getNgo(), staleTime: 30000 });

  // --- ANALYSIS LOGIC ---
  const r3pRanking = useMemo(() => {
    const getMetricValue = (metrics: any[] | undefined, key: string) => metrics?.find((m: any) => m.key === key)?.value || 0;

    return r3pByRegency.map((item: any) => {
      const area = item.administrativeArea || {};
      const houses = item.clusters?.find((c: any) => c.key === "houses");
      const roads = item.clusters?.find((c: any) => c.key === "infrastructureTransportation");
      const heavyHouses = getMetricValue(houses?.metrics, "house_damage_heavy");
      const heavyRoad = getMetricValue(roads?.metrics, "neighborhood_road_damage_heavy_meter") + getMetricValue(roads?.metrics, "regency_road_damage_heavy_meter");

      return {
        regency: area.regencyName || "Unknown",
        heavyHouses,
        totalHouses: heavyHouses + getMetricValue(houses?.metrics, "house_damage_medium") + getMetricValue(houses?.metrics, "house_damage_light"),
        heavyRoadKm: Math.round(heavyRoad / 1000),
      };
    }).sort((a: any, b: any) => b.heavyHouses - a.heavyHouses).slice(0, 8);
  }, [r3pByRegency]);

  const ngoGrouped = useMemo(() => {
    const map = new Map<string, any>();
    ngoData.forEach((item: any) => {
      const orgName = item.parentOrganization?.[0]?.name || "Lainnya";
      const existing = map.get(orgName) || { name: orgName, count: 0, beneficiaries: 0, regencies: new Set() };
      existing.count++;
      existing.beneficiaries += item.interventionBeneficiariesCount || 0;
      (item.regency || []).forEach((r: string) => existing.regencies.add(r));
      map.set(orgName, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).map((o) => ({ ...o, regencies: Array.from(o.regencies) }));
  }, [ngoData]);

  const effectiveLayer = activeLayer || layers[0]?.id;
  const activeLayerName = layers.find((l: any) => l.id === effectiveLayer)?.name || "N/A";

  const externalMarkers = useMemo(() => {
    // Helper to match coordinates consistently with the main engine
    const findCoords = (name: string) => {
      const clean = (s: string) => (s || "").toLowerCase().replace(/kabupaten|kota/g, "").trim();
      const target = clean(name);
      const entry = Object.entries(REGENCY_COORDINATES).find(([k]) => clean(k) === target || clean(k).includes(target) || target.includes(clean(k)));
      return entry ? entry[1] : [4.6951, 96.7494];
    };

    // Helper for grid distribution (consistent with useMapData)
    const getGrid = (idx: number) => {
      const spacing = 0.006;
      return { lat: (Math.floor(idx / 8) * spacing) - (spacing * 2), lon: ((idx % 8) * spacing) - (spacing * 3.5) };
    };

    const markers: any[] = [];
    if (effectiveLayer === "S1" && Array.isArray(r3pByRegency)) {
       r3pByRegency.forEach((item: any, i: number) => {
         const regencyName = item.administrativeArea?.regencyName || "Aceh";
         const baseCoords = findCoords(regencyName);
         const grid = getGrid(i);
         
         markers.push({
           id: `intel-r3p-${i}`, 
           lat: baseCoords[0] + grid.lat, 
           lon: baseCoords[1] + grid.lon,
           type: "r3p-damage", 
           markerType: "r3p-damage", 
           category: "r3p-damage", // CRITICAL: for MapCategorization
           regency: regencyName,
           data: { ...item, title: `[R3P] ${regencyName}` }
         });
       });
    }
    if (effectiveLayer === "S2" && Array.isArray(ngoData)) {
       ngoData.forEach((item: any, i: number) => {
         const regencyName = (Array.isArray(item.regency) ? item.regency[0] : item.regency) || "Aceh";
         const baseCoords = findCoords(regencyName);
         const grid = getGrid(i % 16); // Balanced spread
         
         markers.push({
           id: `intel-ngo-${i}`, 
           lat: baseCoords[0] + grid.lat, 
           lon: baseCoords[1] + grid.lon,
           type: "ngo", 
           markerType: "ngo", 
           category: "ngo", // CRITICAL: for MapCategorization
           regency: regencyName,
           data: { ...item, title: `[NGO] ${item.parentOrganization?.[0]?.name} (${regencyName})` }
         });
       });
    }
    return markers;
  }, [effectiveLayer, r3pByRegency, ngoData]);

  const alerts = metrics?.precipitation && metrics.precipitation > 5 ? [si.high_rainfall_warning || "Peringatan Curah Hujan Tinggi Terdeteksi!"] : [];

  return (
    <div className="space-y-10 pb-20">
      <IntelHeader si={si} common={common} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <LayerController 
          layers={layers} loadingLayers={loadingLayers} 
          effectiveLayer={effectiveLayer} onLayerToggle={handleLayerToggle}
          si={si} common={common} alerts={alerts}
        />

        <div className="lg:col-span-3">
          <IntelMapSection 
            externalMarkers={externalMarkers} 
            activeLayerName={activeLayerName}
            si={si}
          />

          <MetricCards metrics={metrics} loadingMetrics={loadingMetrics} si={si} />
        </div>
      </div>

      <VulnerabilityAnalysis 
        r3pRanking={r3pRanking} 
        ngoGrouped={ngoGrouped} 
        si={si} common={common} 
        ngoDataLength={ngoData.length}
      />
    </div>
  );
}
