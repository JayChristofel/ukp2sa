import { create } from "zustand";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  instansiId: string | null;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Fetch session dari API — panggil di root layout */
  fetchSession: () => Promise<void>;
  /** Login via API */
  login: (email: string, password: string, lang?: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  /** Logout via API */
  logout: () => Promise<void>;
  /** Set user data langsung (untuk SSR/initial load) */
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchSession: async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json();

      set({
        user: data.user || null,
        isAuthenticated: data.isAuthenticated || false,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password, lang = "id") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, lang }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login gagal." };
      }

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, redirectUrl: data.redirectUrl };
    } catch {
      return { success: false, error: "Gagal terhubung ke server." };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
}));

/** Shorthand hooks buat pake di komponen */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return {
    user,
    session: user ? { user } : null,
    isAuthenticated,
    isLoading,
    status: isLoading ? "loading" : isAuthenticated ? "authenticated" : "unauthenticated",
  };
};

export const useSession = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return {
    data: user ? { user } : null,
    status: isLoading ? "loading" : isAuthenticated ? "authenticated" : "unauthenticated",
  };
};
