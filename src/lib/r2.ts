import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Singleton R2 (S3-Compatible) Client
 * Digunakan untuk Upload & Hapus file dari Cloudflare R2
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Helper buat nge-parse Key (path file) dari CDN URL
 * Contoh: https://cdn.id/folder/file.jpg -> folder/file.jpg
 */
export function getR2KeyFromUrl(url: string): string | null {
  try {
    const cdnDomain = process.env.R2_CDN_DOMAIN?.replace(/\/$/, "");
    if (!cdnDomain || !url.startsWith(cdnDomain)) return null;
    
    // Hapus domain + trailing slash awal
    return url.replace(cdnDomain, "").replace(/^\//, "");
  } catch {
    return null;
  }
}

/**
 * Hapus beneran file dari R2
 */
export async function deleteFilesFromR2(urls: string[]) {
  const bucketName = process.env.R2_BUCKET_NAME;
  
  for (const url of urls) {
    const key = getR2KeyFromUrl(url);
    if (!key) continue;

    console.log(`[CLEANUP] Deleting: ${key}`);
    try {
      await r2Client.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }));
    } catch (err) {
      console.error(`[ERROR] Gagal hapus ${key}:`, err);
    }
  }
}
