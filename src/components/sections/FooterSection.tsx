"use client";

import React from "react";
import { Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/Accordion";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

import { useI18n } from "@/app/[lang]/providers";

export const FAQSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.footer || {};
  const FAQS = d.faq_list || [];
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="flex flex-col gap-12 py-20 relative"
      id="faq"
    >
      <div className="flex flex-col gap-4 text-center items-center">
        <motion.span
          variants={itemVariants}
          className="text-primary-600 dark:text-primary-400 font-black tracking-widest md:tracking-[0.25em] text-[10px] uppercase bg-primary-500/10 dark:bg-primary-500/20 px-5 py-2.5 rounded-full border border-primary-500/20 backdrop-blur-sm w-fit"
        >
          {d.faq_sub || "Pusat Bantuan"}
        </motion.span>
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-5xl font-black text-navy dark:text-white tracking-tight leading-tight"
        >
          {d.faq_title || "Pertanyaan Umum"}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto"
        >
          {d.faq_desc ||
            "Menyediakan informasi lengkap terkait transparansi sistem pelaporan infrastruktur kita."}
        </motion.p>
      </div>

      <motion.div
        variants={itemVariants}
        className="max-w-3xl mx-auto w-full min-h-[400px]"
      >
        {mounted ? (
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-navy dark:text-white font-bold py-6 hover:no-underline border-none">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 dark:text-slate-400 text-base leading-relaxed pb-6 border-none">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="w-full space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export const FooterSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.footer || {};
  const common = dict?.common || {};

  const FOOTER_NAV = [
    { name: d.nav?.reports || "Laporan", href: "#laporan" },
    { name: d.nav?.stats || "Statistik", href: "#statistik" },
    { name: d.nav?.map || "Peta Laporan", href: "#peta" },
  ];

  const FOOTER_SUPPORT = [
    {
      name: d.support?.privacy || "Kebijakan Privasi",
      href: "/privacy",
      isRoute: true,
    },
    {
      name: d.support?.terms || "Syarat & Ketentuan",
      href: "/terms",
      isRoute: true,
    },
    { name: d.support?.guide || "Panduan Pelaporan", href: "#faq" },
    { name: d.support?.contact || "Kontak Kami", href: "/kontak" },
  ];

  return (
    <footer className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl text-navy dark:text-white pt-24 pb-12 border-t border-primary-500/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 size-96 bg-primary-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 flex flex-col gap-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-24">
          <div className="sm:col-span-2 flex flex-col gap-8 text-center sm:text-left items-center sm:items-start">
            <div
              className="flex flex-col gap-6 group cursor-pointer items-center sm:items-start"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="flex items-center gap-4">
                <div className="size-14 md:size-16 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-3 shadow-glow group-hover:scale-105 transition-transform">
                  <Image
                    src="/assets/logo-ukp2sa.png"
                    alt="Logo UKP2SA"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <Image
                    src="/assets/logo-ukp2sa.png"
                    alt="Logo UKP2SA"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
                <div className="size-14 md:size-16 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-3 shadow-glow group-hover:scale-105 transition-transform">
                  <Image
                    src="/assets/logo-kemenkeu.png"
                    alt="Logo Kemenkeu"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="size-14 md:size-16 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-3 shadow-glow group-hover:scale-105 transition-transform">
                  <Image
                    src="/assets/Logo_kemensekneg.png"
                    alt="Logo Kemensetneg"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tighter">
                  UKP2SA
                </h2>
                <p className="text-[10px] md:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest md:tracking-[0.2em] mt-1">
                  {common.national_command_2 ||
                    "Unit Kerja Percepatan Pemulihan Aceh"}
                </p>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-base md:text-lg leading-relaxed font-medium">
              {d.description ||
                "Platform transparansi dan kolaborasi masyarakat Aceh untuk pembangunan infrastruktur yang lebih baik, merata, and berkelanjutan."}
            </p>
            <div className="flex gap-4">
              {[
                {
                  Icon: Globe,
                  href: "#",
                  label: "Website",
                },
                {
                  Icon: Mail,
                  href: "support@ukp2sa.id",
                  label: "Email",
                },
                {
                  Icon: Phone,
                  href: "#",
                  label: "Phone",
                },
              ].map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  className="size-12 md:size-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-center hover:bg-primary-500 hover:text-white hover:-translate-y-2 transition-all duration-500 border border-white/20 dark:border-slate-800/50 shadow-bento group"
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                >
                  <Icon
                    size={24}
                    className="group-hover:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-black text-navy dark:text-white mb-8 md:mb-10 text-[10px] uppercase tracking-widest md:tracking-[0.4em] opacity-60">
              {d.nav_title || "Navigasi Utama"}
            </h4>
            <ul className="flex flex-col gap-6 text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-[0.1em]">
              {FOOTER_NAV.map((item) => (
                <li key={item.name}>
                  <a
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block relative group"
                    href={item.href}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-black text-navy dark:text-white mb-8 md:mb-10 text-[10px] uppercase tracking-widest md:tracking-[0.4em] opacity-60">
              {d.support_title || "Support Center"}
            </h4>
            <ul className="flex flex-col gap-6 text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-[0.1em]">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.name}>
                  {item.isRoute ? (
                    <Link
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block relative group"
                      href={item.href}
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                    </Link>
                  ) : (
                    <a
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block relative group"
                      href={item.href}
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-500/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest md:tracking-[0.35em] text-center">
          <p>
            {d.copyright ||
              "© 2026 UKP2SA - Unit Kerja Percepatan Pemulihan Sumatera Aceh. HAK CIPTA DILINDUNGI."}
          </p>
        </div>
      </div>
    </footer>
  );
};
