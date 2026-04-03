"use client";

import React from "react";
import {
  Database,
  Zap,
  Smartphone,
  Wifi,
  Users,
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ReportStatus, ReporterType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const SourceBadge = ({ source }: { source: string }) => {
  const configs: Record<string, { icon: React.ReactNode; color: string }> = {
    rest: { icon: <Database size={10} />, color: "blue" },
    graphql: { icon: <Zap size={10} />, color: "pink" },
    mobile: { icon: <Smartphone size={10} />, color: "emerald" },
    satellite: { icon: <Wifi size={10} />, color: "indigo" },
  };
  const config = configs[source] || configs.rest;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-tighter",
        `bg-${config.color}-500/10 text-${config.color}-500 border-${config.color}-500/20`,
      )}
    >
      {config.icon}
      {source}
    </div>
  );
};

export const ReporterBadge = ({ type }: { type: ReporterType }) => {
  const configs: Record<
    ReporterType,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    masyarakat: {
      icon: <Users size={10} />,
      color: "slate",
      label: "Masyarakat",
    },
    pemerintah: {
      icon: <Building2 size={10} />,
      color: "amber",
      label: "Pemerintah",
    },
    admin: {
      icon: <ShieldCheck size={10} />,
      color: "rose",
      label: "Admin",
    },
    partner: { icon: <Zap size={10} />, color: "indigo", label: "Partner" },
    ngo: { icon: <Users size={10} />, color: "green", label: "NGO" },
  };

  const config = configs[type] || configs.masyarakat;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
        `bg-${config.color}-500/10 text-${config.color}-500 border-${config.color}-500/20`,
      )}
    >
      {config.icon}
      {config.label}
    </div>
  );
};

export const StatusBadge = ({
  status,
  variant = "text",
}: {
  status: ReportStatus;
  variant?: "text" | "pill";
}) => {
  const configs = {
    [ReportStatus.PROCESS]: {
      icon: <Clock size={status === ReportStatus.PROCESS ? 12 : 16} />,
      color: "amber",
      label: "Diproses",
    },
    [ReportStatus.DONE]: {
      icon: <CheckCircle2 size={status === ReportStatus.PROCESS ? 12 : 16} />,
      color: "emerald",
      label: "Selesai",
    },
    [ReportStatus.PENDING]: {
      icon: <AlertCircle size={status === ReportStatus.PROCESS ? 12 : 16} />,
      color: "rose",
      label: "Menunggu",
    },
  };
  const config = configs[status];

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest",
          `bg-${config.color}-500/10 text-${config.color}-500 border-${config.color}-500/20`,
        )}
      >
        {config.icon}
        {config.label}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-bold text-xs",
        `text-${config.color}-500`,
      )}
    >
      {config.icon}
      {config.label}
    </div>
  );
};
