"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  Search,
  ChevronLeft,
  Activity,
  Menu,
  X,
  User,
  LogOut,
  Wallet,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

interface PortalSidebarLayoutProps {
  children: React.ReactNode;
  portalTitle: string;
  portalSubtitle?: string;
  isDark?: boolean;
  toggleTheme?: () => void;
}

const PortalSidebarLayout: React.FC<PortalSidebarLayoutProps> = ({
  children,
  portalTitle,
  portalSubtitle = "UKP2SA Command Center",
  isDark,
  toggleTheme,
}) => {
  return (
    <React.Suspense
      fallback={
        <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
          <Activity className="animate-spin text-primary" />
        </div>
      }
    >
      <SidebarContent
        portalTitle={portalTitle}
        portalSubtitle={portalSubtitle}
        isDark={isDark}
        toggleTheme={toggleTheme}
      >
        {children}
      </SidebarContent>
    </React.Suspense>
  );
};

const SidebarContent: React.FC<PortalSidebarLayoutProps> = ({
  children,
  portalTitle,
  portalSubtitle,
  isDark,
  toggleTheme,
}) => {
  const dict = useI18n();
  const d = dict?.portal || {};
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params.lang as string) || "id";
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    // Ambil CSRF token dulu (wajib buat NextAuth)
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();

    // POST ke signout endpoint buat hancurin session
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `csrfToken=${csrfToken}`,
    });

    // Redirect manual ke login
    window.location.href = `/${lang}/auth/login`;
  };

  const isPortal = pathname.includes("/portal/");
  const isPartnerPortal = pathname.includes("/portal/partner/");
  const isProgramPortal = pathname.includes("/portal/program/");

  const segments = pathname.split("/");
  const portalType = segments[3] || ""; // 'partner' or 'program'
  const portalIdFromQuery = searchParams.get("id") || "";

  // IDs allowed to see financial data (Partners only)
  const allowedPartnerIds = ["p1", "p2", "p3", "p4"];
  const showFinancials =
    isPartnerPortal && allowedPartnerIds.includes(portalIdFromQuery);

  const menuGroups = [
    {
      title: d.portal_main || "Portal Utama",
      items: [
        {
          name: d.summary || "Ringkasan",
          icon: <LayoutDashboard size={18} />,
          path: isPortal
            ? `/${lang}/portal/${portalType}/id?id=${portalIdFromQuery}`
            : `/${lang}/portal`,
        },
        {
          name: d.monitor_reports || "Monitor Laporan",
          icon: <Search size={18} />,
          path: isProgramPortal
            ? `/${lang}/portal/program/id/report?id=${portalIdFromQuery}`
            : isPartnerPortal
            ? `/${lang}/portal/partner/id/report?id=${portalIdFromQuery}`
            : `/${lang}/laporan/cek`,
        },
      ],
    },
    {
      title: d.reporting || "Pelaporan",
      items: [
        {
          name: d.new_report || "Laporan Baru",
          icon: <Send size={18} />,
          path: isProgramPortal
            ? `/${lang}/portal/program/id/report/new?id=${portalIdFromQuery}`
            : isPartnerPortal
            ? `/${lang}/portal/partner/id/report/new?id=${portalIdFromQuery}`
            : `/${lang}/portal/partner/id/report/new`,
        },
        // Only show Stats for high-level satgas
        ...(showFinancials
          ? [
              {
                name: d.my_stats || "Statistik Saya",
                icon: <Activity size={18} />,
                path: `/${lang}/portal/partner/id/stats?id=${portalIdFromQuery}`,
              },
            ]
          : []),
      ],
    },
    // Only show financial group if authorized
    ...(showFinancials
      ? [
          {
            title: d.financial || "Finansial",
            items: [
              {
                name: d.fund_realization || "Realisasi Dana",
                icon: <Wallet size={18} />,
                path: `/${lang}/portal/partner/id/finance?id=${portalIdFromQuery}`,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden font-display">
      {/* Desktop Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } sticky top-0 h-screen hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 z-50 shadow-2xl shadow-slate-200/20`}
      >
        <div className="p-6">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 text-[10px] font-black uppercase tracking-widest group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {isSidebarOpen && <span>{d.back_to_home || "Beranda Utama"}</span>}
          </Link>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center bg-primary text-white font-black shadow-lg shadow-primary/20">
              <Image
                src="/assets/logo-ukp2sa.png"
                alt="logo"
                width={24}
                height={24}
                priority
                className="invert brightness-0"
              />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <h1 className="text-lg font-black text-navy dark:text-white leading-tight tracking-tight">
                  {portalTitle}
                </h1>
                <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">
                  {portalSubtitle}
                </p>
              </div>
            )}
          </div>
          {isSidebarOpen && <div className="mt-4 mb-8"></div>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/portal" && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                        isActive
                          ? "bg-primary text-white shadow-xl shadow-primary/30 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50 font-bold"
                      }`}
                    >
                      <div
                        className={
                          isActive
                            ? "text-white"
                            : "group-hover:text-primary transition-colors"
                        }
                      >
                        {item.icon}
                      </div>
                      {isSidebarOpen && (
                        <span className="text-sm tracking-tight">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <Activity size={20} />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-[10px] font-black text-navy dark:text-white uppercase tracking-tighter truncate">
                  {d.live_session || "Sesi Langsung"}
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase truncate">
                  UKP2SA-SENTINEL-V2
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full mt-2 flex items-center justify-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-400 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg flex items-center justify-between px-4 md:px-8 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>{d.portal_main || "Portal"}</span>
              <ChevronRight size={12} />
              <span className="text-navy dark:text-white">
                {pathname.split("/").pop() === "id"
                  ? portalTitle
                  : pathname.split("/").pop()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              {!mounted ? (
                <div className="size-[18px]" />
              ) : isDark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            {!mounted ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-1" />
                  <div className="h-2 w-20 bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
                </div>
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-2 focus:outline-none group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-navy dark:text-white uppercase leading-none mb-1 group-hover:text-primary transition-colors">
                        {d.welcome_partner || "Partner"}
                      </p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                        {d.institutional_account || "Akun Institusi"}
                      </p>
                    </div>
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:border-primary/50 transition-all shadow-sm">
                      <User
                        size={20}
                        className="text-slate-400 group-hover:text-primary transition-colors"
                      />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 p-2"
                >
                  <DropdownMenuLabel className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 px-3 py-2">
                    {dict?.admin?.account_label || "Akun Admin"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-1" />
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/5 dark:focus:bg-primary-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all">
                    <User size={16} className="text-slate-400" />
                    <span>{dict?.admin?.profile || "Profil Saya"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/5 dark:focus:bg-primary-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all">
                    <Settings size={16} className="text-slate-400" />
                    <span>{dict?.admin?.settings || "Pengaturan"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-rose-50 dark:focus:bg-rose-900/20 text-sm font-bold text-rose-500 rounded-xl transition-all"
                  >
                    <LogOut size={16} />
                    <span>{dict?.admin?.logout || "Keluar"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100/30 via-transparent to-transparent dark:from-primary-900/5">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-950 shadow-2xl z-[70] md:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Image
                      src="/assets/logo-ukp2sa.png"
                      alt="logo"
                      width={24}
                      height={24}
                      priority
                      className="invert brightness-0"
                    />
                  </div>
                  <span className="font-black text-navy dark:text-white text-xs uppercase tracking-widest">
                    UKP2SA
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-8">
                {menuGroups.map((group) => (
                  <div key={group.title} className="space-y-4">
                    <h3 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive =
                          pathname === item.path ||
                          (item.path !== "/portal" &&
                            pathname.startsWith(item.path));
                        return (
                          <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "text-slate-600 dark:text-slate-400 font-bold"
                            }`}
                          >
                            {item.icon}
                            <span className="text-sm tracking-tight">
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="pt-6 border-t dark:border-slate-800 space-y-4">
                <div className="px-1">
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={20} />
                  {dict?.admin?.logout || "Keluar"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortalSidebarLayout;
