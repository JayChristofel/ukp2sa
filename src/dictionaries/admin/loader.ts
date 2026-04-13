import 'server-only';

/**
 * Admin Dictionary Loader (Server-Only).
 *
 * File ini HANYA bisa di-import dari Server Component atau API Route.
 * Import dari Client Component akan langsung error berkat 'server-only' guard.
 *
 * Ini mitigasi VULN-004: admin strings gak akan pernah masuk ke public HTML bundle.
 */

const adminDictionaries: Record<string, () => Promise<any>> = {
  id: () => import('@/dictionaries/admin/id.json').then((m) => m.default),
  en: () => import('@/dictionaries/admin/id.json').then((m) => m.default), // Fallback ke ID dulu
};

export async function getAdminDictionary(locale: string = 'id') {
  const loader = adminDictionaries[locale] || adminDictionaries['id'];
  return loader();
}
