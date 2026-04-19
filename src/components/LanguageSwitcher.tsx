"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Languages, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const [isOpen, setIsOpen] = React.useState(false);

  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const languages = [
    {
      code: "id",
      label: "ID",
      flag: (
        <svg className="w-5 h-5 rounded-full shadow-sm" viewBox="0 0 3 2">
          <rect width="3" height="1" fill="#FF0000" />
          <rect width="3" height="1" y="1" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      code: "en",
      label: "EN",
      flag: (
        <svg className="w-5 h-5 rounded-full shadow-sm" viewBox="0 0 7410 3900">
          <rect width="7410" height="3900" fill="#B22234" />
          <path
            d="M0,450H7410M0,1050H7410M0,1650H7410M0,2250H7410M0,2850H7410M0,3450H7410"
            stroke="#FFF"
            strokeWidth="300"
          />
          <rect width="2964" height="2100" fill="#3C3B6E" />
          {/* Subtle stars representation */}
          <circle cx="494" cy="350" r="40" fill="#FFF" />
          <circle cx="988" cy="350" r="40" fill="#FFF" />
          <circle cx="1482" cy="350" r="40" fill="#FFF" />
          <circle cx="1976" cy="350" r="40" fill="#FFF" />
          <circle cx="2470" cy="350" r="40" fill="#FFF" />
          <circle cx="741" cy="700" r="40" fill="#FFF" />
          <circle cx="1235" cy="700" r="40" fill="#FFF" />
          <circle cx="1729" cy="700" r="40" fill="#FFF" />
          <circle cx="2223" cy="700" r="40" fill="#FFF" />
        </svg>
      ),
    },
  ];

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-bento hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <Languages
          size={18}
          className="text-primary-500 group-hover:rotate-12 transition-transform"
        />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
          {currentLang.code}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-[calc(100%+0.75rem)] right-0 w-24 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
            >
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={redirectedPathName(l.code)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 mb-1 py-2.5 rounded-xl transition-all text-left",
                    lang === l.code
                      ? "bg-primary-500 text-white shadow-glow"
                      : "text-slate-600 dark:text-slate-400 hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400",
                  )}
                >
                  <span className="flex-shrink-0 flex items-center justify-center">
                    {l.flag}
                  </span>
                  <span className="text-xs font-bold">{l.label}</span>
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
