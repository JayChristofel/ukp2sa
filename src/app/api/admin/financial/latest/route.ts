import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

/** GET /api/admin/financial/latest — Fetch latest financial payment records */
const getHandler = async () => {
  try {
    const supabase = await createClient();
    
    const { data: records, error } = await supabase
      .from('financial_records')
      .select('*')
      .not('payment_status', 'is', null)
      .order('last_update', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = secureRoute(getHandler);
