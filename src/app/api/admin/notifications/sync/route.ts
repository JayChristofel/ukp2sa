import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { apiService } from "@/services/unifiedService";
import { secureRoute } from "@/lib/api-middleware";
import { sendMail } from "@/lib/mail";
import { sendWhatsApp } from "@/lib/whatsapp";

/**
 * Global API Sync Logic with Trigger (Events-Driven) - SUPABASE VERSION
 * GET /api/admin/notifications/sync
 */
export const GET = secureRoute(async () => {
  try {
    const supabase = await createClient();
    
    // 1. Sync reports (Tilikan API)
    const latestAnswers = await apiService.getReportAnswers(10);
    const addedReports = [];

    for (const answer of latestAnswers) {
      if (!answer?.id) continue;

      const externalId = `tilikan-${answer.id}`;
      
      // Check for duplicates in Supabase
      const { data: exists } = await supabase
        .from("notifications")
        .select("id")
        .eq("external_id", externalId)
        .single();

      if (!exists) {
        const title = `🚨 Laporan Warga Baru: ${answer?.subject || "Tanpa Judul"}`;
        const description = `Terdapat aduan baru dari masyarakat untuk ditindaklanjuti segera.`;
        
        // Save to Supabase
        const { data: notif, error: insertError } = await supabase
          .from("notifications")
          .insert([{
            title,
            description,
            type: "report",
            priority: "high",
            action_label: "Tinjau Laporan",
            link: `/admin/laporan?id=${answer.id}`,
            external_id: externalId,
          }])
          .select()
          .single();

        if (insertError) {
          console.error("❌ [Sync Notif Error]:", insertError.message);
          continue;
        }

        // --- TRIGGER ACTIONS (PRO-ACTIVE LOGIC) ---
        await sendWhatsApp(
          process.env.ADMIN_PHONE || "08123456789", 
          `*UKP2SA MONITORING* 🚨\n\n*${title}*\n${description}\n\nLink: https://ukp2sa.go.id/admin/laporan?id=${answer.id}`
        );

        await sendMail({
          to: process.env.ADMIN_EMAIL || "admin@ukp2sa.go.id",
          subject: title,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #e11d48;">UKP2SA Emergency Warning</h2>
              <p><strong>${title}</strong></p>
              <p>${description}</p>
              <a href="https://ukp2sa.go.id/admin/laporan?id=${answer.id}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Lihat Detail Laporan</a>
            </div>
          `
        });

        addedReports.push(notif);
      }
    }

    // 2. Sync allocations (Banjir Sumatra API)
    const allocations = await apiService.getRegencyFundAllocation(1).catch(() => []);
    const addedAllocations = [];

    if (allocations && allocations.length > 0) {
      for (const al of allocations.slice(0, 5)) {
        if (!al?.id) continue;

        const externalId = `alloc-${al.id}`;
        
        const { data: exists } = await supabase
          .from("notifications")
          .select("id")
          .eq("external_id", externalId)
          .single();
        
        if (!exists) {
          const title = `💰 Update Distribusi Dana: ${al?.kabupatenKota || "Daerah"}`;
          const description = `Update alokasi sinkronisasi pendanaan di sistem Clearing House terdeteksi.`;

          const { data: notif } = await supabase
            .from("notifications")
            .insert([{
              title,
              description,
              type: "payment",
              priority: "medium",
              action_label: "Cek Alokasi",
              link: `/admin/clearing-house`,
              external_id: externalId,
            }])
            .select()
            .single();

          addedAllocations.push(notif);
        }
      }
    }

    // --- AUDIT LOG ---
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "SYSTEM_SYNC",
      module: "NOTIFICATIONS",
      details: "Sinkronisasi otomatis dengan Tilikan API & Banjir Sumatra API berhasil.",
      meta: { 
        reportsSynced: addedReports.length,
        allocationsSynced: addedAllocations.length
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Pro-active sync complete", 
      syncedData: { 
        reports: addedReports.length, 
        allocations: addedAllocations.length,
        notificationsSent: addedReports.length > 0 ? "WA/Email Sent" : "No new triggers"
      } 
    });
  } catch (error: any) {
    console.error("Pro-active Sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
