import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

export const GET = secureRoute(async (req: Request, { session }: any) => {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('financial_records')
      .select('*') // Reverting to * temporarily to avoid "column does not exist"
      .not('payment_status', 'is', null)
      .order('last_update', { ascending: false })
      .limit(20);

    // Multi-tenancy isolation
    if (session.user.role !== 'admin' && session.user.instansiId) {
      query = query.eq('instansi_id', session.user.instansiId);
    }

    const { data: records, error } = await query;

    if (error) throw error;

    return NextResponse.json(records);
  } catch (error: any) {
    console.error("Financial API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data finansial." }, { status: 500 });
  }
}, { roles: ['admin', 'partner', 'operator'], limit: 30 });
