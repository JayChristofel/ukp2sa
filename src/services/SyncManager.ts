import axios from "axios";
import { createClient } from "@/lib/server";

/**
 * SyncManager: Juru tulis otomatis yang narik data dari API luar 
 * terus ditulis ulang ke database UKP2SA biar selalu up-to-date.
 */
export class SyncManager {
  private static BANJIR_API = process.env.BANJIR_SUMATRA_API;
  private static BANJIR_PUBLIC_API = process.env.BANJIR_SUMATRA_PUBLIC_API;
  private static SUPERDASH_API = process.env.SUPERDASH_API;

  /**
   * Menulis ulang data laporan bencana dari Diswatch/Banjir Sumatra
   * Optimized: Bulk Upsert (Satu request ke DB)
   */
  static async syncBanjirReports() {
    try {
      console.log("🌊 [Sync] Sinking reports from Banjir Sumatra API...");
      const supabase = await createClient();
      
      const response = await axios.get(`${this.BANJIR_API}/reports`);
      const reports = response.data.data || response.data;

      if (!Array.isArray(reports) || reports.length === 0) {
          console.warn("⚠️ [Sync] No valid reports found from Banjir API.");
          return;
      }

      // Map data to bulk format
      const bulkData = reports.map((item: any) => ({
        id: `api-${item.id || Math.random().toString(36).substring(2, 9)}`,
        title: item.title,
        description: item.description || "Auto-synced from satellite API",
        location: item.location || "Sumatra",
        regency: item.regency || "Sumatra",
        reporter_name: "Satellite System",
        status: item.status || "Diproses",
        category: "Bencana Banjir",
        source: "satellite",
        latitude: item.latitude?.toString(),
        longitude: item.longitude?.toString(),
        satellite_intel: {
          rainfallLevel: item.rainfallLevel || "Sedang",
          confidenceScore: 0.95,
          lastScan: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }));

      // Execute Bulk Upsert
      const { error } = await supabase
        .from('reports')
        .upsert(bulkData, { onConflict: 'id' });

      if (error) throw error;
      console.log(`✅ [Sync] Successfully synced ${reports.length} reports in one batch.`);
    } catch (error: any) {
      console.error("❌ [Sync Error]: Failed syncing Banjir API:", error.message);
    }
  }

  /**
   * Menulis ulang data dashboard metrics dari SuperDash
   * Optimized: Bulk Upsert
   */
  static async syncDashboardMetrics() {
    try {
      console.log("📊 [Sync] Sinking metrics from SuperDash API...");
      const supabase = await createClient();

      const response = await axios.get(`${this.SUPERDASH_API}/metrics`);
      const metrics = response.data.data || response.data;

      if (typeof metrics !== 'object' || metrics === null) return;

      const bulkMetrics = Object.entries(metrics).map(([key, value]) => ({
        key: `api_${key}`,
        value: { val: value },
        last_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('dashboard_metrics')
        .upsert(bulkMetrics, { onConflict: 'key' });
          
      if (error) throw error;
      console.log(`✅ [Sync] Dashboard metrics updated (${bulkMetrics.length} items).`);
    } catch (error: any) {
      console.error("❌ [Sync Error]: Failed syncing SuperDash API:", error.message);
    }
  }

  /**
   * Menulis ulang data laporan bencana dari API Publik Banjir Sumatra
   * Optimized: Bulk Upsert
   */
  static async syncPublicReports() {
    try {
      console.log("📢 [Sync] Sinking reports from PUBLIC Banjir API...");
      const supabase = await createClient();
      
      const response = await axios.get(`${this.BANJIR_PUBLIC_API}/reports`);
      const reports = response.data.data || response.data;

      if (!Array.isArray(reports) || reports.length === 0) return;

      const bulkPublicData = reports.map((item: any) => ({
        id: `pub-${item.id || Math.random().toString(36).substring(2, 9)}`,
        title: item.title,
        description: item.description || "Official report from public API",
        location: item.location || "Sumatra",
        regency: item.regency || "Sumatra",
        reporter_name: item.reporter || "BNPB/BPBD Public",
        status: "Menunggu",
        category: "Bencana Banjir",
        source: "rest",
        latitude: item.latitude?.toString(),
        longitude: item.longitude?.toString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('reports')
        .upsert(bulkPublicData, { onConflict: 'id' });
          
      if (error) throw error;
      console.log(`✅ [Sync] Successfully synced ${reports.length} public reports in batch.`);
    } catch (error: any) {
      console.error("❌ [Sync Error]: Public API failed:", error.message);
    }
  }

  /**
   * Jalankan semua sinkronisasi
   */
  static async runAllSync() {
      // Kita jalankan secara paralel pakai Promise.all buat ngebut maksimal!
      // Karena tiap fungsi sekarang cuma hit DB sekali, paralel itu AMAN.
      await Promise.all([
          this.syncBanjirReports(),
          this.syncPublicReports(),
          this.syncDashboardMetrics()
      ]);
  }
}

