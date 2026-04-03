"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldOff, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Mapping dari path segment admin ke permission yang dibutuhkan.
 * Kalau path nggak ada di list, default-nya semua user yang udah login boleh akses.
 */
const ROUTE_PERMISSIONS: Record<string, string> = {
  laporan: "reports:read",
  assignments: "tasks:read",
  "clearing-house": "reports:verify",
  financial: "finance:read",
  kpi: "finance:read",
  donor: "finance:read",
  economy: "finance:read",
  users: "users:read",
  roles: "roles:manage",
  "audit-trail": "audit:read",
  settings: "settings:manage",
  intel: "intel:read",
  tracking: "tasks:read",
  blog: "blog:read",
  map: "map:read",
  notifications: "reports:read",
};

/**
 * Role yang boleh masuk admin dashboard (minimal)
 */
const ADMIN_ROLES = ["superadmin", "admin", "operator"];

interface PermissionGuardProps {
  children: React.ReactNode;
}

export default function PermissionGuard({ children }: PermissionGuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Masih loading session — tampilkan spinner
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="size-10 animate-spin mx-auto text-primary" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Verifikasi Akses...
          </p>
        </div>
      </div>
    );
  }

  // Session belum ada tapi user mungkin masih dalam proses hydration
  // Jangan langsung block — biarkan children render dulu
  if (!session?.user) {
    // Cek: kalau status "unauthenticated" = user beneran belum login
    if (status === "unauthenticated") {
      return (
        <AccessDenied
          title="Sesi Habis"
          message="Silakan login kembali untuk melanjutkan."
          onBack={() => router.push("/")}
        />
      );
    }
    // Status lain (undefined/unknown) = masih loading, tampilin children aja
    return <>{children}</>;
  }

  const user = session.user as any;

  // Superadmin bypass semua permission check
  if (user.role === "superadmin") {
    return <>{children}</>;
  }

  // Cek apakah role user boleh masuk admin area
  if (!ADMIN_ROLES.includes(user.role)) {
    return (
      <AccessDenied
        title="Akses Ditolak"
        message={`Role "${user.role}" tidak memiliki akses ke Admin Dashboard.`}
        onBack={() => router.back()}
      />
    );
  }

  // Cek permission spesifik berdasarkan route
  const pathSegments = pathname.split("/").filter(Boolean);
  const adminSegment = pathSegments.find((seg) => ROUTE_PERMISSIONS[seg]);

  if (adminSegment) {
    const requiredPermission = ROUTE_PERMISSIONS[adminSegment];
    const userPermissions: string[] = user.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return (
        <AccessDenied
          title="Izin Tidak Cukup"
          message={`Anda membutuhkan izin "${requiredPermission}" untuk mengakses halaman ini. Hubungi administrator untuk mendapatkan akses.`}
          onBack={() => router.back()}
        />
      );
    }
  }

  // All clear
  return <>{children}</>;
}

/**
 * Komponen Access Denied yang premium
 */
function AccessDenied({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="text-center space-y-8 max-w-lg mx-auto px-6">
        <div className="size-24 rounded-[2.5rem] bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
          <ShieldOff size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
            {title}
          </h2>
          <p className="text-sm text-slate-500 font-bold leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>
    </motion.div>
  );
}
