import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';
import { secureRoute } from '@/lib/api-middleware';

/** GET /api/admin/permissions — Fetch all permissions grouped by module */
const getHandler = async () => {
  try {
    const supabase = await createClient();
    const { data: permissions, error } = await supabase
      .from('permissions')
      .select('id, name, description, module')
      .order('module', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    
    // Grouping logic
    const groups = (permissions || []).reduce((acc: any, curr: any) => {
      const moduleName = curr.module || 'Lainnya';
      if (!acc[moduleName]) acc[moduleName] = [];
      acc[moduleName].push({ 
        id: curr.id, 
        name: curr.name, 
        description: curr.description,
        module: moduleName
      });
      return acc;
    }, {});

    const formattedGroups = Object.keys(groups).map(name => ({
      name,
      permissions: groups[name]
    }));

    return NextResponse.json({ data: formattedGroups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/** DELETE /api/admin/permissions — Remove Permission */
const deleteHandler = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Permission ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// Semua handler admin permissions wajib token valid + role admin
export const GET = secureRoute(getHandler, { role: 'admin', limit: 20 });
export const POST = secureRoute(async (req: Request, { body }: any) => {
  try {
    const { id, name, module, description } = body;

    if (!id || !name || !module) {
      return NextResponse.json({ success: false, error: "ID, Name, and Module are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: permission, error } = await supabase
      .from('permissions')
      .upsert({ 
        id, 
        name, 
        module, 
        description,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: permission });
  } catch (error: any) {
    console.error("Save Permission Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan data izin akses." }, { status: 500 });
  }
}, { role: 'admin' });

export const DELETE = secureRoute(deleteHandler, { role: 'admin' });
