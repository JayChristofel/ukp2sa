"use client";

import { apiService } from "@/services/unifiedService";
import { useCallback } from "react";
import { useSession } from "@/stores/authStore";

/**
 * Hook to easily send activities to the Global Audit Trail
 */
export const useAuditLogger = () => {
  const sessionContext = useSession();
  const session = sessionContext?.data;

  const logActivity = useCallback(async (
    action: string,
    module: string,
    details: string,
    level: "info" | "warn" | "error" = "info",
    diff?: any
  ) => {
    const userName = session?.user?.name || "System User"; 

    return apiService.createAuditLog({
      action,
      module,
      details,
      level,
      user: userName,
      diff
    });
  }, [session]);

  return { logActivity };
};
