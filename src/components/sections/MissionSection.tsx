"use client";

import React from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { useI18n } from "@/app/[lang]/providers";

export const MissionSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.mission || {};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative py-12 overflow-hidden"
      id="about"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full max-w-4xl bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[64px] pointer-events-none"
        style={{ willChange: "filter" }}
      />

      <motion.div
        variants={itemVariants}
        className="relative group order-2 lg:order-1"
      >
        <div className="absolute -inset-6 bg-primary-500/20 rounded-[3rem] blur-3xl group-hover:bg-primary-500/30 transition-all duration-1000 opacity-50"></div>
        <div className="relative aspect-video lg:aspect-[4/5] rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-700">
          <Image
            src="/assets/mesjidraya.jpg"
            alt="Mesjid Raya Baiturrahman Aceh"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      <div className="flex flex-col gap-8 md:gap-10 order-1 lg:order-2 text-center lg:text-left relative z-10">
        <div className="flex flex-col gap-4 items-center lg:items-start">
          <motion.span
            variants={itemVariants}
            className="text-accent-600 dark:text-accent-400 font-black tracking-widest md:tracking-[0.3em] text-[10px] md:text-[11px] uppercase bg-accent-500/10 px-5 py-2 rounded-full border border-accent-500/20"
          >
            {d.sub || "Visi & Misi"}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            style={{ fontSize: "clamp(2rem, 7.5vw, 4.25rem)" }}
            className="text-navy dark:text-white font-black leading-[1.0] tracking-tight"
          >
            {d.title_1 || "Transformasi Digital"} <br />
            {d.title_2 || "Untuk"}{" "}
            <span className="neon-gradient-text">
              {d.title_gradient || "Aceh Baru."}
            </span>
          </motion.h2>
        </div>

        <motion.p
          variants={itemVariants}
          className="text-slate-500 dark:text-slate-400 leading-relaxed text-clamp-subheading font-medium"
        >
          {d.description ||
            "Platform komunikasi dan informasi secara transparan untuk penanganan dan pemulihan pasca bencana Provinsi Aceh."}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <motion.div
            variants={itemVariants}
            className="bento-card group/card !p-7 h-full flex flex-col gap-5 border-primary-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 shrink-0 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 shadow-glow">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-base font-black text-navy dark:text-white uppercase tracking-widest">
                {d.vision_title || "Visi"}
              </h4>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {d.vision_desc ||
                "Menjamin kehadiran negara dalam setiap jengkal pembangunan melalui sistem pengawasan infrastruktur yang cepat, tepat, dan transparan."}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bento-card group/card !p-7 h-full flex flex-col gap-5 border-accent-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 shrink-0 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                <Zap size={32} />
              </div>
              <h4 className="text-base font-black text-navy dark:text-white uppercase tracking-widest">
                {d.mission_title || "Misi"}
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              {(
                d.mission_points || [
                  "Identifikasi kendala secara komprehensif untuk pemetaan masalah yang akurat.",
                  "Menghadirkan strategi solusi inovatif yang paling tepat sasaran.",
                  "Melakukan percepatan pemulihan dengan presisi dan efisiensi tinggi.",
                ]
              ).map((text: string, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="size-1.5 rounded-full bg-accent-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-left">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
