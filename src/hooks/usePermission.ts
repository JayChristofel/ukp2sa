import { useSession } from "next-auth/react";

/**
 * Hook untuk mengecek permission di Client Component
 * 
 * Usage:
 *   const { can, canAny, canAll } = usePermission();
 *   if (can('reports:verify')) { ... }
 *   if (canAny(['reports:read', 'reports:edit'])) { ... }
 */
export function usePermission() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const permissions: string[] = user?.permissions || [];
  const role = user?.role || "";

  // Superadmin bypass
  const isSuperAdmin = role === "superadmin";

  const can = (permission: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const canAny = (perms: string[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return perms.some(p => permissions.includes(p));
  };

  const canAll = (perms: string[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return perms.every(p => permissions.includes(p));
  };

  return { can, canAny, canAll, role, isSuperAdmin, permissions };
}

/**
 * Server-side permission check
 */
export async function checkServerPermission(user: any, permission: string) {
  if (!user) return false;
  if (user.role === "superadmin") return true;
  const userPermissions = user.permissions || [];
  return userPermissions.includes(permission);
}
