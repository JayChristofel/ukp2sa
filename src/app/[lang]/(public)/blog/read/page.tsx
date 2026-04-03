"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Bookmark,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

export default function BlogPostPage() {
  const dict = useI18n();
  const readDict = dict?.blog?.read || {};
  
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
          {readDict.loading || "Loading..."}
        </div>
      }
    >
      <BlogPostContent />
    </Suspense>
  );
}

function BlogPostContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const lang = (params?.lang as string) || "id";
  const dict = useI18n();
  const readDict = dict?.blog?.read || {};

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => apiService.getBlogPost(id),
    enabled: !!id,
  });

  const article = blogData;

  if (isLoading) {
    return (
      <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
        {readDict.loading}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-navy mb-4">
          {readDict.not_found}
        </h2>
        <Link
          href={`/${lang}/blog`}
          className="text-primary font-black uppercase text-xs"
        >
          {readDict.back_btn}
        </Link>
      </div>
    );
  }

  const dateLocale = lang === "en" ? "en-US" : "id-ID";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Header */}
      <div className="space-y-6">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> {readDict.back}
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar size={14} />{" "}
            {new Date(article.publishDate).toLocaleDateString(dateLocale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={14} />{" "}
            {article.content?.split(" ").length / 200 > 1
              ? Math.ceil(article.content.split(" ").length / 200)
              : 1}{" "}
            {readDict.min_read}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-navy dark:text-white tracking-tighter leading-[0.9] uppercase">
          {article.title}
        </h1>

        <div className="flex items-center justify-between py-8 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 shadow-inner">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-navy dark:text-white uppercase tracking-tight">
                {article.author}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                {readDict.contributor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div
          className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed space-y-6 font-medium"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-12 border-t border-slate-100 dark:border-slate-800">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <section className="p-12 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/20 text-center space-y-6">
        <h3 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight">
          {readDict.thanks}
        </h3>
        <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">
          {readDict.thanks_desc}
        </p>
        <Link
          href={`/${lang}/blog`}
          className="inline-block px-10 py-5 bg-navy text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all"
        >
          {readDict.other_articles}
        </Link>
      </section>
    </motion.div>
  );
}
