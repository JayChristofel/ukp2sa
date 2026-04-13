import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

/** GET /api/admin/roles — Fetch all roles */
const getHandler = async () => {
  try {
    const supabase = await createClient();
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;

    return NextResponse.json({
      data: (roles || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: r.permissions || [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    });
  } catch (error: any) {
    console.error("Roles API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/** DELETE /api/admin/roles — Remove role by ID */
const deleteHandler = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Role Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/** POST /api/admin/roles — Create or Update role */
const postHandler = async (req: Request) => {
  try {
    const body = await req.json();
    const { id, name, description, permissions } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and Name are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: updatedRole, error } = await supabase
      .from('roles')
      .upsert({ 
        id, 
        name, 
        description, 
        permissions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: updatedRole });
  } catch (error: any) {
    console.error("Save Role Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Semua handler admin roles wajib token valid
export const GET = secureRoute(getHandler);
export const DELETE = secureRoute(deleteHandler);
export const POST = secureRoute(postHandler);
