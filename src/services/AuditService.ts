import { createClient } from "@/lib/server";
import { headers } from "next/headers";
import { auth } from "@/auth";

/**
 * AuditService: Penjaga keaslian data UKP2SA.
 * Nyatet siapa, ngapain, di mana, kapan biar data selalu akuntabel.
 */
export class AuditService {
  /**
   * Log an activity to the 'audit_logs' table in Supabase.
   * Dipanggil tiap kali ada mutasi data atau aksi sensitif.
   */
  static async log(params: {
    action: string;
    module: string;
    details?: string;
    level?: "info" | "warn" | "error";
    diff?: any; 
    meta?: any;
    req?: Request; // Optional: Passing request object to automatically extract IP/UA
  }) {
    try {
      const supabase = await createClient();
      const session = await auth();
      
      let ip = "internal-call";
      let ua = "system";

      // 1. Extract IP & User Agent (Browser)
      try {
        const headerList = await headers();
        ip = headerList.get("x-forwarded-for") || headerList.get("remote-addr") || ip;
        ua = headerList.get("user-agent") || ua;
      } catch {
        // Silently fails if not in a request context (e.g. background job)
      }

      // 2. Write to Supabase Audit Log Table
      const { error } = await supabase
        .from("audit_logs")
        .insert({
          action: params.action,
          module: params.module,
          details: params.details || `Performed ${params.action} on ${params.module}`,
          level: params.level || "info",
          user_email: session?.user?.email || "anonymous_system",
          user_name: session?.user?.name || "System Runner",
          ip: ip,
          ua: ua,
          diff: params.diff || null, // JSON object of what changed
          meta: params.meta || null  // Additional context
        });

      if (error) {
        console.error("❌ [AuditService Error]:", error.message);
      } else {
        console.log(`✅ [Audit] ${params.action} recorded for ${session?.user?.email || 'System'}`);
      }
    } catch (error: any) {
      // Don't throw error back to prevent breaking the main feature flow
      console.error("❌ CRITICAL: Audit logging failed:", error.message);
    }
  }

  /**
   * Helper specifically for capturing changes (diff)
   */
  static async logRecordChange(module: string, oldData: any, newData: any) {
      return this.log({
          action: "UPDATE",
          module: module,
          diff: {
              before: oldData,
              after: newData
          }
      });
  }
}
