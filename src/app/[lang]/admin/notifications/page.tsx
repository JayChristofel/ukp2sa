"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  Activity,
  Settings as SettingsIcon,
} from "lucide-react";
import { Card } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/app/[lang]/providers";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useAuditLogger } from "@/hooks/useAuditLogger";

// Modular Components
import { NotificationHeader } from "./_components/NotificationHeader";
import { NotificationAIDigest } from "./_components/NotificationAIDigest";
import { NotificationCard } from "./_components/NotificationCard";
import { NotificationSettings } from "./_components/NotificationSettings";
import { NotificationDetailSheet } from "./_components/NotificationDetailSheet";

export default function NotificationsPage() {
  const dict = useI18n();
  const n = dict?.notification || {};
  const {
    notifications: storeNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const params = useParams();
  const lang = params.lang as string;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { logActivity } = useAuditLogger();

  const filteredNotifications = storeNotifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "unread")
      return notif.status === "unread" && matchesSearch;
    return matchesSearch;
  });

  // Sound Cue & Dynamic Title
  useEffect(() => {
    const unreadCount = storeNotifications.filter(
      (notif) => notif.status === "unread",
    ).length;
    const siteTitle = n.center_title || "Pusat Notifikasi";
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${siteTitle} | UKP2SA`;
    } else {
      document.title = `${siteTitle} | UKP2SA`;
    }
  }, [storeNotifications, n.center_title]);

  useEffect(() => {
    logActivity(
      "NOTIFICATIONS_VIEW",
      "SYSTEM",
      "User accessed the national notification and log management center.",
    );
  }, [logActivity]);

  const handleMarkAllRead = () => {
    markAllAsRead();
    logActivity("NOTIFICATIONS_MARK_READ", "SYSTEM", "User marked all notifications as read.");
  };

  const handleClearAll = () => {
    clearAll();
    logActivity("NOTIFICATIONS_CLEAR", "SYSTEM", "User cleared all notification history.");
  };

  // Stats
  const totalNotifs = storeNotifications.length;
  const readNotifs = storeNotifications.filter((n) => n.status === "read").length;
  const efficiency = totalNotifs > 0 ? Math.round((readNotifs / totalNotifs) * 100) : 100;
  const unreadCount = totalNotifs - readNotifs;
  const paymentCount = storeNotifications.filter((n) => n.type === "payment").length;
  const reportCount = storeNotifications.filter((n) => n.type === "report").length;

  if (!dict) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 sm:px-6">
      <NotificationHeader 
        n={n} dict={dict} 
        onMarkAllRead={handleMarkAllRead} 
        onClearAll={handleClearAll} 
      />

      <Tabs defaultValue="activity" className="space-y-8">
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger
              value="activity"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-primary transition-all focus-visible:ring-0 shadow-none"
            >
              <Activity size={14} className="mr-2" /> {n.all_notifications || "All Notifications"}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-primary transition-all focus-visible:ring-0 shadow-none"
            >
              <SettingsIcon size={14} className="mr-2" /> {n.settings_tab || "Settings"}
            </TabsTrigger>
          </TabsList>

          <div className="relative hidden md:block group font-display">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict?.common?.search_placeholder || "Cari notifikasi..."}
              className="pl-10 pr-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 w-64 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <TabsContent value="activity" className="space-y-8 pt-4 outline-none">
          <NotificationAIDigest 
            n={n} dict={dict} unreadCount={unreadCount} efficiency={efficiency}
            paymentCount={paymentCount} reportCount={reportCount}
            onTakeAction={() => {
              setActiveTab("unread");
              const firstUnread = storeNotifications.find(n => n.status === "unread");
              if (firstUnread) {
                setSelectedNotif(firstUnread);
                setIsSheetOpen(true);
                markAsRead(firstUnread.id);
              }
            }}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab === "unread" ? n.unread_only || "UNREAD ONLY" : n.all_logs || "RECENT ACTIVITY"}
              </h3>
              {activeTab === "unread" && (
                <button 
                  onClick={() => setActiveTab("all")}
                  className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                >
                  {n.show_all || "Show All"}
                </button>
              )}
            </div>

            {filteredNotifications.length === 0 ? (
              <Card className="p-20 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-[3rem]">
                <div className="size-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                  <Bell size={40} />
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white uppercase mb-2">
                  {n.empty || "Log Kosong"}
                </h3>
                <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                  {n.empty_desc || "Log aktivitas akan muncul di sini secara otomatis saat sistem beroperasi."}
                </p>
              </Card>
            ) : (
              filteredNotifications.map((notif) => (
                <NotificationCard 
                  key={notif.id} notif={notif} dict={dict} n={n} lang={lang}
                  onSelect={(item) => { setSelectedNotif(item); setIsSheetOpen(true); if (item.status === "unread") markAsRead(item.id); }}
                  onMarkRead={(id) => markAsRead(id)}
                  onDelete={(id) => deleteNotification(id)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="outline-none space-y-8">
          <NotificationSettings n={n} dict={dict} />
        </TabsContent>
      </Tabs>

      <NotificationDetailSheet 
        isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}
        selectedNotif={selectedNotif} dict={dict} n={n} lang={lang}
      />

      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        preload="auto"
      />
    </div>
  );
}
