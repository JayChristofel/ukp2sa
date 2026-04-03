import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") || "ukp2sa-reports";
    
    if (!files.length) {
      return NextResponse.json({ error: "Gak ada file yang di-upload, Bos!" }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      // 1. Validasi Extension/MIME yang Halal ditaruh di R2 (Hindari XSS File poisoning kayak .svg / .html)
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Extensi file haram/tidak lolos standar keamanan!" }, { status: 400 });
      }

      // 2. Sanitasi & Enkripsi Nama File (Buang nama aslinya, pakai Random UUID tulen)
      const buffer = Buffer.from(await file.arrayBuffer());
      const crypto = require("crypto");
      
      const ext = file.name.split('.').pop()?.substring(0, 4) || 'bin'; 
      const finalFileName = `${crypto.randomUUID()}.${ext}`;
      
      const key = `${folder}/${finalFileName}`;
      const bucketName = process.env.R2_BUCKET_NAME;

      // 2. Eksekusi upload ke R2 Bucket
      await r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key, 
        Body: buffer,
        ContentType: file.type,
      }));

      // 3. Generate CDN URL (Bisa dapet dari subdomain Custom yang di-point ke R2)
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
