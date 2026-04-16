"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

// Re-export auth hooks biar gak perlu ganti import di banyak file
export { useAuth, useSession } from "@/stores/authStore";

export const useTheme = () => {
  const themeContext = useNextTheme();
  
  const isDark = themeContext?.resolvedTheme === "dark";
  const toggleTheme = () => themeContext?.setTheme(isDark ? "light" : "dark");

  return { 
    ...themeContext,
    isDark, 
    toggleTheme 
  };
};

// Initialize QueryClient
const queryClient = new QueryClient();

/** Auth Initializer — fetch session sekali saat app mount */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return <>{children}</>;
}

// --- i18n Context ---
const I18nContext = createContext<any>(null);
export const useI18n = () => useContext(I18nContext);

// --- Root Provider ---
export function Providers({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict?: any;
}) {
  return (
    <AuthInitializer>
      <QueryClientProvider client={queryClient}>
        <I18nContext.Provider value={dict}>
          {children}
        </I18nContext.Provider>
      </QueryClientProvider>
    </AuthInitializer>
  );
}
