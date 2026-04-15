import { NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * POST /api/upload — Multi-file upload ke R2 Bucket menggunakan Cloudflare API v4.
 * Menggunakan native fetch (Zero-SDK) untuk optimasi bundle size.
 */
export async function POST(request: Request) {
  try {
    // --- AUTH CHECK ---
    let sessionUser = null;

    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      sessionUser = verifyJWT(token);
    }

    if (!sessionUser) {
      const cookieStore = await cookies();
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        sessionUser = verifyJWT(token);
      }
    }

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- PARSE FORM DATA ---
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    // Sanitasi nama folder (hanya izinkan alphanumeric dan dash)
    const rawFolder = (formData.get("folder") as string) || "ukp2sa-reports";
    const folder = rawFolder.replace(/[^a-zA-Z0-9-]/g, "");
    
    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // --- R2 CONFIG ---
    const endpoint = process.env.R2_ENDPOINT || "";
    // Ekstrak Account ID dari endpoint: https://<account_id>.r2.cloudflarestorage.com
    const accountIdMatch = endpoint.match(/https:\/\/(.+)\.r2/);
    const accountId = accountIdMatch ? accountIdMatch[1] : "83af379993f439654a1dbf07d9666bea";
    
    const bucketName = process.env.R2_BUCKET_NAME;
    const apiToken = process.env.R2_TOKEN_VALUE;
    const cdnDomain = process.env.R2_CDN_DOMAIN?.replace(/\/$/, "");

    if (!apiToken || !bucketName || !cdnDomain) {
      console.error("[UPLOAD] Configuration Error: Missing R2 env variables");
      return NextResponse.json({ error: "Storage configuration invalid" }, { status: 500 });
    }

    const uploadedUrls = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    for (const file of files) {
      // 1. Validasi MIME Type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 });
      }

      // 2. Persiapan Data (Crypto & Key)
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const finalFileName = `${crypto.randomUUID()}.${ext}`;
      const key = `${folder}/${finalFileName}`;

      console.log(`[UPLOAD] Processing: ${key} (${file.type})`);

      // 3. Native Fetch PUT Command ke R2 API v4
      const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(key)}`;
      
      const uploadResp = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": file.type,
        },
        body: buffer,
      });

      if (!uploadResp.ok) {
        const errData = await uploadResp.json().catch(() => ({}));
        console.error(`[UPLOAD] Cloudflare Error:`, errData);
        return NextResponse.json({ 
          success: false, 
          error: `Failed to store file: ${file.name}` 
        }, { status: 502 });
      }

      // 4. Koleksi URL
      uploadedUrls.push(`${cdnDomain}/${key}`);
    }

    return NextResponse.json({ 
      success: true,
      count: uploadedUrls.length,
      urls: uploadedUrls 
    });

  } catch (error: any) {
    console.error("[UPLOAD] Fatal Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error during upload" 
    }, { status: 500 });
  }
}
