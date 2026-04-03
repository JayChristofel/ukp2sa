import { NextResponse } from "next/server";
import { SyncManager } from "@/services/SyncManager";

/**
 * API Endpoint to trigger background sync.
 * Recommended to be called via cPanel Cron Job:
 * curl -X GET https://your-domain.com/api/sync?key=YOUR_SECRET_KEY
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Basic security to prevent public abuse
  if (key !== process.env.SYNC_KEY && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 [Cron] Starting manual sync trigger...");
    
    // We run this without await to prevent gateway timeout if there's a lot of data,
    // though for cPanel it's better to keep it synchronous if the cron waits.
    // Let's keep it synchronous for now so we can return the result.
    await SyncManager.runAllSync();
    
    return NextResponse.json({ 
      success: true, 
      message: "Sync completed successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("❌ [Cron Error]:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
