import React from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_GROUPS } from "./MapConfig";

interface MapSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  visibleLayers: Set<string>;
  onToggleLayer: (id: string) => void;
  counts: Record<string, number>;
  dict: any;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({
  isOpen,
  onClose,
  visibleLayers,
  onToggleLayer,
  counts,
  dict,
}) => {
  if (!isOpen) return null;
  const d = dict?.map || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[420px]"
    >
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-md">
            <Filter className="text-white dark:text-slate-900 size-3" />
          </div>
          <h2 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
            {d.filter || "Filter"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1.5">
            <h3 className="px-2 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {d.groups?.[group.id as keyof typeof d.groups] || group.labelKey}
            </h3>
            <div className="grid grid-cols-1 gap-0.5">
              {group.items.map((item) => {
                const active = visibleLayers.has(item.id);
                const count = counts[item.id] || 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggleLayer(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-1.5 rounded-lg transition-all",
                      active
                        ? "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm"
                        : "opacity-40 grayscale hover:opacity-100 dark:hover:opacity-100 hover:grayscale-0",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-5 rounded flex items-center justify-center text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        <item.icon size={10} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 transition-colors">
                        {d.items?.[item.id as keyof typeof d.items] ||
                          item.labelKey}
                      </span>
                    </div>
                    <span className="text-[8px] font-black text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
