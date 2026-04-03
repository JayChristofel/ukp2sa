import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch latest 5 records that have any payment status update
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
}
