import { createClient } from "./server";

export async function recordAudit(logData: {
  action: string;
  module: string;
  details?: string;
  level?: "info" | "warn" | "error";
  user_email?: string;
  user_name?: string;
  ip?: string;
  ua?: string;
  diff?: any;
  meta?: any;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_logs").insert([
      {
        ...logData,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase Audit Log Error:", error);
    }
  } catch (e) {
    console.error("Audit Logging Failed:", e);
  }
}
