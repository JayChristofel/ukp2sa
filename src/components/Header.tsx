"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Moon,
  Sun,
  LayoutGrid,
  X,
  Menu,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";

import { useI18n } from "@/app/[lang]/providers";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const dict = useI18n();
  const d = dict?.nav || {};
  const common = dict?.common || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const pathname = usePathname();
  const params = useParams();
  const [lang] = React.useState((params?.lang as string) || "id");
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const NAV_LINKS = React.useMemo(
    () => [
      { label: d.home || "Beranda", href: "/" },
      { label: d.stats || "Statistik", href: "#statistik" },
      { label: d.program || "Program", href: "#program" },
      { label: d.reports || "Laporan", href: "#laporan" },
      { label: d.blog || "Blog", href: `/${lang}/blog` },
      { label: d.faq || "FAQ", href: "#faq" },
    ],
    [d, lang],
  );

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  const activeSectionRef = React.useRef(activeSection);
  React.useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  React.useEffect(() => {
    // Track visible sections and their intersection ratios
    const visibleSections = new Map<string, number>();

    const timer = setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: "-15% 0px -15% 0px",
        threshold: Array.from({ length: 11 }, (_, i) => i * 0.1),
      };

      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Find section with the largest intersection ratio
        let maxRatio = -1;
        let mostVisible = activeSectionRef.current;

        visibleSections.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        });

        if (mostVisible !== activeSectionRef.current && maxRatio > 0) {
          setActiveSection(mostVisible);
        }
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );

      NAV_LINKS.forEach((link) => {
        if (link.href.startsWith("#")) {
          const id = link.href.replace("#", "");
          const element = document.getElementById(id);
          if (element) observer.observe(element);
        }
      });

      return () => observer.disconnect();
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, NAV_LINKS]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[5000] mx-auto w-full px-4 sm:px-6 max-w-[1240px] transition-all duration-500",
        isScrolled ? "top-2 md:top-4" : "top-4 md:top-8",
      )}
    >
      <div
        className={cn(
          "backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] flex items-center justify-between shadow-2xl transition-all duration-500 relative",
          isScrolled
            ? "bg-white/80 dark:bg-slate-950/80 px-4 md:px-6 py-2.5 md:py-3 shadow-primary-500/10"
            : "bg-white/60 dark:bg-slate-950/60 px-5 md:px-8 py-3.5 md:py-4.5 md:shadow-bento dark:shadow-bento-dark",
        )}
      >
        <div className="absolute top-0 right-0 w-32 h-full bg-primary-500/5 blur-3xl -z-10" />

        <div
          className="flex items-center gap-3 md:gap-4 group cursor-pointer relative z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="size-14 md:size-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glow">
            <Image
              src={
                isDark ? "/assets/logo-ukp2sa.png" : "/assets/logo-ukp2sa.png"
              }
              alt="Logo"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain dark:grayscale/75"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-shrink-0">
            <h2 className="text-navy dark:text-white text-[12px] xs:text-sm md:text-lg font-black tracking-tight leading-none truncate sm:max-w-none">
              UKP2SA
            </h2>
            <p className="hidden xs:block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-tight max-w-[180px] md:max-w-[220px] pr-2">
              {common.national_command}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 relative z-10">
          <nav className="hidden lg:flex items-center gap-4">
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith("#");
              // Logic to check if we are on the home page (accounting for i18n)
              const isHomePage = pathname === "/" || pathname === `/${lang}`;

              const isActive = isHash
                ? activeSection === link.href.replace("#", "") && isHomePage
                : pathname === link.href;

              const linkClasses = cn(
                "text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all relative group py-2",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white",
              );

              const underline = (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 rounded-full",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              );

              // Case 1: Hash link when NOT on home page -> Link to home + hash
              if (isHash && !isHomePage) {
                return (
                  <Link
                    key={link.label}
                    href={`/${lang}${link.href}`}
                    className={linkClasses}
                  >
                    {link.label}
                    {underline}
                  </Link>
                );
              }

              // Case 2: Route link (like Blog) -> Use Link for SPA navigation
              if (!isHash) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={linkClasses}
                  >
                    {link.label}
                    {underline}
                  </Link>
                );
              }

              // Case 3: Hash link on home page -> Keep <a> for smooth scroll
              return (
                <a
                  key={link.label}
                  className={linkClasses}
                  href={link.href}
                  onClick={() => handleNavClick(link.href.replace("#", ""))}
                >
                  {link.label}
                  {underline}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-2 lg:border-l lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pl-4">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-2xl size-10 md:size-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 shadow-bento hover:scale-110 active:scale-90 transition-all duration-300"
              icon={
                !mounted ? null : isDark ? (
                  <Sun size={20} className="text-orange-400" />
                ) : (
                  <Moon size={20} className="text-primary-500" />
                )
              }
            />

            <Link
              href={`/${lang}/auth/login`}
              className="hidden lg:flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95"
            >
              <LayoutGrid size={16} />
              <span>{d.dashboard}</span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-2xl size-10 md:size-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 shadow-bento"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              icon={isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 left-0 w-full h-screen bg-slate-950/40 backdrop-blur-xl z-[4999]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+1rem)] left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] p-8 lg:hidden shadow-2xl z-[5001]"
            >
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => {
                  const isHash = link.href.startsWith("#");
                  const isHomePage =
                    pathname === "/" || pathname === `/${lang}`;

                  const isActive = isHash
                    ? activeSection === link.href.replace("#", "") && isHomePage
                    : pathname === link.href;

                  const linkClasses = cn(
                    "flex items-center justify-between text-sm font-black uppercase tracking-[0.2em] transition-all p-5 rounded-2xl border",
                    isActive
                      ? "bg-primary-500 text-white shadow-glow border-primary-500"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800 border-transparent",
                  );

                  // Case 1: Hash link when NOT on home page
                  if (isHash && !isHomePage) {
                    return (
                      <Link
                        key={link.label}
                        className={linkClasses}
                        href={`/${lang}${link.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                        <ArrowRight
                          size={18}
                          className={
                            isActive ? "text-white" : "text-primary-500"
                          }
                        />
                      </Link>
                    );
                  }

                  // Case 2: Route link (Blog)
                  if (!isHash) {
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={linkClasses}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                        <ArrowRight
                          size={18}
                          className={
                            isActive ? "text-white" : "text-primary-500"
                          }
                        />
                      </Link>
                    );
                  }

                  // Case 3: Hash link on home page
                  return (
                    <a
                      key={link.label}
                      className={linkClasses}
                      href={link.href}
                      onClick={() => handleNavClick(link.href.replace("#", ""))}
                    >
                      {link.label}
                      <ArrowRight
                        size={18}
                        className={isActive ? "text-white" : "text-primary-500"}
                      />
                    </a>
                  );
                })}
              </nav>
            </motion.div>

            {/* Login Button - Separated, Below the Menu Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="fixed inset-x-4 top-[calc(24rem+7.5rem)] z-[5002]" // Adjusting based on approximate menu height
            >
              <Link
                href={`/${lang}/auth/login`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-black uppercase tracking-[0.2em] transition-all p-5 rounded-[1.5rem] bg-primary-600 text-white shadow-glow border border-primary-500 hover:scale-[1.02] active:scale-95 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <LogIn size={20} />
                  <span>{common.login || "Masuk"}</span>
                </div>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
