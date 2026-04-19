"use client";

import React from "react";
import { UserStatus } from "@/lib/types";

interface UserStatusBadgeProps {
  status: UserStatus;
  dict: any;
}

export const UserStatusBadge = ({ status, dict }: UserStatusBadgeProps) => {
  const configs = {
    [UserStatus.ACTIVE]: {
      color: "emerald",
      label: dict?.admin?.status_active || "Aktif",
    },
    [UserStatus.INACTIVE]: {
      color: "slate",
      label: dict?.admin?.status_inactive || "Non-Aktif",
    },
    [UserStatus.SUSPENDED]: {
      color: "rose",
      label: dict?.admin?.status_suspended || "Ditangguhkan",
    },
  };

  const config = configs[status];
  if (!config) return null;

  // Determine dynamic colors based on status
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    slate: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const bulletColorMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    slate: "bg-slate-400 dark:bg-slate-600",
    rose: "bg-rose-500",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] font-display shadow-sm ${colorMap[config.color]}`}
    >
      <div
        className={`size-2 rounded-full animate-pulse shadow-glow-${config.color} ${bulletColorMap[config.color]}`}
      />
      {config.label}
    </div>
  );
};
