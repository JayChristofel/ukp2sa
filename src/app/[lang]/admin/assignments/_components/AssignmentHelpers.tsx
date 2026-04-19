"use client";

import React from "react";
import { Building2, Users, ShieldCheck, Heart, ClipboardList } from "lucide-react";
import { TaskStatus } from "@/lib/types";

export const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "K/L":
      return <Building2 size={16} />;
    case "Pemda":
      return <Users size={16} />;
    case "Satgas":
      return <ShieldCheck size={16} />;
    case "NGO":
      return <Heart size={16} />;
    default:
      return <ClipboardList size={16} />;
  }
};

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    case "Assigned":
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "En Route":
      return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
    case "On Site":
      return "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
    case "Resolved":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Escalated":
      return "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export const getProgressColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === "sar") return "bg-blue-500 shadow-[0_0_10px_#3b82f6]";
  if (cat === "logistik") return "bg-emerald-500 shadow-[0_0_10px_#10b981]";
  if (cat === "keamanan") return "bg-rose-500 shadow-[0_0_10px_#f43f5e]";
  return "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]";
};

export const getProgressTextColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === "keamanan") return "text-rose-500";
  if (cat === "logistik") return "text-emerald-500";
  if (cat === "sar") return "text-blue-500";
  return "text-primary";
};
