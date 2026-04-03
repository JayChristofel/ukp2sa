"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { REGENCY_COORDINATES } from "@/lib/constants";
import { useI18n } from "../app/[lang]/providers";

export const useMapData = (acehCenter: [number, number], enabled = true) => {
  const PAGE_LIMIT = 100;

  const infiniteOpts = {
    initialPageParam: 1,
    getNextPageParam: (lastPage: any[], allPages: any[][]) =>
      lastPage.length >= PAGE_LIMIT ? allPages.length + 1 : undefined,
    retry: 2,
    retryDelay: 1000,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled,
  };

  const qMissingPersons = useInfiniteQuery({
    queryKey: ["missingPersons"],
    queryFn: ({ pageParam }) => apiService.getMissingPersons(pageParam),
    ...infiniteOpts,
    refetchInterval: enabled ? 30000 : false, // Refresh only if enabled
    staleTime: 10000, // Becomes stale faster
  });

  // ... (Update all queries to use enabled)
  
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

  // --- BANJIR SUMATRA PUBLIC API: NGO & R3P ---
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

  // Helper to flatten infinite query pages directly from data
  const flat = (data: any) => data?.pages?.flat() ?? [];

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

  // NGO intervention markers — positioned by regency coordinates
  const mNgo = React.useMemo(() => {
    return (ngoData ?? []).map((item: any, idx: number) => {
      const regencyName = item.regency?.[0] || "Aceh";
      const coords = REGENCY_COORDINATES[regencyName] || acehCenter;
      // Slight offset per item to avoid marker stacking
      const offsetLat = (idx % 10) * 0.005 - 0.025;
      const offsetLon = (Math.floor(idx / 10) % 5) * 0.005 - 0.0125;
      return {
        id: `ngo-${item.no || idx}`,
        type: "ngo",
        markerType: "ngo",
        lat: coords[0] + offsetLat,
        lon: coords[1] + offsetLon,
        title: `${item.parentOrganization?.[0]?.name || "NGO"}: ${(item.interventionActivityDescription || "").slice(0, 60)}`,
        status: item.currentInterventionStatus || "Aktif",
        regency: regencyName,
        category: items.ngo || "Intervensi NGO",
        data: item,
        groupId: "ngo"
      };
    });
  }, [ngoData, acehCenter, items]);

  // R3P damage markers — per village, positioned by regency coordinates
  const mR3P = React.useMemo(() => {
    return (r3pData ?? []).map((item: any, idx: number) => {
      const area = item.administrativeArea || {};
      const regencyName = area.regencyName || "Aceh";
      const coords = REGENCY_COORDINATES[regencyName] || acehCenter;
      const offsetLat = (idx % 15) * 0.004 - 0.03;
      const offsetLon = (Math.floor(idx / 15) % 8) * 0.004 - 0.016;
      // Calculate severity from houses cluster
      const houses = item.clusters?.find((c: any) => c.key === "houses");
      const heavyDamage = houses?.metrics?.find((m: any) => m.key === "house_damage_heavy")?.value || 0;
      const severity = heavyDamage > 500 ? "Kritis" : heavyDamage > 100 ? "Berat" : heavyDamage > 0 ? "Sedang" : "Ringan";
      return {
        id: `r3p-${item.id || idx}`,
        type: "r3p-damage",
        markerType: "r3p-damage",
        lat: coords[0] + offsetLat,
        lon: coords[1] + offsetLon,
        title: `R3P ${area.villageName || area.districtName || regencyName}`,
        status: severity === "Kritis" || severity === "Berat" ? "Diproses" : "Selesai",
        regency: regencyName,
        category: items["r3p-damage"] || "Data Kerusakan R3P",
        data: { ...item, severity },
        groupId: "r3p"
      };
    });
  }, [r3pData, acehCenter, items]);

  // Combined markers array
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

  // Staggered auto-fetch to prevent main-thread choking
  useEffect(() => {
    if (!enabled) return;
    
    const list = [
      qMissingPersons,
      qTendPoints,
      qPosko,
      qPoliceOffices,
      qGenFacilities,
      qPubFacilities,
      qVillageDist,
    ];
    // Limit auto-fetch to first 5 pages per category to avoid browser death
    // on massive datasets. The user can fetch more if they move the map (future feature)
    // or we can increase this cap if needed.
    const next = list.find((q) => {
      const pageCount = q.data?.pages?.length || 0;
      return q.hasNextPage && !q.isFetchingNextPage && pageCount < 5;
    });

    if (next) {
      // Increased delay to 500ms lets the browser handle rendering & main thread
      // tasks more comfortably between data chunks.
      const timer = setTimeout(() => next.fetchNextPage(), 500);
      return () => clearTimeout(timer);
    }
  }, [
    qMissingPersons.hasNextPage,
    qMissingPersons.isFetchingNextPage,
    qMissingPersons.data?.pages?.length,
    qTendPoints.hasNextPage,
    qTendPoints.isFetchingNextPage,
    qTendPoints.data?.pages?.length,
    qPosko.hasNextPage,
    qPosko.isFetchingNextPage,
    qPosko.data?.pages?.length,
    qPoliceOffices.hasNextPage,
    qPoliceOffices.isFetchingNextPage,
    qPoliceOffices.data?.pages?.length,
    qGenFacilities.hasNextPage,
    qGenFacilities.isFetchingNextPage,
    qGenFacilities.data?.pages?.length,
    qPubFacilities.hasNextPage,
    qPubFacilities.isFetchingNextPage,
    qPubFacilities.data?.pages?.length,
    qVillageDist.hasNextPage,
    qVillageDist.isFetchingNextPage,
    qVillageDist.data?.pages?.length,
  ]);

  const allQueries = [
    qMissingPersons,
    qTendPoints,
    qPosko,
    qPoliceOffices,
    qGenFacilities,
    qPubFacilities,
    qVillageDist,
    qReports,
    qNgo,
    qR3P,
  ];

  const isLoading = allQueries.some((q) => q.isPending && !q.data);
  const isError = [qMissingPersons, qTendPoints, qPosko].some(
    (q) => q.isError && !q.data
  );

  return {
    markers,
    isLoading,
    isError,
    errors: allQueries.reduce((acc: any, q, i) => {
      if (q.error) acc[i] = q.error;
      return acc;
    }, {}),
  };
};
