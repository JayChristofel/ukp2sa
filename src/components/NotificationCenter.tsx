"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Clock,
  CreditCard,
  FileText,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/app/[lang]/providers";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/hooks/useNotificationStore";

export function NotificationCenter() {
  const dict = useI18n();
  const params = useParams();
  const lang = params.lang as string;
  const n = dict?.notification || {};

  const { notifications, markAllAsRead, fetchNotifications, syncWithExternals } = useNotificationStore();

  // Polling logic for "Real-time" feel without WebSocket
  React.useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Auto-sync every 60 seconds
    const interval = setInterval(() => {
      syncWithExternals();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchNotifications, syncWithExternals]);

  const unreadCount = notifications.filter(
    (notif) => notif.status === "unread",
  ).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard size={16} className="text-emerald-500" />;
      case "report":
        return <FileText size={16} className="text-primary-500" />;
      case "system":
        return <Info size={16} className="text-blue-500" />;
      case "assignment":
        return <CheckCircle2 size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-all border border-slate-200 dark:border-slate-700 focus:outline-none">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600 border-2 border-white dark:border-slate-900"></span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 p-0 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <DropdownMenuLabel className="p-0 font-black text-xs uppercase tracking-widest text-navy dark:text-white">
            {n.title}
          </DropdownMenuLabel>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-[10px] font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest transition-colors"
          >
            <CheckCheck size={14} />
            {n.mark_all_read}
          </button>
        </div>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 m-0" />

        <div className="max-h-[70vh] overflow-y-auto no-scrollbar py-2 px-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs font-bold uppercase tracking-widest">
                {n.empty}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={`/${lang}${notif.link || "#"}`}
                  className="block"
                >
                  <div
                    className={cn(
                      "group relative flex gap-4 p-4 rounded-xl transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer mb-1",
                      notif.status === "unread" && "bg-primary-500/5",
                    )}
                  >
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm",
                        notif.status === "unread" && "border-primary-500/30",
                      )}
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div className="space-y-1 pr-2 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={cn(
                            "text-xs font-bold uppercase tracking-tight leading-none transition-colors",
                            notif.status === "unread"
                              ? "text-navy dark:text-white"
                              : "text-slate-500 dark:text-slate-400",
                          )}
                        >
                          {notif.title}
                        </h5>
                        {notif.priority === "high" && (
                          <span className="shrink-0 size-2 rounded-full bg-rose-500 shadow-glow-rose" />
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 font-medium">
                        {notif.description}
                      </p>

                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                          <Clock size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {notif.time}
                          </span>
                        </div>

                        {notif.actionLabel && (
                          <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            {notif.actionLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {notif.status === "unread" && (
                      <div className="absolute top-4 right-3 size-1.5 rounded-full bg-primary-600" />
                    )}
                  </div>
                </Link>
              ))}
            </AnimatePresence>
          )}
        </div>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 m-0" />

        <Link href={`/${lang}/admin/notifications`} className="block">
          <button className="w-full py-3.5 text-center text-[10px] font-black text-slate-500 hover:text-primary-500 uppercase tracking-[0.2em] transition-colors bg-slate-50/50 dark:bg-slate-800/20">
            {n.view_all}
          </button>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
