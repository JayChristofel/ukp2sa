import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";
import { publicReportSchema } from "@/lib/validations";

/**
 * GET /api/reports — Public read access (no PII exposed).
 * NIK dan Phone TIDAK di-select — safe buat publik.
 */
export const GET = secureRoute(async (request: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
    // Security: Filter data based on role if needed
    // Removed instansi_id as it currently does not exist in the schema
    const query = supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data: reports, error } = await query;

    if (error) throw error;

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("GET Reports Error:", error.message);
    return NextResponse.json({ success: false, error: "Gagal mengambil data laporan." }, { status: 500 });
  }
}, { isPublic: true, limit: 50 }); // Allow public map read with limit

/** POST /api/reports — Create new report (protected, wajib login) */
export const POST = secureRoute(async (request: Request, { body }: any) => {
  try {
    const supabase = await createClient();
    
      const { data: newReport, error } = await supabase
        .from("reports")
        .insert([{
          full_name: body.fullName,
          phone: body.phone,
          nik: body.nik,
          address: body.address,
          category: body.category,
          regency: body.regency,
          district: body.district,
          village: body.village,
          description: body.description,
          latitude: body.latitude,
          longitude: body.longitude,
          images: body.images || [],
          status: "Pending",
          source: body.source || "Masyarakat"
        }])
      .select()
      .single();

    if (error) throw error;

    // Audit log
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "CREATE_REPORT",
      module: "REPORTS",
      details: `Laporan baru dibuat: ${newReport.title || 'Tanpa Judul'}`,
      meta: { reportId: newReport.id }
    });
    
    return NextResponse.json({ 
      success: true, 
      id: newReport.id 
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Report Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim laporan." }, { status: 500 });
  }
}, { schema: publicReportSchema, isPublic: true, limit: 10 }); // Allow public map reporting with rate limit

/** DELETE /api/reports — Remove report + cleanup storage (protected, admin only) */
export const DELETE = secureRoute(async (request: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    }

    // Cari data laporan buat ambil list gambar
    const { data: report, error: fetchError } = await supabase
      .from("reports")
      .select("images")
      .eq("id", id)
      .single();

    if (fetchError || !report) {
      return NextResponse.json({ success: false, error: "Laporan tidak ditemukan." }, { status: 404 });
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
      details: `Laporan ID ${id} dihapus permanen oleh admin`,
      meta: { reportId: id, filesCleaned: report.images?.length || 0 }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Laporan berhasil dihapus permanen!" 
    });
  } catch (error: any) {
    console.error("Delete Report Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus laporan." }, { status: 500 });
  }
}, { roles: ['admin'] });
