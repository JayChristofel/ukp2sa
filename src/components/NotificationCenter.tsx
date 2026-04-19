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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/app/[lang]/providers";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { isToday, isYesterday } from "date-fns";

interface BellTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  unreadCount: number;
}

const BellTrigger = React.forwardRef<HTMLButtonElement, BellTriggerProps>(
  ({ unreadCount, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className="relative p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary transition-all border border-slate-200 dark:border-white/5 focus:outline-none shadow-sm hover:shadow-md h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center group active:scale-95"
    >
      <Bell size={20} className="group-hover:rotate-12 transition-transform" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative flex items-center justify-center rounded-full h-5 w-5 bg-primary border-2 border-white dark:border-slate-950 text-[10px] font-black text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </span>
      )}
    </button>
  )
);
BellTrigger.displayName = "BellTrigger";

export function NotificationCenter() {
  const dict = useI18n();
  const params = useParams();
  const lang = (params.lang as string) || "id";

  const {
    notifications,
    markAllAsRead,
    fetchNotifications,
    syncWithExternals,
  } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => syncWithExternals(), 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications, syncWithExternals]);

  const unreadCount = notifications.filter(
    (notif) => notif.status === "unread",
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BellTrigger unreadCount={unreadCount} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={15}
        alignOffset={-5}
        className="w-[calc(100vw-32px)] sm:w-[420px] max-w-[450px] rounded-[2.5rem] border-slate-200/60 dark:border-white/5 shadow-2xl shadow-navy/20 dark:shadow-black/40 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 p-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 z-[9999]"
      >
        <div className="flex flex-col max-h-[85vh] sm:max-h-[600px]">
          {/* Header */}
          <div className="p-5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 shrink-0">
            <div className="flex flex-col gap-0.5">
              <h4 className="font-black text-xs uppercase tracking-[0.15em] text-navy dark:text-white leading-none">
                {dict?.notification?.title || (lang === "en" ? "NOTIFICATION CENTER" : "PUSAT NOTIFIKASI")}
              </h4>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {unreadCount} {dict?.notification?.unread || (lang === "en" ? "NEW MESSAGES" : "PESAN BARU")}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                markAllAsRead();
              }}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black text-primary-600 hover:bg-primary/5 disabled:opacity-30 disabled:pointer-events-none uppercase tracking-widest transition-all"
            >
              <CheckCheck size={14} />
              {dict?.notification?.mark_all_read || (lang === "en" ? "MARK ALL READ" : "TANDAI SEMUA DIBACA")}
            </button>
          </div>

          {/* List Area - Limited height to show ~3 items then scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 max-h-[360px] sm:max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 text-center opacity-40">
                <div className="size-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Bell className="size-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 max-w-[140px]">
                  {dict?.notification?.empty || (lang === "en" ? "LOG IS EMPTY" : "LOG KOSONG")}
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={`/${lang}${notif.link || "#"}`}
                    className="block outline-none"
                  >
                    <div
                      className={cn(
                        "group relative flex gap-4 p-4 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer mb-1 border border-transparent",
                        notif.status === "unread" && "bg-primary/5 border-primary/10",
                      )}
                    >
                      <div className="relative shrink-0 text-left">
                        <div
                          className={cn(
                            "size-12 rounded-[1rem] flex items-center justify-center border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300",
                            notif.status === "unread" && "border-primary/20",
                          )}
                        >
                          {(() => {
                            switch (notif.type) {
                              case "payment": return <CreditCard size={16} className="text-emerald-500" />;
                              case "report": return <FileText size={16} className="text-primary" />;
                              case "system": return <Info size={16} className="text-blue-500" />;
                              case "assignment": return <CheckCircle2 size={16} className="text-purple-500" />;
                              default: return <Bell size={16} />;
                            }
                          })()}
                        </div>
                        {notif.status === "unread" && (
                          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-primary border-2 border-white dark:border-slate-900 shadow-sm" />
                        )}
                      </div>

                      <div className="space-y-1 pr-2 flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                            {dict?.notification?.categories?.[notif.type] || notif.type}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            <Clock size={10} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                              {(() => {
                                const d = new Date(notif.createdAt);
                                if (isToday(d)) return notif.time;
                                if (isYesterday(d)) return lang === "en" ? "YESTERDAY" : "KEMARIN";
                                return notif.date;
                              })()}
                            </span>
                          </div>
                        </div>

                        <h5 className={cn(
                          "text-xs font-black uppercase tracking-tight leading-tight transition-colors line-clamp-1 truncate",
                          notif.status === "unread" ? "text-navy dark:text-white" : "text-slate-500 dark:text-slate-400"
                        )}>
                          {notif.title}
                        </h5>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-bold opacity-80">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer - Always visible at bottom of dropdown */}
          <Link href={`/${lang}/admin/notifications`} className="block shrink-0">
            <button className="w-full py-5 sm:py-4 text-center text-[10px] font-black text-slate-400 hover:text-primary dark:hover:text-white uppercase tracking-[0.3em] transition-all bg-slate-50/30 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 group">
              <span className="inline-block transition-transform group-hover:scale-110">
                {dict?.notification?.view_all || (lang === "en" ? "EXPLORE ALL NOTIFICATIONS" : "LIHAT SEMUA NOTIFIKASI")}
              </span>
            </button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
