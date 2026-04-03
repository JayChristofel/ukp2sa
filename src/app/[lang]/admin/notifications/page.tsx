"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  Clock,
  CreditCard,
  FileText,
  Info,
  CheckCircle2,
  ChevronLeft,
  MoreVertical,
  ChevronRight,
  Zap,
  Building2,
  Mail,
  MessageSquare,
  Smartphone,
  ShieldAlert,
  Settings as SettingsIcon,
  Activity,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/app/[lang]/providers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useAuditLogger } from "@/hooks/useAuditLogger";

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

  const filteredNotifications = storeNotifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "unread")
      return notif.status === "unread" && matchesSearch;
    return matchesSearch;
  });

  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Point 3: Sound Cue & Dynamic Title
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

  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "NOTIFICATIONS_VIEW",
      "SYSTEM",
      "User accessed the national notification and log management center.",
    );
  }, [logActivity]);

  const handleMarkAllRead = () => {
    markAllAsRead();
    logActivity(
      "NOTIFICATIONS_MARK_READ",
      "SYSTEM",
      "User marked all notifications as read.",
    );
  };

  const handleClearAll = () => {
    clearAll();
    logActivity(
      "NOTIFICATIONS_CLEAR",
      "SYSTEM",
      "User cleared all notification history.",
    );
  };

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

  // Calculate Real-time Efficiency
  const totalNotifs = storeNotifications.length;
  const readNotifs = storeNotifications.filter(
    (n) => n.status === "read",
  ).length;
  const efficiency =
    totalNotifs > 0 ? Math.round((readNotifs / totalNotifs) * 100) : 100;
  const unreadCount = totalNotifs - readNotifs;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header logic remains same... */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} /> {dict?.common?.back || "Kembali"}
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white mb-2 tracking-tighter uppercase">
            {n.title_main || "Pusat"}{" "}
            <span className="text-primary italic">
              {n.title_sub || "Notifikasi."}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              {n.subtitle || "Manajemen Log & Notifikasi Sistem Nasional"}
            </p>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-glow-emerald/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              WebSocket: {n.ws_connected || "Connected"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest"
            onClick={handleMarkAllRead}
          >
            <CheckCheck size={16} className="mr-2" />{" "}
            {n.mark_all_read || "Tandai Semua Dibaca"}
          </Button>
          <Button
            variant="danger"
            className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-none"
            onClick={handleClearAll}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activity" className="space-y-8">
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger
              value="activity"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-primary transition-all focus-visible:ring-0 shadow-none"
            >
              <Activity size={14} className="mr-2" />{" "}
              {n.all_notifications || "All Notifications"}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-primary transition-all focus-visible:ring-0 shadow-none"
            >
              <SettingsIcon size={14} className="mr-2" />{" "}
              {n.settings_tab || "Settings"}
            </TabsTrigger>
          </TabsList>

          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder={
                dict?.common?.search_placeholder || "Cari notifikasi..."
              }
              className="pl-10 pr-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="activity" className="space-y-8 pt-4 outline-none">
          {/* AI Digest / Situation Report */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2 p-8 bg-primary/5 border-primary/10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={120} className="text-primary fill-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
                  <Zap size={14} className="fill-primary" />{" "}
                  {n.status_current || "Situasi Terkini"}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-navy dark:text-white tracking-tighter uppercase leading-tight max-w-xl">
                  {dict?.common?.there_is || "Ada"}{" "}
                  <span className="text-primary italic">
                    {unreadCount} {dict?.common?.report || "Laporan"}
                  </span>{" "}
                  {n.status_desc ||
                    "baru yang butuh atensi cepat Anda hari ini."}
                </h2>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 dark:border-slate-800">
                    <CreditCard size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      {
                        storeNotifications.filter((n) => n.type === "payment")
                          .length
                      }{" "}
                      {dict?.financial?.allocation || "Alokasi Dana"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 dark:border-slate-800">
                    <FileText size={14} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      {
                        storeNotifications.filter((n) => n.type === "report")
                          .length
                      }{" "}
                      {dict?.common?.report || "Laporan Warga"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-navy dark:bg-slate-900 rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -bottom-4 -right-4 size-32 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                  {n.efficiency_title || "Efisiensi Response"}
                </p>
                <div className="text-5xl font-black text-white tracking-tighter">
                  {efficiency}
                  <span className="text-primary italic text-3xl">%</span>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2">
                  {unreadCount > 0
                    ? (
                        n.efficiency_pending ||
                        `Masih ada ${unreadCount} laporan pending yang butuh respon segera.`
                      ).replace("{count}", unreadCount.toString())
                    : n.efficiency_clear ||
                      "Semua laporan telah tertangani dengan baik. Kerja bagus!"}
                </p>
              </div>
              <Button
                onClick={() => setActiveTab("unread")}
                className="relative z-10 w-full mt-6 bg-white hover:bg-slate-100 text-navy font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl"
              >
                {unreadCount > 0
                  ? n.take_action || "Tangani Segera"
                  : n.check_history || "Cek Riwayat"}
              </Button>
            </Card>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="p-20 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-[3rem]">
                <div className="size-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                  <Bell size={40} />
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white uppercase mb-2">
                  {n.empty || "Log Kosong"}
                </h3>
                <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                  {n.empty_desc ||
                    "Log aktivitas akan muncul di sini secara otomatis saat sistem beroperasi."}
                </p>
              </Card>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={notif.id}
                >
                  <Card
                    onClick={() => {
                      setSelectedNotif(notif);
                      setIsSheetOpen(true);
                      if (notif.status === "unread") markAsRead(notif.id);
                    }}
                    className={cn(
                      "p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2rem] group relative overflow-hidden cursor-pointer",
                      notif.status === "unread"
                        ? "bg-white dark:bg-slate-900 ring-1 ring-primary/20"
                        : "bg-slate-50/50 dark:bg-slate-900/30 opacity-80",
                    )}
                  >
                    <div className="flex gap-6 relative z-10">
                      <div
                        className={cn(
                          "size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-500",
                          notif.status === "unread"
                            ? "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                            : "bg-slate-100 dark:bg-slate-800",
                        )}
                      >
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <h4
                              className={cn(
                                "text-lg font-black uppercase tracking-tight leading-none",
                                notif.status === "unread"
                                  ? "text-navy dark:text-white"
                                  : "text-slate-500 dark:text-slate-400",
                              )}
                            >
                              {notif.title}
                            </h4>
                            {notif.priority === "high" && (
                              <Badge className="bg-rose-500 text-white border-none text-[8px] font-black px-2 h-4">
                                {dict?.common?.urgent || "URGENT"}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <div className="flex items-center gap-1.5 uppercase tracking-widest text-[9px]">
                              <Clock size={12} /> {notif.time}
                            </div>
                            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                            <span className="uppercase tracking-widest text-[9px]">
                              {notif.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
                          {notif.description}
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                          {notif.link && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${lang}${notif.link}`);
                              }}
                              className="rounded-xl h-9 px-4 font-black uppercase text-[9px] tracking-widest shadow-glow-primary"
                            >
                              {notif.actionLabel || "Detail"}{" "}
                              <ChevronRight size={14} className="ml-1" />
                            </Button>
                          )}

                          <div className="flex gap-2">
                            {notif.status === "unread" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-all"
                              >
                                {n.mark_read || "Tandai Dibaca"}
                              </button>
                            )}
                            <span className="text-slate-200 dark:text-slate-800">
                              •
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
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

                    {/* Unread Indicator Pill */}
                    {notif.status === "unread" && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="outline-none space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: Profile & Global Toggle */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Building2 size={80} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter mb-4">
                      Identity{" "}
                      <span className="text-primary italic">Link.</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Verified WhatsApp
                        </p>
                        <p className="text-sm font-bold text-navy dark:text-white">
                          +62 812-****-5542
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Official Email
                        </p>
                        <p className="text-sm font-bold text-navy dark:text-white">
                          admin.utama@ukp2sa.go.id
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-navy dark:text-white uppercase">
                          {n.notif_system_label || "Sistem Notifikasi"}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">
                          {n.master_switch || "Master Switch All Channels"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg bg-navy dark:bg-slate-950 text-white overflow-hidden relative group">
                <div className="relative z-10 space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                    {n.system_behavior || "System Behavior"}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-tight opacity-70">
                        {n.sound_effects || "Sound Effects"}
                      </span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-tight opacity-70">
                        {n.browser_push || "Browser Push"}
                      </span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-tight opacity-70">
                        {n.toast_duration || "Toast Duration (Long)"}
                      </span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content: Channel Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* WhatsApp Section */}
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg space-y-6 bg-white dark:bg-slate-900 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <MessageSquare size={100} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
                        WA{" "}
                        <span className="text-emerald-500 italic">
                          Broadcast.
                        </span>
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      {n.wa_broadcast_desc ||
                        "Alert Real-time kriteria prioritas tinggi."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Laporan Warga (Urgent)",
                        sub: "Notifikasi instan untuk status High Priority",
                      },
                      {
                        label: "Pembayaran Berhasil",
                        sub: "Konfirmasi dana masuk",
                      },
                      {
                        label: "Alert Pembayaran Gagal",
                        sub: "Peringatan transaksi expired atau ditolak",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-200">
                            {item.label}
                          </p>
                          <p className="text-[9px] font-medium text-slate-400 uppercase">
                            {item.sub}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Email Section */}
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-lg space-y-6 bg-white dark:bg-slate-900 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Mail size={100} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
                        Email{" "}
                        <span className="text-blue-500 italic">Digest.</span>
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      {n.email_digest_desc ||
                        "Ringkasan berkala & dokumen resmi."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Laporan Mingguan",
                        sub: "Statistik respon & efisiensi admin",
                      },
                      {
                        label: "Official Invoices",
                        sub: "Bukti potong & nota bayar",
                      },
                      {
                        label: "Log Keuangan Bulanan",
                        sub: "Rekapitulasi alokasi dana nasional",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-200">
                            {item.label}
                          </p>
                          <p className="text-[9px] font-medium text-slate-400 uppercase">
                            {item.sub}
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Advanced Settings Footnote */}
              <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-navy dark:text-white uppercase">
                      {n.auto_archive || "Auto-Archive Logs"}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase leading-relaxed">
                      {n.auto_archive_desc ||
                        "Sistem akan menghapus log yang berumur lebih dari 30 hari secara otomatis untuk efisiensi database."}
                    </p>
                  </div>
                </div>
                <Button className="w-full md:w-auto h-12 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest bg-navy hover:bg-black text-white shadow-lg">
                  {dict?.common?.save_configs || "Simpan Semua Konfigurasi"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Side-Peek Panel for Point 4 */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[450px] sm:max-w-[500px] border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          {selectedNotif && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getIcon(selectedNotif.type)}
                  </div>
                  <div>
                    <SheetTitle className="text-2xl font-black text-navy dark:text-white uppercase tracking-tighter">
                      {dict?.common?.detail || "Detail"}{" "}
                      <span className="text-primary italic">
                        {n.title_sub || "Notifikasi."}
                      </span>
                    </SheetTitle>
                    <SheetDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      ID: {selectedNotif.id} • {selectedNotif.date}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 px-8 space-y-8 overflow-y-auto no-scrollbar">
                <section className="space-y-4">
                  <Badge
                    className={cn(
                      "uppercase text-[10px] font-black px-3 py-1 border-none",
                      selectedNotif.priority === "high"
                        ? "bg-rose-500 text-white"
                        : "bg-primary-500/10 text-primary-500",
                    )}
                  >
                    {selectedNotif.type} • {selectedNotif.priority || "regular"}
                  </Badge>
                  <h3 className="text-xl font-black text-navy dark:text-white uppercase leading-tight">
                    {selectedNotif.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedNotif.description}
                  </p>
                </section>

                <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Timeline</span>
                    <span>{selectedNotif.time}</span>
                  </div>
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />
                  <p className="text-[11px] font-medium text-slate-500 uppercase leading-relaxed">
                    {n.sop_desc ||
                      "Laporan ini memerlukan tindak lanjut segera sesuai dengan Standar Prosedur Operasional (SOP) UKP2SA."}
                  </p>
                </section>
              </div>

              <SheetFooter className="p-8 pt-4 gap-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  className="rounded-2xl h-14 flex-1 font-black uppercase text-[10px] tracking-widest"
                  onClick={() => setIsSheetOpen(false)}
                >
                  {dict?.common?.close_panel || "Tutup Panel"}
                </Button>
                {selectedNotif.link && (
                  <Button
                    className="rounded-2xl h-14 flex-1 font-black uppercase text-[10px] tracking-widest shadow-glow-primary"
                    onClick={() => {
                      setIsSheetOpen(false);
                      router.push(`/${lang}${selectedNotif.link}`);
                    }}
                  >
                    {selectedNotif.actionLabel ||
                      n.run_action ||
                      "Jalankan Aksi"}{" "}
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                )}
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Audio for Point 3 */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        preload="auto"
      />
    </div>
  );
}
