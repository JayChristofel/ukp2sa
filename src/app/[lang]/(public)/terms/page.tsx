"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Gavel,
  Scale,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";

export default function TermsAndConditionsPage() {
  const dict = useI18n();
  const t = dict?.terms;
  const common = dict?.common;
  const params = useParams();
  const lang = (params.lang as string) || "id";

  if (!t) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${lang}`}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors font-black uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} /> {common?.back || "Kembali"}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-none shadow-2xl p-8 md:p-16 space-y-12"
        >
          <div className="space-y-4 text-center">
            <div className="inline-flex p-4 rounded-3xl bg-accent-500/10 text-accent-500 mb-4">
              <Scale size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tight">
              {t.title}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {t.updated}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-300">
            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Gavel size={20} className="text-accent-500" /> {t.acceptance.title}
              </h2>
              <p className="leading-loose font-medium">
                {t.acceptance.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <CheckCircle2 size={20} className="text-accent-500" /> {t.eligibility.title}
              </h2>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                {t.eligibility.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <AlertCircle size={20} className="text-accent-500" /> {t.user_content.title}
              </h2>
              <p className="leading-loose font-medium">
                {t.user_content.intro}
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                {t.user_content.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Scale size={20} className="text-accent-500" /> {t.liability.title}
              </h2>
              <p className="leading-loose font-medium font-bold italic text-slate-700 dark:text-slate-200 bg-accent-500/5 p-6 rounded-3xl border border-accent-500/10">
                {t.liability.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <CheckCircle2 size={20} className="text-accent-500" /> {t.changes.title}
              </h2>
              <p className="leading-loose font-medium">
                {t.changes.content}
              </p>
            </section>
          </div>

          <div className="pt-12 border-t dark:border-slate-800">
            <div className="p-8 rounded-[2rem] bg-accent-500/5 border border-accent-500/10 text-center">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {t.agreement}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
