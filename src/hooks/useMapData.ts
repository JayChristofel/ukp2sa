"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { REGENCY_COORDINATES } from "@/lib/constants";
import { useI18n } from "../app/[lang]/providers";

/**
 * Helper for grid marker distribution around a center point
 * Provides a much "neater" and aligned appearance compared to spiral.
 */
const getGridOffset = (index: number) => {
  const columns = 8; // Number of markers per row
  const spacing = 0.006; // ~600 meters spacing
  
  const row = Math.floor(index / columns);
  const col = index % columns;
  
  return {
    lat: (row * spacing) - (spacing * 2), // Slight vertical offset
    lon: (col * spacing) - (spacing * 3.5) // Center the grid horizontally
  };
};

export const useMapData = (acehCenter: [number, number], enabled = true) => {
  const PAGE_LIMIT = 100; // Match local service PAGE_LIMIT

  const infiniteOpts = {
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (!Array.isArray(lastPage)) return undefined;
      return lastPage.length >= PAGE_LIMIT ? allPages.length + 1 : undefined;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    enabled,
  };

  const qMissingPersons = useInfiniteQuery({
    queryKey: ["missingPersons"],
    queryFn: ({ pageParam }) => apiService.getMissingPersons(pageParam),
    ...infiniteOpts,
    refetchInterval: enabled ? 30000 : false,
    staleTime: 10000,
  });

  const qTendPoints = useInfiniteQuery({
    queryKey: ["tendPoints"],
    queryFn: ({ pageParam }) => apiService.getTendPoints(pageParam),
    ...infiniteOpts,
  });

  const qPosko = useInfiniteQuery({
    queryKey: ["posko"],
    queryFn: ({ pageParam }) => apiService.getPosko(pageParam),
    ...infiniteOpts,
  });

  const qPoliceOffices = useInfiniteQuery({
    queryKey: ["policeOffices"],
    queryFn: ({ pageParam }) => apiService.getPoliceOffices(pageParam),
    ...infiniteOpts,
  });

  const qGenFacilities = useInfiniteQuery({
    queryKey: ["genFacilities"],
    queryFn: ({ pageParam }) => apiService.getGeneralFacilities(pageParam),
    ...infiniteOpts,
  });

  const qPubFacilities = useInfiniteQuery({
    queryKey: ["pubFacilities"],
    queryFn: ({ pageParam }) => apiService.getPublicFacilities(pageParam),
    ...infiniteOpts,
  });

  const qVillageDist = useInfiniteQuery({
    queryKey: ["villageDist"],
    queryFn: ({ pageParam }) => apiService.getVillageDistribution(pageParam),
    ...infiniteOpts,
    retry: 2,
  });

  const qReports = useQuery({
    queryKey: ["allReports"],
    queryFn: () => apiService.getReportAnswers(200),
    retry: 3,
    retryDelay: (attempt: number) => Math.min(attempt * 2000, 10000),
    staleTime: 30000,
    refetchInterval: enabled ? 30000 : false,
    enabled,
  });

  const qLocalReports = useQuery({
    queryKey: ["localReports"],
    queryFn: () => apiService.getLocalReports(),
    retry: 3,
    staleTime: 30000,
    refetchInterval: enabled ? 30000 : false,
    enabled,
  });

  const qNgo = useQuery({
    queryKey: ["ngoData"],
    queryFn: () => apiService.getNgo(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled,
  });

  const qR3P = useQuery({
    queryKey: ["r3pData"],
    queryFn: () => apiService.getR3P(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled,
  });

  const { data: missingData } = qMissingPersons;
  const { data: tendData } = qTendPoints;
  const { data: poskoData } = qPosko;
  const { data: policeData } = qPoliceOffices;
  const { data: genFacData } = qGenFacilities;
  const { data: pubFacData } = qPubFacilities;
  const { data: villageData } = qVillageDist;
  const { data: reportsData } = qReports;
  const { data: localReportsData } = qLocalReports;
  const { data: ngoData } = qNgo;
  const { data: r3pData } = qR3P;

  const dict = useI18n();
  const dm = dict?.map || {};
  const items = dm.items || {};

  const flat = (data: any) => {
    if (!data || !Array.isArray(data.pages)) return [];
    return data.pages.flat().filter(Boolean) || [];
  };

  const mMissing = React.useMemo(() => {
    return flat(missingData).filter(i => i.missingConditionDetails?.locationLastSeen?.lat).map(item => ({
      id: `missing-${item.id}`,
      type: "missing-person",
      markerType: "missing-person",
      lat: item.missingConditionDetails.locationLastSeen.lat,
      lon: item.missingConditionDetails.locationLastSeen.lon,
      title: item.missingPersonName,
      status: item.missingPersonStatus,
      regency: item.regency || "Aceh",
      category: items["missing-person"] || "Orang Hilang",
      data: item,
      groupId: "utama"
    }));
  }, [missingData, items]);

  const mTend = React.useMemo(() => {
    return flat(tendData).filter(i => i.latitude && i.longitude).map(item => ({
      id: `tend-${item.id || item.poskoCode}`,
      type: "tend-point",
      markerType: "tend-point",
      lat: item.latitude,
      lon: item.longitude,
      title: `Posko Khusus: ${item.picName}`,
      status: "Diproses",
      regency: item.address?.split(",")[1]?.trim() || "Aceh",
      category: items["tend-point"] || "Posko Komunitas",
      data: item,
      groupId: "utama"
    }));
  }, [tendData, items]);

  const mPosko = React.useMemo(() => {
    return flat(poskoData).filter(i => i.latitude && i.longitude).map(item => ({
      id: `posko-${item.id}`,
      type: "posko",
      markerType: "posko",
      lat: parseFloat(item.latitude),
      lon: parseFloat(item.longitude),
      title: item.name,
      status: "Selesai",
      regency: item.regency || "Aceh",
      category: items.posko || "Posko Pemerintah",
      data: item,
      groupId: "utama"
    }));
  }, [poskoData, items]);

  const mPolice = React.useMemo(() => {
    return flat(policeData).filter(i => i.latitude && i.longitude).map(item => ({
      id: `police-${item.id}`,
      type: "police",
      markerType: "police",
      lat: item.latitude,
      lon: item.longitude,
      title: item.name,
      status: "Selesai",
      regency: item.regency || "Aceh",
      category: items.police || "Kantor Polisi",
      data: item,
      groupId: "utama"
    }));
  }, [policeData, items]);

  const mGenFac = React.useMemo(() => {
    return flat(genFacData).filter(i => i.latitude && i.longitude).map(item => {
        let mType = "Kesehatan";
        const cls = (item.classification || "").toLowerCase();
        const name = (item.name || "").toLowerCase();
        if (cls.includes("pendidikan") || cls.includes("sekolah") || name.includes("sma")) mType = "Pendidikan";
        else if (cls.includes("pemerintah") || cls.includes("kantor")) mType = "Pemerintahan";
        else if (cls.includes("agama") || name.includes("masjid")) mType = "Keagamaan";
        return {
          id: `genfac-${item.id}`,
          type: mType,
          markerType: mType,
          lat: item.latitude,
          lon: item.longitude,
          title: item.name,
          status: item.damageScale === "Tidak ada kerusakan" ? "Selesai" : "Diproses",
          regency: item.regency || "Aceh",
          category: items[mType as keyof typeof items] || item.classification || "Fasilitas Umum",
          data: item,
          groupId: "fasum"
        };
    });
  }, [genFacData, items]);

  const mPubFac = React.useMemo(() => {
    return flat(pubFacData).filter(i => i.latitude && i.longitude).map(item => {
        let mType = "jalan-rusak";
        const name = (item.locationName || "").toLowerCase();
        if (name.includes("jembatan")) mType = "jembatan-rusak";
        else if (name.includes("helipad")) mType = "helipad";
        else if (name.includes("starlink")) mType = "starlink";
        return {
          id: `pubfac-${item.id}`,
          type: mType,
          markerType: mType,
          lat: parseFloat(item.latitude),
          lon: parseFloat(item.longitude),
          title: item.locationName,
          status: "Selesai",
          regency: item.regency || "Aceh",
          category: items[mType as keyof typeof items] || item.classification || "Fasilitas Publik",
          data: item,
          groupId: "publik"
        };
    });
  }, [pubFacData, items]);

  const mVillage = React.useMemo(() => {
    return flat(villageData).map(item => {
      const regency = item.regency || "Aceh";
      const coords = REGENCY_COORDINATES[regency] || acehCenter;
      return {
        id: `village-${item.id}`,
        type: "village",
        markerType: "village",
        lat: coords[0] + (Number(item.id || 0) % 100) / 1000,
        lon: coords[1] + (Number(item.id || 0) % 70) / 1000,
        title: `Desa ${item.village}`,
        status: item.condition === "Terdampak" ? "Diproses" : "Selesai",
        regency: regency,
        category: items.village || "Distribusi Desa",
        data: item,
        groupId: "publik"
      };
    });
  }, [villageData, acehCenter, items]);

  const mReports = React.useMemo(() => {
    return (reportsData ?? []).filter((i: any) => i.latitude && i.longitude).map((item: any) => {
        let mType = "report";
        const question = item.question?.toLowerCase() || "";
        if (question.includes("jalan")) mType = "jalan-rusak";
        if (question.includes("jembatan")) mType = "jembatan-rusak";
        return {
          id: `report-${item.id}`,
          type: "report",
          markerType: mType,
          lat: parseFloat(item.latitude),
          lon: parseFloat(item.longitude),
          title: item.question,
          status: "Menunggu",
          regency: "Aceh",
          category: items[mType as keyof typeof items] || "Laporan Warga",
          data: item,
          groupId: "publik"
        };
    });
  }, [reportsData, items]);

  const mLocalReports = React.useMemo(() => {
    return (localReportsData ?? []).filter((i: any) => i.latitude && i.longitude).map((item: any) => ({
      id: `local-${item._id}`,
      type: "report",
      markerType: "report",
      lat: parseFloat(item.latitude),
      lon: parseFloat(item.longitude),
      title: item.title,
      status: item.status || "Menunggu",
      regency: "Aceh",
      category: items.report || "Laporan Lokal",
      data: item,
      groupId: "utama"
    }));
  }, [localReportsData, items]);

  // Helper to find coordinates even if the regency name is not exact
  const findRegencyCoords = (name: string): [number, number] => {
    if (!name) return acehCenter;
    
    // 1. Exact match
    if (REGENCY_COORDINATES[name]) return REGENCY_COORDINATES[name];
    
    // 2. Fuzzy match (check if name is inside any key or vice-versa)
    const cleanName = name.toLowerCase().replace(/kabupaten|kota/g, "").trim();
    const entry = Object.entries(REGENCY_COORDINATES).find(([key]) => {
      const cleanKey = key.toLowerCase().replace(/kabupaten|kota/g, "").trim();
      return cleanKey === cleanName || cleanKey.includes(cleanName) || cleanName.includes(cleanKey);
    });
    
    return entry ? entry[1] : acehCenter;
  };

  // Helper to normalize and compare area names
  const normalizeArea = (name: string) => 
    (name || "").toLowerCase().replace(/kabupaten|kota|desa|kelurahan|kecamatan/g, "").trim();

  const mNgo = React.useMemo(() => {
    return (ngoData ?? []).map((item: any, idx: number) => {
      const regencyName = Array.isArray(item.regency) ? item.regency[0] : item.regency || "Aceh";
      const districtName = Array.isArray(item.district) ? item.district[0] : item.district || "";
      const villageName = Array.isArray(item.village) ? item.village[0] : item.village || "";
      
      const regencyCoords = findRegencyCoords(regencyName);
      const loc = item.interventionLocationCoordinates;
      const itemLat = loc?.lat || loc?.latitude || item.latitude || item.lat;
      const itemLon = loc?.lon || loc?.longitude || item.longitude || item.lon;
      
      const hasRealCoords = itemLat && itemLon && !isNaN(parseFloat(itemLat));
      const grid = getGridOffset(idx);
      
      // DEEP CROSS-REFERENCE with R3P
      // Priority 1: Village match, Priority 2: District match, Priority 3: Regency match
      const nReg = normalizeArea(regencyName);
      const nDist = normalizeArea(districtName);
      const nVill = normalizeArea(villageName);

      const relatedDamage = (r3pData ?? []).find((r: any) => {
          const rArea = r.administrativeArea || {};
          const rReg = normalizeArea(rArea.regencyName);
          const rDist = normalizeArea(rArea.districtName);
          const rVill = normalizeArea(rArea.villageName);
          
          return (rReg === nReg && rDist === nDist && rVill === nVill) || // Village Level
                 (rReg === nReg && rDist === nDist) ||                    // District Level
                 (rReg === nReg);                                         // Regency Level
      });

      return {
        id: `ngo-${item.no || idx}`,
        type: "ngo",
        markerType: "ngo",
        lat: hasRealCoords ? parseFloat(itemLat) : (regencyCoords[0] + grid.lat),
        lon: hasRealCoords ? parseFloat(itemLon) : (regencyCoords[1] + grid.lon),
        title: `${item.parentOrganization?.[0]?.name || "NGO"}: ${(item.interventionActivityDescription || "").slice(0, 60)}`,
        status: item.currentInterventionStatus || "Aktif",
        regency: regencyName,
        category: items.ngo || "Intervensi NGO",
        data: { ...item, relatedDamage, matchLevel: nVill ? 'village' : nDist ? 'district' : 'regency' },
        groupId: "ngo"
      };
    });
  }, [ngoData, r3pData, acehCenter, items]);

  const mR3P = React.useMemo(() => {
    return (r3pData ?? []).map((item: any, idx: number) => {
      const area = item.administrativeArea || {};
      const regencyName = area.regencyName || "Aceh";
      const districtName = area.districtName || "";
      const villageName = area.villageName || "";
      
      const regencyCoords = findRegencyCoords(regencyName);
      const itemLat = item.latitude || item.lat;
      const itemLon = item.longitude || item.lon;
      
      const hasRealCoords = itemLat && itemLon && !isNaN(parseFloat(itemLat));
      const grid = getGridOffset(idx + 5); 
      
      const houses = item.clusters?.find((c: any) => c.key === "houses");
      const heavyDamage = houses?.metrics?.find((m: any) => m.key === "house_damage_heavy")?.value || 0;
      const severity = heavyDamage > 500 ? "Kritis" : heavyDamage > 100 ? "Berat" : heavyDamage > 0 ? "Sedang" : "Ringan";
      
      // DEEP CROSS-REFERENCE with NGO
      const rReg = normalizeArea(regencyName);
      const rDist = normalizeArea(districtName);
      const rVill = normalizeArea(villageName);

      const relatedNgos = (ngoData ?? []).filter((n: any) => {
          const nReg = normalizeArea(Array.isArray(n.regency) ? n.regency[0] : n.regency);
          const nDist = normalizeArea(Array.isArray(n.district) ? n.district[0] : n.district);
          const nVill = normalizeArea(Array.isArray(n.village) ? n.village[0] : n.village);
          
          return (nReg === rReg && nDist === rDist && nVill === rVill) ||
                 (nReg === rReg && nDist === rDist) ||
                 (nReg === rReg);
      });

      return {
        id: `r3p-${item.id || idx}`,
        type: "r3p-damage",
        markerType: "r3p-damage",
        lat: hasRealCoords ? parseFloat(itemLat) : (regencyCoords[0] + grid.lat),
        lon: hasRealCoords ? parseFloat(itemLon) : (regencyCoords[1] + grid.lon),
        title: `R3P ${area.villageName || area.districtName || regencyName}`,
        status: severity === "Kritis" || severity === "Berat" ? "Diproses" : "Selesai",
        regency: regencyName,
        category: items["r3p-damage"] || "Data Kerusakan R3P",
        data: { ...item, severity, relatedNgos },
        groupId: "r3p"
      };
    });
  }, [r3pData, ngoData, acehCenter, items]);

  const markers = React.useMemo(() => {
    return [
      ...mMissing,
      ...mTend,
      ...mPosko,
      ...mPolice,
      ...mGenFac,
      ...mPubFac,
      ...mVillage,
      ...mReports,
      ...mLocalReports,
      ...mNgo,
      ...mR3P,
    ];
  }, [mMissing, mTend, mPosko, mPolice, mGenFac, mPubFac, mVillage, mReports, mLocalReports, mNgo, mR3P]);

  useEffect(() => {
    if (!enabled) return;
    const list = [qMissingPersons, qTendPoints, qPosko, qPoliceOffices, qGenFacilities, qPubFacilities, qVillageDist];
    const next = list.find((q) => {
      const pageCount = q.data?.pages?.length ?? 0;
      return q.hasNextPage && !q.isFetchingNextPage && pageCount < 5;
    });
    if (next) {
      const timer = setTimeout(() => next.fetchNextPage(), 500);
      return () => clearTimeout(timer);
    }
  }, [
    qMissingPersons.hasNextPage, qMissingPersons.isFetchingNextPage, qMissingPersons.data?.pages?.length,
    qTendPoints.hasNextPage, qTendPoints.isFetchingNextPage, qTendPoints.data?.pages?.length,
    qPosko.hasNextPage, qPosko.isFetchingNextPage, qPosko.data?.pages?.length,
    qPoliceOffices.hasNextPage, qPoliceOffices.isFetchingNextPage, qPoliceOffices.data?.pages?.length,
    qGenFacilities.hasNextPage, qGenFacilities.isFetchingNextPage, qGenFacilities.data?.pages?.length,
    qPubFacilities.hasNextPage, qPubFacilities.isFetchingNextPage, qPubFacilities.data?.pages?.length,
    qVillageDist.hasNextPage, qVillageDist.isFetchingNextPage, qVillageDist.data?.pages?.length,
  ]);

  const coreQueries = [qReports, qLocalReports, qPosko, qMissingPersons];
  const isLoading = coreQueries.every((q) => q.isPending && !q.data);
  const isError = [qPosko, qReports].some((q) => q.isError && !q.data);

  return {
    markers,
    isLoading,
    isError,
    errors: [qReports, qNgo, qR3P].reduce((acc: any, q, i) => {
      if (q.error) acc[i] = q.error;
      return acc;
    }, {}),
  };
};
