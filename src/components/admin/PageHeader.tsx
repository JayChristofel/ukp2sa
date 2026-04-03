"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  isLive?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
  isLive,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {icon && <div className="text-primary-500">{icon}</div>}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white tracking-tight uppercase">
            {title}
          </h1>
          {isLive && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-full">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Live Monitoring
              </span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 font-bold text-base md:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="w-full lg:w-auto">{action}</div>}
    </div>
  );
};
