"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Map as MapIcon,
  Database,
  LayoutDashboard,
  User,
  ArrowLeftRight,
  PlusCircle,
  BarChart3,
  ShieldCheck,
  Bell,
} from "lucide-react";

import { useI18n } from "@/app/[lang]/providers";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface TabItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isCenter?: boolean;
  onClick?: () => void;
}

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const mode: any = false;
  const setMode: any = false;

  const dict = useI18n();
  const d = dict?.nav || {};
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const router = useRouter();

  const publicTabs: TabItem[] = [
    { label: d.home || "Beranda", icon: <Home size={20} />, path: `/${lang}` },
    {
      label: d.map || "Peta",
      icon: <MapIcon size={20} />,
      path: `/${lang}#peta`,
    },
    {
      label: d.reports || "Lapor",
      icon: <PlusCircle size={24} />,
      path: `/${lang}#kirim-laporan`,
      isCenter: true,
    },
    {
      label: d.blog || "Blog",
      icon: <Bell size={20} />,
      path: `/${lang}/blog`,
    },
    {
      label: d.account || "Akun",
      icon: <User size={20} />,
      path: `/${lang}/auth/login`,
    },
  ];

  const adminTabs: TabItem[] = [
    {
      label: d.stats || "Stats",
      icon: <LayoutDashboard size={20} />,
      path: `/${lang}/admin`,
    },
    {
      label: d.reports || "Laporan",
      icon: <Database size={20} />,
      path: `/${lang}/admin/laporan`,
    },
    {
      label: d.mode || "Mode",
      icon: <ArrowLeftRight size={24} />,
      path: `/${lang}`,
      isCenter: true,
      onClick: () => {
        setMode("public");
        router.push(`/${lang}`);
      },
    },
    {
      label: d.users || "Users",
      icon: <BarChart3 size={20} />,
      path: `/${lang}/admin/users`,
    },
    {
      label: d.roles || "Roles",
      icon: <ShieldCheck size={20} />,
      path: `/${lang}/admin/roles`,
    },
  ];

  const tabs = mode === "admin" ? adminTabs : publicTabs;

  const handleScroll = (path: string) => {
    if (path.includes("#")) {
      const id = path.split("#")[1];
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-[5000] pb-[env(safe-area-inset-bottom)]">
        <div className="mx-6 mb-6 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4">
          {tabs.map((tab, index) => {
            const getIsActive = () => {
              if (tab.path.includes("#")) {
                const [base, hash] = tab.path.split("#");
                const currentHash =
                  typeof window !== "undefined" ? window.location.hash : "";
                return pathname === base && currentHash === `#${hash}`;
              }
              return pathname === tab.path;
            };
            const isActive = getIsActive();

            if (tab.isCenter) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (tab.onClick) {
                      tab.onClick();
                    } else {
                      router.push(tab.path);
                      handleScroll(tab.path);
                    }
                  }}
                  className={cn(
                    "relative -top-8 size-16 rounded-2xl flex items-center justify-center text-white shadow-glow border-4 border-slate-50 dark:border-slate-950 active:scale-90 transition-all z-[100]",
                    isActive
                      ? "bg-primary-500 shadow-primary-500/40"
                      : "bg-slate-800 dark:bg-slate-700 shadow-slate-900/40",
                  )}
                >
                  {tab.icon}
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={tab.path}
                onClick={() => handleScroll(tab.path)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all relative",
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-slate-400 dark:text-slate-500",
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-xl transition-all",
                    isActive && "bg-primary-500/10",
                  )}
                >
                  {tab.icon}
                </div>
                {/* <span className="text-[10px] font-black uppercase tracking-widest">
                  {tab.label}
                </span> */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 size-1 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
