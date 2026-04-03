import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

/**
 * 🛠️ DEBUG ENDPOINT v2: With Dummy Insert Test
 * Visit: http://localhost:3000/api/auth/debug
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // 1. Fetch all emails to verify table content
    const { data: users, error: listError } = await supabase
      .from("users")
      .select("email, role");

    // 2. Look for the specific admin
    const { data: superadmin, error: findError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", "superadmin@ukp2sa.go.id")
      .single();

    // 3. 🧪 TEST INSERT: If this works and shows up in your dashboard, connection is 100% OK.
    const testEmail = `debug-${Math.floor(Math.random() * 1000)}@test.com`;
    const { data: insert, error: insertError } = await supabase
      .from("users")
      .insert({
        email: testEmail,
        name: "Connection Tester",
        role: "public"
      })
      .select()
      .single();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        totalFound: users?.length || 0,
        availableEmails: users?.map(u => u.email) || [],
        superadminStatus: {
          exists: !!superadmin,
          email: superadmin?.email || "NOT_FOUND"
        },
        connectionTest: {
          attemptedEmail: testEmail,
          success: !!insert,
          insertedData: insert || null,
          error: insertError?.message
        }
      },
      errors: {
        list: listError?.message,
        find: findError?.message
      }
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: "Critical Crash", 
      message: err.message || "Unknown Error"
    }, { status: 500 });
  }
}
