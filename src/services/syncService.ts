import { banjirApi, banjirSumatraApi, tilikanApi, ensureArray } from "@/lib/apiClient";

/**
 * SyncService
 * This service is SERVER-ONLY and handles synchronization between external APIs and Supabase.
 * It uses the Supabase Service Role key via @/lib/server.
 */
export const syncService = {
  syncExternalData: async () => {
    try {
      // Import server-only client
      const { createClient } = await import("@/lib/server");
      const supabase = await createClient();
      let totalSynced = 0;

      // 1. Financial
      const finRes = await banjirApi.get("/regency-fund-allocation", { params: { limit: 100 } });
      const apiFins = ensureArray<any>(finRes.data);
      if (apiFins.length > 0) {
        const toUpsert = apiFins.map(i => ({
          allocation: Number(i.allocation || 0),
          realization: Number(i.realization || 0),
          percentage: Number(i.percentage || 0),
          program_name: i.programName || i.program_name || i.kabupatenKota || "Program Daerah",
          updated_at: new Date().toISOString()
        }));
        await supabase.from('financial_records').upsert(toUpsert, { onConflict: 'program_name' });
        totalSynced += apiFins.length;
      }

      // 2. NGO
      const ngoRes = await banjirSumatraApi.get("/ngo", { params: { limit: 100 } });
      const apiNgo = ensureArray<any>(ngoRes.data);
      if (apiNgo.length > 0) {
        const toUpsertNgo = apiNgo.map(n => ({
          name: n.NGO_Name || n.name,
          location: n.regency?.[0] || "Aceh",
          budget: Number(n.total_population_assisted || 0),
          activity: n.interventionActivityDescription || "Bantuan Kemanusiaan",
          updated_at: new Date().toISOString()
        }));
        await supabase.from('ngo_data').upsert(toUpsertNgo, { onConflict: 'name' });
        totalSynced += apiNgo.length;
      }

      // 3. Village / KPI
      const kpiRes = await banjirApi.get("/village-distribution", { params: { limit: 100 } });
      const apiKpi = ensureArray<any>(kpiRes.data);
      if (apiKpi.length > 0) {
        const toUpsertKpi = apiKpi.map(v => ({
          village_name: v.village || v.village_name,
          regency: v.regency,
          recovered_area: Number(v.recoveredArea || 0),
          population: Number(v.population || 0),
          das_progress: Number(v.dasProgress || 0),
          updated_at: new Date().toISOString()
        }));
        await supabase.from('village_distribution').upsert(toUpsertKpi, { onConflict: 'village_name' });
        totalSynced += apiKpi.length;
      }

      // 4. Police Offices
      const policeRes = await banjirApi.get("/police-office", { params: { limit: 100 } });
      const apiPolice = ensureArray<any>(policeRes.data);
      if (apiPolice.length > 0) {
        const toUpsertPolice = apiPolice.map(p => ({
          name: p.name || p.office_name,
          location: p.regency || p.location || "Aceh",
          type: "POLICE",
          updated_at: new Date().toISOString()
        }));
        await supabase.from('police_offices').upsert(toUpsertPolice, { onConflict: 'name' });
        totalSynced += apiPolice.length;
      }

      // 5. R3P Data
      const r3pRes = await banjirSumatraApi.get("/r3p", { params: { limit: 100 } });
      const apiR3p = ensureArray<any>(r3pRes.data);
      if (apiR3p.length > 0) {
        const toUpsertR3p = apiR3p.map(r => ({
          program_name: r.program_name || r.title,
          status: r.status || "Planned",
          budget: Number(r.budget || 0),
          updated_at: new Date().toISOString()
        }));
        await supabase.from('r3p_data').upsert(toUpsertR3p, { onConflict: 'program_name' });
        totalSynced += apiR3p.length;
      }

      // 6. Poskos
      const poskoRes = await banjirApi.get("/posko", { params: { limit: 100 } });
      const apiPosko = ensureArray<any>(poskoRes.data);
      if (apiPosko.length > 0) {
        const toUpsertPosko = apiPosko.map(po => ({
          name: po.namaPosko || po.name,
          capacity: Number(po.capacity || 0),
          location: po.location || po.regency || "Aceh",
          updated_at: new Date().toISOString()
        }));
        await supabase.from('poskos').upsert(toUpsertPosko, { onConflict: 'name' });
        totalSynced += apiPosko.length;
      }

      // 7. SAR / Missing Persons -> Sync to Reports
      const sarRes = await banjirApi.get("/missing-person", { params: { limit: 100 } });
      const apiSar = ensureArray<any>(sarRes.data);
      if (apiSar.length > 0) {
        const toUpsertSar = apiSar.map(s => ({
          title: `SAR: ${s.name}`,
          description: s.lastSeenPoint || "Pencarian orang hilang akibat banjir.",
          category: 'SAR',
          priority: 'HIGH',
          status: s.status || 'UNREAD',
          created_at: s.reportedDate || s.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        await supabase.from('reports').upsert(toUpsertSar, { onConflict: 'title' });
        totalSynced += apiSar.length;
      }

      // 8. Tanggapi / Citizen Answers -> Sync to Reports
      const ansRes = await tilikanApi.get("/tanggapi/answers", { params: { limit: 100 } });
      const apiAns = ensureArray<any>(ansRes.data);
      if (apiAns.length > 0) {
        const toUpsertAns = apiAns.map(a => ({
          title: a.title || a.subject || `Aduan Warga: ${a.fullName || 'Anonim'}`,
          description: a.description || "Laporan aduan masyarakat via Tilikan API.",
          category: 'Masyarakat',
          priority: a.priority || 'MEDIUM',
          status: 'UNREAD',
          created_at: a.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        await supabase.from('reports').upsert(toUpsertAns, { onConflict: 'title' });
        totalSynced += apiAns.length;
      }

      // 9. General Facilities
      const genRes = await banjirApi.get("/general-facilities", { params: { limit: 100 } });
      const apiGen = ensureArray<any>(genRes.data);
      if (apiGen.length > 0) {
        const toUpsertGen = apiGen.map(f => ({
          name: f.name || f.facility_name,
          category: "General",
          location: f.location || f.regency || "Aceh",
          updated_at: new Date().toISOString()
        }));
        await supabase.from('facilities').upsert(toUpsertGen, { onConflict: 'name' });
        totalSynced += apiGen.length;
      }

      return { success: true, synced: totalSynced };
    } catch (error) {
      console.error("❌ Sync failed:", error);
      return { success: false, error };
    }
  }
};
