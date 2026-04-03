"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";

export default function PrivacyPolicyPage() {
  const dict = useI18n();
  const p = dict?.privacy;
  const common = dict?.common;
  const params = useParams();
  const lang = (params.lang as string) || "id";

  if (!p) return null;

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
            <div className="inline-flex p-4 rounded-3xl bg-primary-500/10 text-primary-500 mb-4">
              <Shield size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tight">
              {p.title}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {p.updated}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Lock size={20} className="text-primary-500" /> {p.introduction.title}
              </h2>
              <p className="leading-loose font-medium">
                {p.introduction.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Eye size={20} className="text-primary-500" /> {p.collection.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-black/20 border border-slate-200/50 dark:border-slate-800/50">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-2 text-primary-500">
                    {p.collection.identity_title}
                  </h3>
                  <p className="text-sm font-medium">
                    {p.collection.identity_content}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-black/20 border border-slate-200/50 dark:border-slate-800/50">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-2 text-primary-500">
                    {p.collection.location_title}
                  </h3>
                  <p className="text-sm font-medium text-rose-500/80 dark:text-rose-400">
                    {p.collection.location_content}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <FileText size={20} className="text-primary-500" /> {p.usage.title}
              </h2>
              <p className="leading-loose font-medium">
                {p.usage.intro}
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                {p.usage.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Shield size={20} className="text-primary-500" /> {p.security.title}
              </h2>
              <p className="leading-loose font-medium p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                {p.security.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Lock size={20} className="text-primary-500" /> {p.rights.title}
              </h2>
              <p className="leading-loose font-medium">
                {p.rights.content}
              </p>
            </section>
          </div>

          <div className="pt-12 border-t dark:border-slate-800">
            <div className="p-8 rounded-[2rem] bg-primary-500/5 border border-primary-500/10 text-center">
              <p className="text-sm font-black text-slate-500 dark:text-slate-400">
                {p.contact_us}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
