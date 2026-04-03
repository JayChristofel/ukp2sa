"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ArrowUpRight,
  Clock,
  User,
  Share2,
  Bookmark,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

export default function LiteracyPage() {
  const dict = useI18n();
  const litDict = dict?.blog?.literacy || {};

  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-slate-300 animate-pulse">
          {litDict.loading || "Loading..."}
        </div>
      }
    >
      <LiteracyContent />
    </React.Suspense>
  );
}

function LiteracyContent() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = useI18n();
  const litDict = dict?.blog?.literacy || {};
  const blogDict = dict?.blog || {};

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blog-posts-literacy"],
    queryFn: () => apiService.getBlogPosts(1, 20),
    staleTime: 1000 * 60 * 10,
  });

  const articles = blogData?.data?.filter((a: any) => a.category === "Literasi") || [];

  const dateLocale = lang === "en" ? "en-US" : "id-ID";

  return (
    <div className="space-y-12">
      <button
        onClick={() => router.push(`/${lang}/blog`)}
        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> {blogDict.archive?.back_to_blog}
      </button>

      <section>
        <div className="flex items-center gap-4 mb-4">
          <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tighter uppercase">
            {litDict.title_1} <span className="text-primary italic">{litDict.title_2}</span>
          </h1>
        </div>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          {litDict.description}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {isLoading ? (
          <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
            {blogDict.read?.loading}
          </div>
        ) : articles.length > 0 ? (
          articles.map((article: any) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-5 relative">
                  <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <Image
                      src={article.image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="md:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock size={12} />{" "}
                      {new Date(article.publishDate).toLocaleDateString(
                        dateLocale,
                        { month: "long", year: "numeric" },
                      )}
                    </div>
                  </div>
                  <Link href={`/${lang}/blog/read?id=${article.id}`}>
                    <h2 className="text-3xl font-black text-navy dark:text-white mb-6 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-lg text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                        <User size={14} />
                      </div>
                      <span className="text-[10px] font-black text-navy dark:text-white uppercase tracking-widest">
                        {article.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                        <Bookmark size={18} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                        <Share2 size={18} />
                      </button>
                      <Link
                        href={`/${lang}/blog/read?id=${article.id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                      >
                        {blogDict.read_more || "Baca Lengkap"} <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">
            {blogDict.no_articles || "Belum ada artikel"}
          </div>
        )}
      </div>

      <section className="p-12 bg-navy rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <BookOpen size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">
            {litDict.education_title}
          </h3>
          <p className="text-white/60 text-lg mb-8 font-medium">
            {litDict.education_desc}
          </p>
          <Link 
            href={`/${lang}/blog/update`}
            className="inline-block px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            {blogDict.archive_title || "Lihat Arsip"}
          </Link>
        </div>
      </section>
    </div>
  );
}
