import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

/**
 * GET /api/reports — Public read access (no PII exposed).
 * NIK dan Phone TIDAK di-select — safe buat publik.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
    // Security: Only select PUBLIC fields. Exclude NIK and Phone.
    const { data: reports, error } = await supabase
      .from("reports")
      .select("id, title, description, location, regency, status, category, source, latitude, longitude, images, satellite_intel, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("GET Reports Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/** POST /api/reports — Create new report (protected, wajib login) */
export const POST = secureRoute(async (request: Request) => {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data: newReport, error } = await supabase
      .from("reports")
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    // Audit log
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "CREATE_REPORT",
      module: "REPORTS",
      details: `Laporan baru dibuat: ${newReport.title}`,
      meta: { reportId: newReport.id }
    });
    
    return NextResponse.json({ 
      status: "success", 
      id: newReport.id 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

/** DELETE /api/reports — Remove report + cleanup storage (protected, wajib login) */
export const DELETE = secureRoute(async (request: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Method not allowed on root. ID is required." }, { status: 405 });
    }

    // Cari data laporan buat ambil list gambar
    const { data: report, error: fetchError } = await supabase
      .from("reports")
      .select("images")
      .eq("id", id)
      .single();

    if (fetchError || !report) {
      return NextResponse.json({ error: "Laporan nggak ketemu!" }, { status: 404 });
    }

    // Kalau ada gambar, hapus dari R2 dulu (Storage Cleanup)
    if (report.images && report.images.length > 0) {
      const { deleteFilesFromR2 } = await import("@/lib/r2");
      await deleteFilesFromR2(report.images);
    }

    // Hapus record dari Supabase
    const { error: deleteError } = await supabase
      .from("reports")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Audit log
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "DELETE_REPORT",
      module: "REPORTS",
      details: `Laporan dengan ID ${id} dihapus permanen oleh admin`,
      meta: { reportId: id, filesCleaned: report.images?.length || 0 }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Laporan & semua bukti foto berhasil dihapus permanen!" 
    });
  } catch (error: any) {
    console.error("Delete Report Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
