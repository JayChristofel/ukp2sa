"use client";

import React, { createContext, useContext } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Export hook helper with custom isDark & toggleTheme for backward compatibility
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return { 
    theme, 
    setTheme, 
    resolvedTheme, 
    isDark, 
    toggleTheme 
  };
};

// Initialize QueryClient
const queryClient = new QueryClient();

import { useSession, SessionProvider } from "next-auth/react";

// --- Auth Context Wrapper ---
export const useAuth = () => {
  const { data: session, status } = useSession();
  return { 
    session, 
    user: session?.user, 
    isAuthenticated: status === "authenticated", 
    isLoading: status === "loading" 
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <I18nContext.Provider value={dict}>
          {children}
        </I18nContext.Provider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
