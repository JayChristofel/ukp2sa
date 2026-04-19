"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  FileText, 
  Info, 
  CheckCircle2, 
  Bell, 
  Clock, 
  ChevronRight, 
  MoreVertical 
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NotificationCardProps {
  notif: any;
  dict: any;
  n: any;
  lang: string;
  onSelect: (notif: any) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard = ({
  notif,
  dict,
  n,
  lang,
  onSelect,
  onMarkRead,
  onDelete,
}: NotificationCardProps) => {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard size={20} className="text-emerald-500" />;
      case "report":
        return <FileText size={20} className="text-primary-500" />;
      case "system":
        return <Info size={20} className="text-blue-500" />;
      case "assignment":
        return <CheckCircle2 size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} />;
    }
  };

  const cats = n.categories || {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card
        onClick={() => onSelect(notif)}
        className={cn(
          "p-5 sm:p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2rem] group relative overflow-hidden cursor-pointer",
          notif.status === "unread"
            ? "bg-white dark:bg-slate-900 ring-1 ring-primary/20"
            : "bg-slate-50/50 dark:bg-slate-900/30 opacity-80",
        )}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-10 font-display">
          <div
            className={cn(
              "size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-500",
              notif.status === "unread"
                ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-black text-primary"
                : "bg-slate-100 dark:bg-slate-800",
            )}
          >
            {getIcon(notif.type)}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                  {cats[notif.type] || notif.type}
                </span>
                <div className="flex items-center gap-3">
                  <h4
                    className={cn(
                      "text-base sm:text-lg font-black uppercase tracking-tight leading-tight",
                      notif.status === "unread"
                        ? "text-navy dark:text-white"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {notif.title}
                  </h4>
                  {notif.priority === "high" && (
                    <Badge className="bg-rose-500 text-white border-none text-[8px] font-black px-2 h-4 shrink-0">
                      {dict?.common?.urgent || "URGENT"}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2 md:border-none md:pt-0">
                <div className="flex items-center gap-1.5 uppercase tracking-widest text-[9px]">
                  <Clock size={12} /> {notif.time}
                </div>
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                <span className="uppercase tracking-widest text-[9px]">
                  {notif.date}
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl line-clamp-2 md:line-clamp-none">
              {notif.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              {notif.link && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/${lang}${notif.link}`);
                  }}
                  className="rounded-xl h-9 px-4 font-black uppercase text-[9px] tracking-widest shadow-glow-primary border-none"
                >
                  {notif.actionLabel || "Detail"} <ChevronRight size={14} className="ml-1" />
                </Button>
              )}

              <div className="flex gap-2">
                {notif.status === "unread" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(notif.id);
                    }}
                    className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-all"
                  >
                    {n.mark_read || "Tandai Dibaca"}
                  </button>
                )}
                <span className="text-slate-200 dark:text-slate-800">•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notif.id);
                  }}
                  className="text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-all"
                >
                  {n.delete_log || "Hapus Log"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {notif.status === "unread" && (
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        )}
      </Card>
    </motion.div>
  );
};
