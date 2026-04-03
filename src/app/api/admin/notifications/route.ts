import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";
import { notificationSchema } from "@/lib/validations/apiSchemas";

// --- GET (Protected) ---
const getHandler = async (req: Request, { session }: any) => {
  const supabase = await createClient();
  const userId = session?.user?.id || session?.user?.email || "anonymous";

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const formattedNotifs = (notifications || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    type: n.type,
    priority: n.priority,
    actionLabel: n.action_label,
    link: n.link,
    status: (n.read_by || []).includes(userId) ? "read" : "unread",
    date: new Date(n.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: new Date(n.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  }));

  return NextResponse.json({ success: true, data: formattedNotifs });
};

// --- POST (Protected + Schema Validated) ---
const postHandler = async (req: Request, { body }: any) => {
  const supabase = await createClient();
  const { title, description, type, priority, actionLabel, link, externalId } = body;

  const { data: existing } = externalId ? 
    await supabase.from('notifications').select('*').eq('external_id', externalId).single() : 
    { data: null };

  if (existing) {
    return NextResponse.json({ success: true, message: "Duplicate bypassed", data: existing });
  }

  const { data: newNotif, error } = await supabase
    .from('notifications')
    .insert([
      {
        title,
        description,
        type,
        priority,
        action_label: actionLabel,
        link,
        external_id: externalId,
        read_by: [],
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ success: true, data: newNotif });
};

// --- PATCH (Protected) ---
const patchHandler = async (req: Request, { session }: any) => {
  const supabase = await createClient();
  const body = await req.json().catch(() => ({}));
  const { action, notificationId } = body;
  const userId = session?.user?.id || session?.user?.email || "anonymous";

  if (action === "mark_all_read") {
    // In Postgres, we can append to array if not exists
    // We'll use a raw query or fetch and update for each if needed, 
    // but for "mark all", simpler to update where and use array_append
    const { error } = await supabase.rpc('mark_all_notifications_read', { user_id: userId });
    
    // Fallback if RPC not defined:
    if (error) {
       // Manual approach
       const { data: unread } = await supabase.from('notifications').select('id, read_by');
       for (const n of (unread || [])) {
         if (!n.read_by.includes(userId)) {
           await supabase.from('notifications').update({ read_by: [...n.read_by, userId] }).eq('id', n.id);
         }
       }
    }
    
    return NextResponse.json({ success: true, message: "All marked as read" });
  }

  if (action === "mark_read" && notificationId) {
    const { data: current } = await supabase.from('notifications').select('read_by').eq('id', notificationId).single();
    if (current && !current.read_by.includes(userId)) {
      await supabase.from('notifications').update({ read_by: [...current.read_by, userId] }).eq('id', notificationId);
    }
    return NextResponse.json({ success: true, message: "Marked as read" });
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
};

// --- DELETE (Protected) ---
const deleteHandler = async (req: Request) => {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const clearAll = searchParams.get("clearAll") === "true";

  if (clearAll) {
    const { error } = await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
    return NextResponse.json({ success: true, message: "All cleared" });
  }

  if (id) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Deleted" });
  }

  return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
};

export const GET = secureRoute(getHandler);
export const POST = secureRoute(postHandler, { schema: notificationSchema });
export const PATCH = secureRoute(patchHandler);
export const DELETE = secureRoute(deleteHandler);
