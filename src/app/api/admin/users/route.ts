import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";
import { userAdminSchema } from "@/lib/validations/apiSchemas";

/** GET /api/admin/users — Fetch user list or single user by ID */
const getHandler = async (req: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    // Fetch single user by ID
    const userId = searchParams.get("id");
    if (userId) {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !user) {
        return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({
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
    const role = searchParams.get("role") || "";
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq("role", role);
    }

    const { data: users, count, error: fetchError } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (fetchError) throw fetchError;

    return NextResponse.json({
      data: (users || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        avatar: u.avatar || null,
        createdAt: u.created_at,
      })),
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Users API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/** DELETE /api/admin/users — Remove user by ID */
const deleteHandler = async (req: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/** PATCH /api/admin/users — Update user data by ID */
const patchHandler = async (req: Request, { body }: any) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { name, email, role, status } = body;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ name, email, role, status })
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Semua handler dibungkus secureRoute — wajib token + role admin/presiden
export const GET = secureRoute(getHandler);
export const DELETE = secureRoute(deleteHandler);
export const PATCH = secureRoute(patchHandler, { schema: userAdminSchema });
