import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";
import { userAdminSchema } from "@/lib/validations/apiSchemas";

/** GET /api/admin/users — Fetch user list or single user by ID with isolation */
const getHandler = async (req: Request, { session }: any) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const isPartner = session.user.role === 'partner';
    const instansiId = session.user.instansiId;

    // Fetch single user by ID
    const userId = searchParams.get("id");
    if (userId) {
      let query = supabase.from("users").select("id, name, email, role, status, avatar, instansi_id, created_at").eq("id", userId);
      
      // Isolation: Partner cuma bisa liat user di instansi mereka
      if (isPartner && instansiId) {
        query = query.eq('instansi_id', instansiId);
      }

      const { data: user, error } = await query.single();

      if (error || !user) {
        return NextResponse.json({ success: false, error: "User tidak ditemukan atau akses dilarang." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar || null,
          instansiId: user.instansi_id || null,
          createdAt: user.created_at,
        },
      });
    }

    // Fetch paginated list
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "";
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("users").select("id, name, email, role, status, avatar, instansi_id, created_at", { count: "exact" });

    // Isolation: Admin liat semua, Partner cuma liat instansi mereka
    if (isPartner && instansiId) {
      query = query.eq('instansi_id', instansiId);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (roleFilter) {
      query = query.eq("role", roleFilter);
    }

    const { data: users, count, error: fetchError } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (fetchError) throw fetchError;

    return NextResponse.json({
      success: true,
      data: (users || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        avatar: u.avatar || null,
        instansiId: u.instansi_id,
        createdAt: u.created_at,
      })),
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Users GET Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data user." }, { status: 500 });
  }
};

/** DELETE /api/admin/users — Admin only */
const deleteHandler = async (req: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus user." }, { status: 500 });
  }
};

/** PATCH /api/admin/users — Update user with isolation & guard */
const patchHandler = async (req: Request, { body, session }: any) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const { name, email, role, status } = body;
    const isPartner = session.user.role === 'partner';

    // 1. Cek User Exist + Isolation
    let checkQuery = supabase.from("users").select("role, instansi_id").eq("id", id);
    if (isPartner && session.user.instansiId) {
      checkQuery = checkQuery.eq('instansi_id', session.user.instansiId);
    }
    const { data: targetUser } = await checkQuery.single();

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan atau berada di luar otoritas Anda." }, { status: 404 });
    }

    // 2. Prevent Escalation (Partner gak boleh promote jadi Admin)
    if (isPartner && role === 'admin') {
      return NextResponse.json({ success: false, error: "Anda tidak memiliki izin untuk menetapkan role Admin." }, { status: 403 });
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ name, email, role, status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui data user." }, { status: 500 });
  }
};

// Semua handler dibungkus secureRoute
export const GET = secureRoute(getHandler, { roles: ['admin', 'partner'] });
export const DELETE = secureRoute(deleteHandler, { role: 'admin' });
export const PATCH = secureRoute(patchHandler, { 
  schema: userAdminSchema, 
  roles: ['admin', 'partner'] 
});
