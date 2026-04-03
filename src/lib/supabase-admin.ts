import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client — Tanpa cookies, tanpa session browser.
 * 
 * Dipakai khusus untuk operasi server-side yang BUKAN dalam konteks
 * Server Component / Route Handler (contoh: NextAuth authorize callback).
 * 
 * Client ini aman dipanggil dari mana saja karena dia gak bergantung
 * pada `cookies()` dari next/headers yang sering gagal di production cPanel.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ [Supabase Admin] URL atau Key KOSONG di environment!");
    throw new Error("Supabase configuration missing. Check your .env file.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
