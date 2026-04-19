import { NextResponse } from "next/server";
import { syncService } from "@/services/syncService";

/**
 * GET /api/cron/sync
 * Manually triggered or scheduled background synchronization from external APIs.
 * Protected by SYNC_KEY to prevent unauthorized access.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Verify sync key for security
  if (token !== process.env.SYNC_KEY) {
    return NextResponse.json(
      { error: "Unauthorized access detected." },
      { status: 401 }
    );
  }

  try {
    console.log("🚀 Starting scheduled background synchronization...");
    const result = await syncService.syncExternalData();

    if (result.success) {
      return NextResponse.json({
        message: "Synchronization completed successfully.",
        synced: result.synced,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } else {
      throw result.error;
    }
  } catch (error: any) {
    console.error("❌ Background synchronization failed:", error);
    return NextResponse.json(
      { 
        error: "Synchronization process failed.", 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}
