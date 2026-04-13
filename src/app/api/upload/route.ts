import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { verifyJWT, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { cookies } from "next/headers";

/**
 * POST /api/upload — File upload ke R2 Bucket.
 * Protected: Wajib login.
 *
 * Catatan: Gak bisa pake secureRoute karena handler butuh FormData, bukan JSON.
 * Jadi kita implement auth check manual (same logic as secureRoute).
 */
export async function POST(request: Request) {
  try {
    // --- AUTH CHECK (manual karena FormData, bukan JSON body) ---
    let sessionUser = null;

    // Cek header Authorization (Mobile) dulu
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      sessionUser = verifyJWT(token);
    }

    // Kalo gak ada lewat header, cek lewat cookie (Web)
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
    // --- END AUTH CHECK ---

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") || "ukp2sa-reports";
    
    if (!files.length) {
      return NextResponse.json({ error: "Gak ada file yang di-upload, Bos!" }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      // Validasi Extension/MIME — hindari XSS file poisoning (.svg / .html)
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Extensi file haram/tidak lolos standar keamanan!" }, { status: 400 });
      }

      // Sanitasi & Enkripsi Nama File (Random UUID, buang nama asli)
      const buffer = Buffer.from(await file.arrayBuffer());
      const crypto = require("crypto");
      
      const ext = file.name.split('.').pop()?.substring(0, 4) || 'bin'; 
      const finalFileName = `${crypto.randomUUID()}.${ext}`;
      
      const key = `${folder}/${finalFileName}`;
      const bucketName = process.env.R2_BUCKET_NAME;

      // Upload ke R2 Bucket
      await r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key, 
        Body: buffer,
        ContentType: file.type,
      }));

      // Generate CDN URL
      const cdnDomain = process.env.R2_CDN_DOMAIN?.replace(/\/$/, "");
      uploadedUrls.push(`${cdnDomain}/${key}`);
    }

    return NextResponse.json({ 
      success: true,
      urls: uploadedUrls 
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Gagal upload!" 
    }, { status: 500 });
  }
}
