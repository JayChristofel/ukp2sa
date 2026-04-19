"use client";

import React from "react";
import { Card, Badge, Button } from "@/components/ui";
import { MapPin, Clock, Truck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: any;
  viewMode: "grid" | "list" | "bento";
  index: number;
  onViewDetail: (report: any) => void;
  onDispatch: (e: React.MouseEvent) => void;
  locale: any;
  getPriorityColor: (priority: string) => string;
  ar: any;
}

export const ReportCard = ({
  report: item,
  viewMode,
  index,
  onViewDetail,
  onDispatch,
  locale,
  getPriorityColor,
  ar,
}: ReportCardProps) => {
  const sourceColor =
    item.sourceType === "SAR"
      ? "bg-rose-500"
      : item.sourceType === "KONFLIK"
      ? "bg-amber-500"
      : "bg-primary";

  const timeLabel = formatDistanceToNow(new Date(item.displayDate), {
    addSuffix: true,
    locale,
  });

  const isBento = viewMode === "bento";
  const isList = viewMode === "list";

  const bentoSpan = isBento
    ? index % 5 === 0
      ? "md:col-span-2 lg:col-span-3"
      : index % 3 === 0
      ? "md:col-span-2 lg:col-span-2"
      : "col-span-1"
    : "";

  if (isList) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        <Card
          className="group border-none rounded-3xl shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-900 transition-all p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:ring-2 hover:ring-primary/20"
          onClick={() => onViewDetail(item)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`rounded-lg border-none font-black uppercase text-[7px] tracking-widest px-2 py-1 ${getPriorityColor(item.displayPriority)}`}>
                {item.displayPriority}
              </Badge>
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
                <div className={`size-1.5 rounded-full ${sourceColor}`} />
                {item.sourceType}
              </div>
            </div>
            <h3 className="text-sm md:text-base font-black text-navy dark:text-white uppercase truncate">
              {item.displayTitle}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 italic">
              &quot;{item.displayDesc}&quot;
            </p>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy dark:text-white">
                <MapPin size={10} className="text-rose-500" /> {item.displayLocation}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Reported
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy dark:text-white">
                <Clock size={10} className="text-amber-500" /> {timeLabel}
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={onDispatch}
                size="sm"
                className="h-9 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-black uppercase text-[8px] tracking-widest gap-2 transition-all"
              >
                <Truck size={12} /> Dispatch
              </Button>
              <Button
                onClick={() => onViewDetail(item)}
                size="icon"
                variant="ghost"
                className="size-9 rounded-xl text-slate-400 hover:text-primary"
              >
                <Eye size={14} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={bentoSpan}
    >
      <Card
        className={`h-full border-none rounded-[2rem] md:rounded-[2.5rem] shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:bg-white dark:hover:bg-slate-900 transition-all p-6 md:p-8 flex flex-col cursor-pointer hover:ring-2 hover:ring-primary/20 ${
          isBento ? "min-h-[320px]" : ""
        }`}
        onClick={() => onViewDetail(item)}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <Badge className={`rounded-xl border-none font-black uppercase text-[8px] tracking-[0.15em] px-3 py-1.5 w-fit ${getPriorityColor(item.displayPriority)}`}>
              {item.displayPriority} {ar.priority_tag}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={`size-1.5 rounded-full ${sourceColor}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {item.sourceType}
              </span>
            </div>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
            <Clock size={12} className="text-amber-500" /> {timeLabel}
          </div>
        </div>

        <h3 className={`${isBento && bentoSpan.includes("span-") ? "text-xl md:text-2xl" : "text-lg md:text-xl"} font-black text-navy dark:text-white uppercase tracking-tighter mb-4 line-clamp-2 leading-tight`}>
          {item.displayTitle}
        </h3>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed italic">
          &quot;{item.displayDesc}&quot;
        </p>

        <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest font-mono">
            <MapPin size={14} className="text-rose-500" /> <span className="truncate">{item.displayLocation}</span>
          </div>

          <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={onDispatch}
              className="flex-1 py-4 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-2xl font-black uppercase text-[9px] tracking-widest gap-2 shadow-sm border-none"
            >
              <Truck size={14} /> Dispatch
            </Button>
            <Button
              onClick={() => onViewDetail(item)}
              variant="outline"
              className="size-11 md:size-12 rounded-2xl flex items-center justify-center border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all p-0"
            >
              <Eye size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
