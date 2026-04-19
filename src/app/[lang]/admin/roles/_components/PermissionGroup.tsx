"use client";

import React from "react";
import { Lock, Edit2, Trash2 } from "lucide-react";

interface PermissionGroupProps {
  group: any;
  searchQuery: string;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
}

export const PermissionGroup = ({
  group,
  searchQuery,
  onEdit,
  onDelete,
}: PermissionGroupProps) => {
  const filteredPermissions = group.permissions.filter(
    (p: any) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.name || p.label || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (searchQuery && filteredPermissions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-navy rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl h-fit">
      <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {group.name}
            </h3>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Grup Akses Modul
            </p>
          </div>
        </div>
        <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
          {filteredPermissions.length} Izin
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredPermissions.map((p: any) => (
          <div
            key={p.id}
            className="group/item flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all font-display"
          >
            <div className="flex items-center gap-5">
              <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-black text-primary font-mono shadow-sm">
                {p.id}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-tight text-navy dark:text-white">
                  {p.name || p.label}
                </p>
                {p.description && (
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5 line-clamp-1">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-all">
              <button
                onClick={() => onEdit(p)}
                className="size-9 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="size-9 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
