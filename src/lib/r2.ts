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
 * Hapus beneran file dari R2 menggunakan Cloudflare API v4 (Fetch)
 * Tidak memerlukan AWS SDK sehingga menghemat bundle size.
 */
export async function deleteFilesFromR2(urls: string[]) {
  const accountId = "83af379993f439654a1dbf07d9666bea";
  const bucketName = process.env.R2_BUCKET_NAME;
  const apiToken = process.env.R2_TOKEN_VALUE;
  
  if (!apiToken) {
    console.warn("[CLEANUP] R2_TOKEN_VALUE tidak ditemukan. Deletion skipped.");
    return;
  }

  for (const url of urls) {
    const key = getR2KeyFromUrl(url);
    if (!key) continue;

    console.log(`[CLEANUP] Deleting via API: ${key}`);
    try {
      const resp = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(key)}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(JSON.stringify(errData));
      }
      
      console.log(`[CLEANUP] Success deleted: ${key}`);
    } catch (err) {
      console.error(`[ERROR] Gagal hapus ${key} via API:`, err);
    }
  }
}
