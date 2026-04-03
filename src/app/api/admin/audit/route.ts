import { NextResponse } from "next/server";
import { secureRoute } from "@/lib/api-middleware";
import { auditSchema } from "@/lib/validations/apiSchemas";
import { createClient } from "@/lib/server";
import { recordAudit } from "@/lib/audit";

export const POST = secureRoute(async (req: Request, { body, session }: any) => {
  try {
    const { action, module, details, level = "info", user, ip, ua, diff } = body;

    // Auth context from session (High Security)
    const logUser = user || session?.user?.email || "anonymous";
    const logIp = ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    const logUa = ua || req.headers.get("user-agent") || "unknown";

    await recordAudit({
      action,
      module,
      details,
      level,
      user_email: logUser,
      user_name: session?.user?.name || "anonymous",
      ip: logIp,
      ua: logUa,
      diff,
    });

    return NextResponse.json({ success: true, message: "Audit trace recorded" });
  } catch (error: any) {
    console.error("Audit post failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}, { schema: auditSchema });

export const GET = secureRoute(async (req: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userFilter = searchParams.get("user");
    const moduleFilter = searchParams.get("module")?.split(",");
    const levelFilter = searchParams.get("level")?.split(",");
    
    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" });

    // Filtering
    if (userFilter) {
      query = query.ilike("user_email", `%${userFilter}%`);
    }
    if (moduleFilter && moduleFilter.length > 0 && moduleFilter[0] !== "") {
      query = query.in("module", moduleFilter);
    }
    if (levelFilter && levelFilter.length > 0 && levelFilter[0] !== "") {
      query = query.in("level", levelFilter);
    }

    const { data: logs, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error("Audit fetch failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
