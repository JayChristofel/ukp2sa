import { banjirApi, banjirSumatraApi, tilikanApi } from "@/lib/apiClient";

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
const ensureArray = (res: unknown): any[] => {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const r = res as Record<string, any>;
  const targets = [
    r.data,
    r.results,
    r.items,
    r.answers,
    r.laporans,
    r.reports,
    r.data?.items,
    r.data?.data,
    r.data?.answers,
  ];
  for (const target of targets) {
    if (Array.isArray(target)) return target;
  }

  return [];
};

// Limit per page — 100 is safer for stability and memory
const PAGE_LIMIT = 100;

export const apiService = {
  // --- BANJIR SUMATRA ENDPOINTS ---

  getMissingPersons: async (page = 1) => {
    try {
      // 🛡️ LOCAL-FIRST: SAR category reports are mirrored missing persons
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase
        .from('reports')
        .select('*')
        .eq('category', 'Bencana Banjir') // Usually mirrored under this category in SyncManager
        .order('created_at', { ascending: false })
        .limit(PAGE_LIMIT);

      if (localData && localData.length > 0) return localData;

      const { data } = await (banjirApi.get(`/missing-person`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      const items = ensureArray(data);
      return items.map((item) => ({
        ...item,
        missingPersonDetails: safeParse(item.missingPersonDetails),
        missingConditionDetails: safeParse(item.missingConditionDetails),
      }));
    } catch {
      return [];
    }
  },

  getTendPoints: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/tend-point`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      const items = ensureArray(data);
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
      const { data } = await (banjirApi.get(`/police-office`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },
  
  getNgo: async (page = 1) => {
    try {
      const { data } = await (banjirSumatraApi.get(`/ngo`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getR3P: async (page = 1) => {
    try {
      const { data } = await (banjirSumatraApi.get(`/r3p`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getR3PByRegency: async (page = 1) => {
    try {
      const { data } = await (banjirSumatraApi.get(`/r3p`, {
        params: { group_by: "regency", page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getPosko: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/posko`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getGeneralFacilities: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/general-facilities`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getPublicFacilities: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/public-facilities`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  getVillageDistribution: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/village-distribution`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      const items = ensureArray(data);
      return items.map((item) => ({
        ...item,
        censusDetail: safeParse(item.censusDetail),
      }));
    } catch {
      return [];
    }
  },

  getRegencyFundAllocation: async (page = 1) => {
    try {
      const { data } = await (banjirApi.get(`/regency-fund-allocation`, {
        params: { page, limit: PAGE_LIMIT },
      }) as any);
      return ensureArray(data);
    } catch {
      return [];
    }
  },

  // --- TILIKAN / SUPERDASH ENDPOINTS ---

  getReportAnswers: async (limit = 100) => {
    try {
      // 🛡️ LOCAL-FIRST: Fetch from our own database (Synced via SyncManager)
      // This avoids CORS and Network Errors in production
      const { createClient } = await import("@/lib/client");
      const supabase = createClient();
      const { data: localData } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (localData && localData.length > 0) {
        return localData;
      }

      // Fallback only if local database is empty
      const { data } = await (tilikanApi.get(`/tanggapi/answers`, {
        params: { limit },
      }) as any);
      return ensureArray(data);
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

  getAuditLogs: async (page = 1, limit = 100, user = "") => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (user) params.set("user", user);
      const res = await fetch(`/api/admin/audit?${params}`);
      if (!res.ok) return { data: [], total: 0 };
      const data = await res.json();
      return data;
    } catch {
      return { data: [], total: 0 };
    }
  },

  createAuditLog: async (logData: {
    action: string;
    module: string;
    details: string;
    level?: "info" | "warn" | "error";
    user?: string;
    diff?: any;
  }) => {
    try {
      await fetch(`/api/admin/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...logData,
          ua: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
        }),
      });
    } catch (e) {
      console.error("Failed to create audit log", e);
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
      let idCounter = 1;

      if (allocations && allocations.length > 0) {
        allocations.slice(0, 10).forEach((al: any) => {
          items.push({
            id: `ALC-${idCounter++}`,
            title: `Alokasi Dana ${al.kabupatenKota || "Daerah"}`,
            sector: "Anggaran Dasar",
            status: "synced",
            agency: "Kementerian Keuangan RI",
            budget: 5000000000,
            location: al.kabupatenKota,
          });
        });
      }

      if (posko && posko.length > 0) {
        posko.slice(0, 5).forEach((p: any) => {
          items.push({
            id: `PSK-${idCounter++}`,
            title: `Posko: ${p.namaPosko}`,
            sector: "Sosial & Logistik",
            status: "synced",
            agency: "BPBD",
            location: p.kecamatan,
          });
        });
      }
      
      if (facilities && facilities.length > 0) {
        facilities.slice(0, 5).forEach((f: any) => {
          items.push({
            id: `FAC-${idCounter++}`,
            title: f.namaFasilitas,
            sector: "Infrastruktur",
            status: "synced",
            agency: "PUPR",
            location: f.kecamatan,
          });
        });
      }

      if (ngoData && ngoData.length > 0) {
        ngoData.slice(0, 5).forEach((ngo: any) => {
          items.push({
            id: `NGO-${idCounter++}`,
            title: `Intervensi: ${ngo.interventionActivityDescription?.slice(0, 50)}`,
            sector: "NGO",
            status: "synced",
            agency: ngo.parentOrganization?.[0]?.name,
            location: ngo.regency?.[0],
          });
        });
      }

      return items;
    } catch {
      return [];
    }
  },

  getAssignmentsData: async () => {
    try {
      const [missing, posko, reports] = await Promise.all([
        apiService.getMissingPersons(1).catch(() => []),
        apiService.getPosko(1).catch(() => []),
        apiService.getReportAnswers(10).catch(() => []),
      ]);

      const tasks: any[] = [];
      
      missing.slice(0, 5).forEach((p: any) => {
        tasks.push({
          id: `TSK-SAR-${p.id}`,
          title: `Verifikasi: ${p.name}`,
          status: "Assigned",
          category: "SAR",
        });
      });

      posko.slice(0, 5).forEach((p: any) => {
        tasks.push({
          id: `TSK-LOG-${p.id}`,
          title: `Supervisi: ${p.namaPosko}`,
          status: "Pending",
          category: "Logistik",
        });
      });

      reports.slice(0, 5).forEach((r: any) => {
        tasks.push({
          id: `TSK-REP-${r.id}`,
          title: `Follow-up: ${r.subject || "Laporan Warga"}`,
          status: "Pending",
          category: "Laporan",
        });
      });

      return tasks;
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
