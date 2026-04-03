"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Search, Filter, RefreshCw, Plus } from "lucide-react";

type EmptyStateVariant = "no-data" | "no-search-results" | "no-filter-results";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: React.ReactNode; defaultTitle: string; defaultDesc: string }
> = {
  "no-data": {
    icon: <Database size={48} strokeWidth={1.5} />,
    defaultTitle: "Belum Ada Data",
    defaultDesc: "Data belum tersedia. Mulai dengan menambahkan data baru.",
  },
  "no-search-results": {
    icon: <Search size={48} strokeWidth={1.5} />,
    defaultTitle: "Tidak Ada Hasil",
    defaultDesc:
      "Kata kunci pencarian tidak cocok dengan data apapun. Coba kata kunci lain.",
  },
  "no-filter-results": {
    icon: <Filter size={48} strokeWidth={1.5} />,
    defaultTitle: "Filter Tidak Ditemukan",
    defaultDesc:
      "Tidak ada data yang sesuai dengan filter yang dipilih. Coba ubah kriteria filter.",
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const config = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 md:py-24 px-8 text-center"
    >
      <div className="size-24 md:size-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-8">
        {config.icon}
      </div>

      <h3 className="text-lg md:text-xl font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight mb-3">
        {title || config.defaultTitle}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
        {description || config.defaultDesc}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all"
        >
          {variant === "no-data" ? <Plus size={18} /> : <RefreshCw size={18} />}
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
