"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Edit2, Key, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: any;
  allPermissionsFlat: any[];
  onEdit: (role: any) => void;
  onDelete: (id: string) => void;
}

export const RoleCard = ({
  role,
  allPermissionsFlat,
  onEdit,
  onDelete,
}: RoleCardProps) => {
  return (
    <motion.div
      layoutId={role.id}
      className="group relative bg-white dark:bg-navy rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col h-full"
    >
      <div className="flex-1 space-y-8">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "p-4 rounded-2xl shadow-inner",
              role.id === "superadmin"
                ? "bg-amber-100 text-amber-600"
                : "bg-primary/5 text-primary",
            )}
          >
            <ShieldCheck size={24} />
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={() => onEdit(role)}
              className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-sm"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            {role.id === "superadmin" && (
              <span className="px-2 py-0.5 bg-amber-500 text-[8px] font-black text-white rounded-[4px] uppercase tracking-widest">
                Master
              </span>
            )}
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {role.name}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            {role.description}
          </p>
        </div>

        <div className="space-y-3.5">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <Key size={10} className="text-primary/50" /> Izin Aktif
            ({role.permissions?.length || 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(role.permissions || [])
              .slice(0, 8)
              .map((pId: string) => {
                const p = allPermissionsFlat.find(
                  (item: any) => item.id === pId,
                );
                return (
                  <span
                    key={pId}
                    className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-[8px] font-black rounded-lg uppercase tracking-tight text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50"
                  >
                    {p?.name || pId}
                  </span>
                );
              })}
            {role.permissions?.length > 8 && (
              <span className="px-2.5 py-1.5 bg-primary/5 text-primary text-[8px] font-black rounded-lg uppercase border border-primary/10">
                +{role.permissions.length - 8} Lainnya
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <button
          onClick={() => onEdit(role)}
          className="flex-1 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-[1.25rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white dark:hover:bg-primary transition-all active:scale-95 shadow-sm"
        >
          Konfigurasi Izin <ChevronRight size={14} />
        </button>
        {role.id !== "superadmin" && (
          <button
            onClick={() => onDelete(role.id)}
            className="size-[52px] flex-none bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-[1.25rem] flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm"
            title="Hapus Role"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
