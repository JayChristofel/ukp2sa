import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

/** GET /api/admin/blog — Fetch blog posts for admin management panel */
const getHandler = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    let query = supabase
      .from('public_updates')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,category.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: posts, count, error } = await query
      .order('publish_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalItems = count || 0;

    return NextResponse.json({
      data: (posts || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        summary: p.summary,
        content: p.content,
        category: p.category,
        publishDate: p.publish_date,
        author: p.author,
        image: p.image || null,
        tags: p.tags || [],
        views: p.views || 0,
      })),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Blog API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = secureRoute(getHandler);
