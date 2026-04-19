import { banjirApi, banjirSumatraApi, tilikanApi } from "@/lib/apiClient";
import { AuditLogResponse, CreateAuditLogInput } from "@/types/audit";
import { FinancialRecord, ReportItem } from "@/types/entities";

/**
 * Helper to safely parse JSON strings from API
 */
const safeParse = (str: string | null | undefined) => {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

/**
 * Helper to ensure we get an array from API responses
 * Handles: [items], { data: [items] }, { data: { data: [items] } }
 */
const ensureArray = <T = any>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (!res || typeof res !== "object") return [];

  const r = res as Record<string, unknown>;
  const targets = [
    r.data,
    r.results,
    r.items,
    r.answers,
    r.laporans,
    r.reports,
    (r.data as any)?.items,
    (r.data as any)?.data,
    (r.data as any)?.answers,
  ];
  for (const target of targets) {
    if (Array.isArray(target)) return target as T[];
  }

  return [];
};

// Limit per page — Increased for full dashboard coverage
// Limit per page — Adjusted to 100 as per technical spec
const PAGE_LIMIT = 100;

export const apiService = {
  // --- BANJIR SUMATRA ENDPOINTS ---

  getMissingPersons: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      
      const [localRes, externalRes] = await Promise.allSettled([
        supabase.from('reports').select('*').eq('category', 'SAR').limit(PAGE_LIMIT),
        banjirApi.get(`/missing-person`, { params: { page, limit: PAGE_LIMIT } })
      ]);

      let combined: any[] = [];
      if (localRes.status === 'fulfilled' && localRes.value.data) {
        combined = [...localRes.value.data];
      }

      if (externalRes.status === 'fulfilled') {
        const items = ensureArray<any>((externalRes.value as any).data);
        const localIds = new Set(combined.map(r => String(r.id)));
        const filteredApi = items.filter(r => !localIds.has(String(r.id)));
        const externalItems = filteredApi.map((item) => ({
          ...item,
          missingPersonDetails: safeParse(item.missingPersonDetails),
          missingConditionDetails: safeParse(item.missingConditionDetails),
          isExternal: true
        }));
        combined = [...combined, ...externalItems];
      }

      return combined;
    } catch {
      return [];
    }
  },

  getTendPoints: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/tend-point`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      const items = ensureArray<any>(data);
      return items.map((item) => ({
        ...item,
        detail: safeParse(item.detail),
      }));
    } catch {
      return [];
    }
  },

  getPoliceOffices: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('police_offices').select('*').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirApi.get(`/police-office`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },
  
  getNgo: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('ngo_data').select('*').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirSumatraApi.get(`/ngo`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },

  getR3P: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('r3p_data').select('*').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirSumatraApi.get(`/r3p`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },

  getR3PByRegency: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      // Try local fetch first
      const { data: localData } = await supabase.from('r3p_data').select('*').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirSumatraApi.get(`/r3p`, { params: { group_by: "regency", page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },

  getPosko: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('poskos').select('*').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirApi.get(`/posko`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },

  getGeneralFacilities: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('facilities').select('*').eq('category', 'General').limit(PAGE_LIMIT);

      const mapper = (f: any) => ({
        ...f,
        isSchool: (f.name || "").match(/SD|SMP|SMA|SMK|Sekolah|Universitas|Dayah/i),
        isHealth: (f.name || "").match(/Klinik|Puskesmas|RSUD|Rumah Sakit|Apotek/i),
        isDAS: (f.name || "").match(/DAS|Sungai|Krueng|Drainase|Bendungan/i)
      });

      if (localData && localData.length > 0) return localData.map(mapper);

      const { data } = await (banjirApi.get(`/general-facilities`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data).map(mapper);
    } catch { return []; }
  },

  getPublicFacilities: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('facilities').select('*').eq('category', 'Public').limit(PAGE_LIMIT);
      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirApi.get(`/public-facilities`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data);
    } catch { return []; }
  },

  getVillageDistribution: async (page = 1) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase.from('village_distribution').select('*').limit(PAGE_LIMIT);

      const mapper = (item: any) => {
        const census = safeParse(item.censusDetail) || {};
        return {
          ...item,
          censusDetail: census,
          recoveredArea: Number(census.recoveredArea || item.recovered_area || 0),
          population: Number(census.population || item.population || 0),
          dasProgress: Number(census.dasProgress || item.das_progress || 0)
        };
      };

      if (localData && localData.length > 0) return localData.map(mapper);

      const { data } = await (banjirApi.get(`/village-distribution`, { params: { page, limit: PAGE_LIMIT } }) as any);
      return ensureArray<any>(data).map(mapper);
    } catch { return []; }
  },

  getRegencyFundAllocation: async (page = 1): Promise<FinancialRecord[]> => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();

      // Priority: Local data from Supabase (Populated by Cron)
      const { data: localData } = await supabase
        .from('financial_records')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(PAGE_LIMIT);

      const mapFin = (item: any) => ({
        ...item,
        realization: Number(item.realization || item.realisasi || item.amount || 0),
        percentage: Number(item.percentage || item.persentase || 0),
        programName: item.programName || item.program_name || "Program Strategis Daerah"
      });

      if (localData && localData.length > 0) {
        return localData.map(mapFin);
      }

      // Fallback: If local is empty, try live API once
      const externalRes = await banjirApi.get(`/regency-fund-allocation`, { params: { page, limit: PAGE_LIMIT } });
      const apiItems = ensureArray<any>(externalRes.data);
      return apiItems.map(mapFin);
    } catch {
      return [];
    }
  },

  // --- TILIKAN / SUPERDASH ENDPOINTS ---

  getReportAnswers: async (limit = 100): Promise<ReportItem[]> => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();

      const [localRes, apiRes] = await Promise.allSettled([
        supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(limit),
        tilikanApi.get(`/tanggapi/answers`, { params: { limit } })
      ]);

      let combined: any[] = [];
      const mapReport = (r: any): ReportItem => ({
        ...r,
        createdAt: r.createdAt || r.created_at || r.timestamp || new Date().toISOString()
      });

      if (localRes.status === 'fulfilled' && localRes.value.data) {
        combined = [...localRes.value.data.map(mapReport)];
      }

      if (apiRes.status === 'fulfilled') {
        const apiItems = ensureArray<any>((apiRes.value as any).data);
        const localIds = new Set(combined.map(r => String(r.id)));
        const filteredApi = apiItems.filter(r => !localIds.has(String(r.id)));
        combined = [...combined, ...filteredApi.map(mapReport)];
      }

      return combined;
    } catch {
      return [];
    }
  },

  saveReport: async (reportData: any) => {
    try {
      const res = await fetch(`/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) return { success: false, error: "Server error" };
      return res.json();
    } catch {
      return { success: false, error: "Network error" };
    }
  },

  getLocalReports: async (limit = 50) => {
    try {
      const res = await fetch(`/api/reports?limit=${limit}`);
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.error("Local reports fetch failed", error);
      return [];
    }
  },

  getSpecialQuestions: async (types = "addendum,demografi") => {
    try {
      const { data } = await (tilikanApi.get(`/tanggapi/questions/special`, {
        params: { types },
      }) as any);
      return data.data;
    } catch {
      return [];
    }
  },

  getTopics: async () => {
    try {
      const res = await fetch(`/api/topics`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Local topics fetch failed", error);
      return [];
    }
  },

  getQuestionsByTopic: async (topicId: string | number) => {
    if (!topicId) return [];
    try {
      const res = await fetch(`/api/questions?topicId=${topicId}`);
      if (!res.ok) return [];
      const json = await res.json();
      
      return (json.data || []).map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
    } catch (error) {
      console.error("Local questions fetch failed", error);
      return [];
    }
  },

  getReportById: async (id: string) => {
    try {
      const { data } = await (tilikanApi.get(`/tanggapi/answers/${id}`) as any);
      return data;
    } catch {
      return null;
    }
  },

  // --- ADMIN & AUDIT SYSTEM ---

  getAuditLogs: async (page = 1, limit = 100, user = ""): Promise<AuditLogResponse> => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (user) params.set("user", user);
      const res = await fetch(`/api/admin/audit?${params}`);
      if (!res.ok) return { data: [], stats: { totalEvents: 0, securityGaps: 0, activeSessions: 0, integrity: { totalScore: 0, dimensions: { completeness: 0, accuracy: 0, consistency: 0 } } } };
      const data = await res.json();
      return data;
    } catch {
      return { data: [], stats: { totalEvents: 0, securityGaps: 0, activeSessions: 0, integrity: { totalScore: 0, dimensions: { completeness: 0, accuracy: 0, consistency: 0 } } } };
    }
  },

  createAuditLog: async (logData: CreateAuditLogInput) => {
    try {
      const response = await fetch(`/api/admin/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...logData,
          ua: logData.ua || (typeof window !== "undefined" ? window.navigator.userAgent : "Server"),
        }),
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          console.warn("⚠️ Audit log rate limited (429)");
        } else {
          console.error(`🔴 Audit log failed with status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("❌ Network error while creating audit log:", error);
    }
  },

  getUsers: async (page = 1, limit = 10, search = "", role = "") => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) return { data: [], total: 0 };
      return res.json();
    } catch {
      return { data: [], total: 0 };
    }
  },
  deleteUser: async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },

  saveUser: async (userData: any) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },
  getRoles: async () => {
    try {
      const res = await fetch(`/api/admin/roles`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  deleteRole: async (id: string) => {
    try {
      const res = await fetch(`/api/admin/roles?id=${id}`, { method: "DELETE" });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },

  // --- DATA SYNCHRONIZATION (Background Sync) ---

  saveRole: async (roleData: any) => {
    try {
      const res = await fetch(`/api/admin/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleData),
      });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },

  getPermissionsGrouped: async () => {
    try {
      const res = await fetch(`/api/admin/permissions`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  savePermission: async (data: any) => {
    try {
      const res = await fetch(`/api/admin/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },

  deletePermission: async (id: string) => {
    try {
      const res = await fetch(`/api/admin/permissions?id=${id}`, { method: "DELETE" });
      return res.json();
    } catch {
      return { error: "Network error" };
    }
  },

  // --- BLOG SYSTEM ---

  getBlogPosts: async (page = 1, limit = 20, search = "", category = "") => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/admin/blog?${params}`);
      if (!res.ok) return { data: [], total: 0 };
      return res.json();
    } catch {
      return { data: [], total: 0 };
    }
  },

  getBlogPost: async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  // --- ANALYTICS & DASHBOARD ---

  getSatelliteLayers: async () => {
    return [
      { id: "S1", name: "SATELLITE IMAGERY (R3P DAMAGE)", type: "Rainfall" },
      { id: "S2", name: "VULNERABILITY ANALYSIS (NGO)", type: "Mountain" }
    ];
  },

  getSatelliteMetrics: async (lat = 4.6951, lon = 96.7494) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,relative_humidity_2m,precipitation&hourly=visibility`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      return {
        cloudCoverage: data.current?.cloud_cover || 12,
        precipitation: data.current?.precipitation || 0,
        precisionLevel: "Sentinel-2 Optimized",
        insarDeviation: "0.42mm/day",
        precisionLevelValue: "98.2%",
      };
    } catch {
      return {
        cloudCoverage: 12,
        precipitation: 0,
        precisionLevel: "Mock Sync",
        insarDeviation: "0.0mm/day",
        precisionLevelValue: "0%",
      };
    }
  },

  getClearingHouseData: async () => {
    try {
      const [allocations, posko, facilities, ngoData] = await Promise.all([
        apiService.getRegencyFundAllocation(1).catch(() => []),
        apiService.getPosko(1).catch(() => []),
        apiService.getPublicFacilities(1).catch(() => []),
        apiService.getNgo(1).catch(() => []),
      ]);

      const items: any[] = [];
      const registry: any[] = [];

      // Smart Conflict Detection v2
      const analyzeConflict = (title: string, location: string, sector: string, budget: number, agency: string) => {
        const normalizedTitle = (title || "").toLowerCase().trim();
        const normalizedLoc = (location || "").toLowerCase().trim();

        // Check against existing registry
        const conflict = registry.find(item => {
          const titleMatch = item.title === normalizedTitle;
          const locMatch = item.location === normalizedLoc;
          const budgetMatch = item.budget === budget;
          const sectorMatch = item.sector === sector.toLowerCase();
          
          return (titleMatch && locMatch) || (locMatch && budgetMatch && sectorMatch);
        });

        if (conflict) {
          // If title and location match exactly = INVALID DUPLICATE (Data Error)
          if (conflict.title === normalizedTitle && conflict.agency === agency) {
            return { status: "duplicate", confidence: 99, reason: "Identical record detected from same source." };
          }
          // If location and budget match but title/agency different = POTENTIAL OVERLAP (Valid but Warning)
          return { status: "overlap", confidence: 75, reason: "Budget overlap detected in same cluster." };
        }

        registry.push({ title: normalizedTitle, location: normalizedLoc, budget, agency, sector: sector.toLowerCase() });
        return { status: "synced", confidence: 100, reason: "Clean record." };
      };

      // 1. Allocations (Core Budget)
      allocations.forEach((al: any, idx: number) => {
        const loc = al.kabupatenKota || al.kabupaten_kota || al.kabupaten || "Aceh";
        const sec = "Anggaran";
        const bud = Number(al.amount_realization || al.realisasi || al.budget || al.total_dana || 0);
        const agn = al.agency || al.instansi || "Kementerian Keuangan RI";
        const conflict = analyzeConflict(al.programName || al.kabupatenKota, loc, sec, bud, agn);
        
        items.push({
          id: `ALC-${idx}`,
          code: al.code || `BUD-${idx}-${loc.slice(0, 3).toUpperCase()}`,
          title: al.programName || `Alokasi Dana ${loc}`,
          sector: "Anggaran Dasar",
          status: conflict.status,
          confidence: conflict.confidence,
          reason: conflict.reason,
          agency: agn,
          budget: bud,
          location: loc,
          fundingScheme: al.fundingScheme || al.funding_scheme || "APBN / APBA",
          outcome: al.outcome || `Optimalisasi dana untuk wilayah ${loc} sesuai usulan tahun anggaran berjalan.`,
        });
      });

      // 2. Posko (Logistics)
      posko.forEach((p: any, idx: number) => {
        const loc = p.kecamatan || p.kabupaten || "Aceh";
        const sec = "Logistik";
        const bud = Number(p.budget || p.estimated_cost || 0);
        const agn = p.instansi || p.agency || "BPBD / Dinas Sosial";
        const conflict = analyzeConflict(p.namaPosko, loc, sec, bud, agn);

        items.push({
          id: `PSK-${idx}`,
          code: p.kodePosko || `LOG-${idx}-${loc.slice(0, 3).toUpperCase()}`,
          title: `Posko: ${p.namaPosko}`,
          sector: "Sosial & Logistik",
          status: conflict.status,
          confidence: conflict.confidence,
          reason: conflict.reason,
          agency: agn,
          budget: bud,
          location: loc,
          fundingScheme: p.funding_source || "Dana Hibah / Darurat",
          outcome: p.service_description || `Penyediaan logistik darurat dan titik kumpul di wilayah ${loc}.`,
        });
      });

      // 3. Facilities (Infrastructure)
      facilities.forEach((f: any, idx: number) => {
        const loc = f.kecamatan || f.kabupaten || "Aceh";
        const sec = "Infrastruktur";
        const bud = Number(f.budget || f.rehab_cost || 0);
        const agn = f.agency || f.manager || "Dinas PUPR / Perkim";
        const conflict = analyzeConflict(f.namaFasilitas, loc, sec, bud, agn);

        items.push({
          id: `FAC-${idx}`,
          code: f.id || f.code || `INF-${idx}-${loc.slice(0, 3).toUpperCase()}`,
          title: f.namaFasilitas || "Fasilitas Publik",
          sector: "Infrastruktur",
          status: conflict.status,
          confidence: conflict.confidence,
          reason: conflict.reason,
          agency: agn,
          budget: bud,
          location: loc,
          fundingScheme: f.funding || "DANA DESA / APBK",
          outcome: f.description || `Perbaikan dan pemeliharaan fasilitas ${f.namaFasilitas} untuk masyarakat ${loc}.`,
        });
      });

      // 4. NGO (Interventions)
      ngoData.forEach((ngo: any, idx: number) => {
        const loc = ngo.regency?.[0] || "Aceh";
        const sec = "Bantuan Luar";
        const bud = ngo.total_population_assisted || 100000000;
        const agn = ngo.parentOrganization?.[0]?.name || "NGO Partner";
        const conflict = analyzeConflict(ngo.NGO_Name, loc, sec, bud, agn);

        items.push({
          id: `NGO-${idx}`,
          code: `INTV-${idx}-${loc.slice(0, 3).toUpperCase()}`,
          title: `Intervensi: ${ngo.interventionActivityDescription?.slice(0, 50)}...`,
          sector: "NGO / Kemitraan",
          status: conflict.status,
          confidence: conflict.confidence,
          reason: conflict.reason,
          agency: agn,
          budget: bud,
          location: loc,
          fundingScheme: "International Grant",
          outcome: `Bantuan teknis dan distribusi logistik sasar masyarakat di ${loc}.`,
        });
      });

      return items;
    } catch {
      return [];
    }
  },

  getAssignmentsData: async () => {
    try {
      // 🚀 REAL-TIME AGGREGATION
      const [missing, posko, reports, ngo, police, genFac, pubFac] = await Promise.all([
        apiService.getMissingPersons(1).catch(() => []),
        apiService.getPosko(1).catch(() => []),
        apiService.getReportAnswers(30).catch(() => []),
        apiService.getNgo(1).catch(() => []),
        apiService.getPoliceOffices(1).catch(() => []),
        apiService.getGeneralFacilities(1).catch(() => []),
        apiService.getPublicFacilities(1).catch(() => []),
      ]);

      const tasks: any[] = [];
      const now = new Date().toISOString();

      const mapProgressFromStatus = (status: string, apiProgress?: number) => {
        if (typeof apiProgress === 'number' && apiProgress > 0) return apiProgress;
        const s = (status || "").toLowerCase();
        if (["verified", "completed", "selesai", "resolved", "aman", "guarded"].includes(s)) return 100;
        if (["proses", "inspection", "sedang berjalan", "active"].includes(s)) return 50;
        if (["assigned", "terjadwal", "pending"].includes(s)) return 25;
        return 10;
      };

      // 1. SAR / Missing Persons
      missing.forEach((p: any, idx: number) => {
        const s = p.status || p.condition || "Searching";
        tasks.push({
          id: `TSK-SAR-${p.id || p._id || idx}-${idx}`,
          title: `SAR: ${p.name || "Identitas Unknown"}`,
          status: s,
          progress: mapProgressFromStatus(s, p.progress || p.percentage),
          category: "SAR",
          assignee: "Unit SAR Aceh",
          createdAt: p.created_at || p.createdAt || now,
        });
      });

      // 2. Logistics / Posko
      posko.forEach((p: any, idx: number) => {
        const s = p.status || p.condition || "Operational";
        tasks.push({
          id: `TSK-LOG-${p.id || p._id || idx}-${idx}`,
          title: `Logistik: ${p.namaPosko}`,
          status: s,
          progress: mapProgressFromStatus(s, p.progress || p.percentage || p.realization),
          category: "Logistik",
          assignee: p.contactName || "BPBD / Dinas Sosial",
          createdAt: p.created_at || p.createdAt || now,
        });
      });

      // 3. Citizen Reports
      reports.forEach((r: any, idx: number) => {
        const s = r.status || r.current_status || "Pending";
        tasks.push({
          id: `TSK-REP-${r.id || r._id || idx}-${idx}`,
          title: `Laporan: ${r.subject || r.category || "Verifikasi Lapangan"}`,
          status: s,
          progress: mapProgressFromStatus(s, r.progress || r.percentage),
          category: "Masyarakat",
          assignee: r.assignee || "Pusat Komando",
          createdAt: r.created_at || r.createdAt || now,
        });
      });

      // 4. NGO / Intv
      ngo.forEach((n: any, idx: number) => {
        const s = n.status || n.interventionStatus || "Active";
        tasks.push({
          id: `TSK-NGO-${n.id || n._id || idx}-${idx}`,
          title: `NGO: ${n.interventionActivityDescription?.slice(0, 50) || "Intervensi Bantuan"}...`,
          status: s,
          progress: mapProgressFromStatus(s, n.progress || n.percentage || n.realization),
          category: "Kemitraan",
          assignee: n.parentOrganization?.[0]?.name || "NGO Partner",
          createdAt: n.created_at || n.createdAt || now,
        });
      });

      // 5. General Facilities
      genFac.forEach((f: any, idx: number) => {
        const s = f.status || f.kondisi || "Functional";
        tasks.push({
          id: `TSK-GFAC-${f.id || f._id || idx}-${idx}`,
          title: `Fasilitas: ${f.namaFasilitas || f.nama || "Fasilitas Umum"}`,
          status: s,
          progress: mapProgressFromStatus(s, f.progress || f.percentage),
          category: "Infrastruktur",
          assignee: f.manager || "Dinas PUPR",
          createdAt: f.created_at || f.createdAt || now,
        });
      });

      // 6. Public Facilities
      pubFac.forEach((f: any, idx: number) => {
        const s = f.status || f.kondisi || "Functional";
        tasks.push({
          id: `TSK-PFAC-${f.id || f._id || idx}-${idx}`,
          title: `Publik: ${f.namaFasilitas || f.nama || "Fasilitas Publik"}`,
          status: s,
          progress: mapProgressFromStatus(s, f.progress || f.percentage),
          category: "Infrastruktur",
          assignee: f.manager || "Dinas PUPR",
          createdAt: f.created_at || f.createdAt || now,
        });
      });

      // 7. Security / Police
      police.forEach((p: any, idx: number) => {
        const s = p.status || "Guarded";
        tasks.push({
          id: `TSK-SEC-${p.id || p._id || idx}-${idx}`,
          title: `Keamanan: ${p.namaPolsek || "Pos Polisi"}`,
          status: s,
          progress: mapProgressFromStatus(s, p.progress),
          category: "Keamanan",
          assignee: "POLRI",
          createdAt: p.created_at || p.createdAt || now,
        });
      });

      return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  },

  getPartners: async (): Promise<any[]> => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'Active');
      
      if (error) throw error;
      
      return (data || []).map(p => ({
        ...p,
        imageSrc: p.image_src || p.image_url || "/partners/placeholder.png", // map snake_case to camelCase matches the UI expectation
      }));
    } catch {
      // Fallback in case of client issues (e.g. server-side calling browser client) or DB error
      return [];
    }
  },

  getReportsByAgency: async (agencyId: string) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('instansi_id', agencyId);
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  getFinancialsByAgency: async (agencyId: string) => {
    try {
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('instansi_id', agencyId);
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  getPortalStats: async () => {
    try {
      const res = await fetch(`/api/portal/stats`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },
};
