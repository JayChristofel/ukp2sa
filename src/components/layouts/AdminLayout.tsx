"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  User,
  Users,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Newspaper,
  LogOut,
  PlusCircle,
  Globe,
  Layers,
  ClipboardList,
  ShoppingBag,
  Terminal,
  Award,
  Satellite,
} from "lucide-react";
import { useSession, useAuthStore } from "@/stores/authStore";

import { motion, AnimatePresence } from "framer-motion";
import { useAppMode } from "@/hooks/useAppMode";
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
import { NotificationCenter } from "@/components/NotificationCenter";
import { useNotificationSync } from "@/hooks/useNotificationSync";

interface AdminLayoutProps {
  isDark: boolean;
  toggleTheme: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  isDark,
  toggleTheme,
  children,
}) => {
  const { data: session, status } = useSession();
  const isLoadingSession = status === "loading";
  const user = session?.user || null;
  const { setMode } = useAppMode();
  useNotificationSync();

  const dict = useI18n();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as string;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, mounted]);

  if (!mounted || !dict) {
    return (
      <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="size-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    const { logout } = useAuthStore.getState();
    await logout();
    window.location.href = `/${lang}/auth/login`;
  };

  const menuGroups = [
    {
      title: dict.admin.groups.strategic,
      items: [
        {
          name: dict.admin.menu.dashboard,
          icon: <LayoutDashboard size={18} />,
          path: "/admin",
        },
        {
          name: dict.admin.menu.kpi,
          icon: <TrendingUp size={18} />,
          path: "/admin/kpi",
        },
        {
          name: dict.admin.menu.map,
          icon: <Globe size={18} />,
          path: "/admin/map",
        },
        {
          name: dict.admin.menu.satellite,
          icon: <Satellite size={18} />,
          path: "/admin/intel",
        },
      ],
    },
    {
      title: dict.admin.groups.operational,
      items: [
        {
          name: dict.admin.menu.reports,
          icon: <Database size={18} />,
          path: "/admin/laporan",
        },
        {
          name: dict.admin.menu.assignments,
          icon: <ClipboardList size={18} />,
          path: "/admin/assignments",
        },
        {
          name: dict.admin.menu.clearing,
          icon: <Layers size={18} />,
          path: "/admin/clearing-house",
        },
        {
          name: dict.admin.menu.donor_reg,
          icon: <PlusCircle size={18} />,
          path: "/admin/donor/register",
        },
      ],
    },
    {
      title: dict.admin.groups.finance,
      items: [
        {
          name: dict.admin.menu.financial,
          icon: <Wallet size={18} />,
          path: "/admin/financial/progress",
        },
        {
          name: dict.admin.menu.tracking,
          icon: <TrendingUp size={18} />,
          path: "/admin/tracking",
        },
        {
          name: dict.admin.menu.economy,
          icon: <ShoppingBag size={18} />,
          path: "/admin/economy",
        },
        {
          name: dict.admin.menu.portfolio,
          icon: <Award size={18} />,
          path: "/admin/donor/portfolio",
        },
      ],
    },
    {
      title: dict.admin.groups.system,
      items: [
        {
          name: dict.admin.menu.blog,
          icon: <Newspaper size={18} />,
          path: "/admin/blog",
        },
        {
          name: dict.admin.menu.users,
          icon: <Users size={18} />,
          path: "/admin/users",
        },
        {
          name: dict.admin.menu.roles,
          icon: <ShieldCheck size={18} />,
          path: "/admin/roles",
        },
        {
          name: dict.admin.menu.audit,
          icon: <Terminal size={18} />,
          path: "/admin/audit-trail",
        },
        {
          name: dict.admin.settings,
          icon: <Settings size={18} />,
          path: "/admin/settings",
        },
      ],
    },
  ];

  if (!mounted) return null;

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden font-display">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } sticky top-0 h-screen hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 z-[9000]`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 text-white font-black">
            <Image
              src="/assets/logo-ukp2sa.png"
              alt="logo"
              width={40}
              height={40}
              priority
            />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col text-left">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-slate-900 dark:text-white text-sm"
              >
                UKP2SA
              </motion.span>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-black text-slate-400 dark:text-slate-500 text-[10px] leading-tight uppercase tracking-widest mt-0.5"
              >
                {dict.admin.unit_kerja}
              </motion.p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1 text-left">
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const fullPath = `/${lang}${item.path}`;
                  const isActive = pathname === fullPath;
                  return (
                    <div
                      key={item.name}
                      onClick={() => router.push(fullPath)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(fullPath);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={
                          isActive
                            ? "text-white"
                            : "group-hover:text-primary-500 transition-colors"
                        }
                      >
                        {item.icon}
                      </div>
                      {isSidebarOpen && (
                        <span className="font-bold text-sm tracking-tight text-left">
                          {item.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-[1px] bg-slate-100 dark:bg-slate-800/50 mx-4 my-4 opacity-50" />
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <Link
            href={`/${lang}`}
            onClick={() => setMode("public")}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <Sun size={18} />
            {isSidebarOpen && <span>{dict.admin.public_page}</span>}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
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
              className="fixed inset-y-0 left-0 w-[min(18rem,85vw)] bg-white dark:bg-slate-950 shadow-2xl z-[10000] md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center bg-primary-600 text-white font-black overflow-hidden">
                    <Image
                      src="/assets/logo-ukp2sa.png"
                      alt="logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest">
                    UKP2SA
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
                {menuGroups.map((group) => (
                  <div key={group.title} className="space-y-3 text-left">
                    <h3 className="px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const fullPath = `/${lang}${item.path}`;
                        const isActive = pathname === fullPath;
                        return (
                          <Link
                            key={item.name}
                            href={fullPath}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                              isActive
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 font-bold"
                                : "text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {item.icon}
                            <span className="text-sm tracking-tight text-left">
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-6 border-t dark:border-slate-800">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900">
                  <div className="size-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500">
                    <User size={22} />
                  </div>
                  <div className="text-left capitalize">
                    <p className="text-sm font-black dark:text-white transition-all capitalize">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
              {/* Sidebar Footer with Logout */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-black uppercase tracking-widest"
                >
                  <LogOut size={22} />
                  <span>{dict.admin.logout}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg flex items-center justify-between px-3 sm:px-6 md:px-8 z-[8000] shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 active:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs - Smarter for Tablet */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 min-w-0">
              <span className="hidden lg:inline opacity-60">Admin</span>
              <ChevronRight size={14} className="hidden lg:inline opacity-40" />
              <div className="flex items-center gap-2 truncate">
                <div className="size-1.5 rounded-full bg-primary-500 md:hidden" />
                <span className="text-slate-900 dark:text-white font-bold capitalize truncate tracking-tight">
                  {pathname.split("/").pop() === "admin"
                    ? dict.admin.command_center
                    : pathname.split("/").pop()?.replace(/-/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="hidden xs:flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NotificationCenter />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden lg:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 focus:outline-none group active:scale-95 transition-transform">
                  {/* Hide name on small tablets, show on large screens */}
                  <div className="hidden lg:block text-right">
                    {isLoadingSession ? (
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                        <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded ml-auto" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-black dark:text-white leading-none group-hover:text-primary-500 transition-colors uppercase tracking-tight">
                          {user?.name?.split(" ")[0]}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
                          {user?.role}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="size-10 sm:size-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:border-primary-500/50 transition-all shadow-sm overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <User
                      size={20}
                      className="text-slate-400 group-hover:text-primary-500 transition-colors relative z-10"
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 p-2"
              >
                <DropdownMenuLabel className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 px-3 py-2">
                  {dict.admin.account_label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-1" />
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary-50 dark:focus:bg-primary-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all">
                  <User size={16} className="text-slate-400" />
                  <span>{dict.admin.profile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary-50 dark:focus:bg-primary-900/20 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all">
                  <Settings size={16} className="text-slate-400" />
                  <span>{dict.admin.settings}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer focus:bg-rose-50 dark:focus:bg-rose-900/20 text-sm font-bold text-rose-500 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                  <span>{dict.admin.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100/30 via-transparent to-transparent dark:from-primary-900/5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
