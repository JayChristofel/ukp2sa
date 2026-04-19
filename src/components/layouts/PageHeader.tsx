"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * PageHeader - Unified header component for all admin and portal pages.
 * Supports titles with mixed styles, subtitles with icons, and action slots.
 */
export const PageHeader = ({
  title,
  subtitle,
  description,
  actions,
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6", className)}>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tight uppercase">
            {title}
          </h1>
          {children}
        </div>
        
        {subtitle && (
          <div className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            {subtitle}
          </div>
        )}
        
        {description && (
          <p className="text-slate-500 max-w-lg text-sm md:text-base leading-relaxed mt-2">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
