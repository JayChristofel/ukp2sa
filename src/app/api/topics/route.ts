import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: topics, error } = await supabase
      .from('topics')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;

    // Mapping back to the expected frontend format if necessary
    const formattedTopics = topics?.map(t => ({
      id: t.id,
      name: { 
        id: t.name_id, 
        en: t.name_en 
      },
      count: t.count || 0
    }));

    return NextResponse.json({
      success: true,
      data: formattedTopics
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
