import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

export const GET = secureRoute(async () => {
  try {
    const supabase = await createClient();
    const { data: topics, error } = await supabase
      .from('topics')
      .select('id, name_id, name_en, count')
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
    console.error("Topics API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data topik aduan." }, { status: 500 });
  }
}, { isPublic: true, limit: 50 });
