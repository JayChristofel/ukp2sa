"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const FormSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    {title && (
      <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-navy dark:text-white ml-2 opacity-70">
        {icon} {title}
      </label>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  </div>
);

export const FormField = ({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-3.5", className)}>
    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-navy dark:text-white ml-2 opacity-70">
      {icon} {label}
    </label>
    {children}
  </div>
);

export const AdminInput = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-bold shadow-inner dark:text-white",
      props.className,
    )}
  />
);

export const AdminSelect = ({
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={cn(
      "w-full bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-bold dark:text-white cursor-pointer shadow-inner",
      props.className,
    )}
  />
);

export const AdminTextArea = ({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={cn(
      "w-full bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-2xl px-6 py-5 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-bold min-h-[160px] resize-none shadow-inner leading-relaxed dark:text-white",
      props.className,
    )}
  />
);
