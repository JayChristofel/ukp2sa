"use client";

import React, { useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  Search,
  Filter,
  Inbox,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { useBlogStore } from "@/hooks/useBlogStore";
import { Card } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

const getCategories = (blogDict: any) => [
  blogDict.category_all || "Semua",
  blogDict.category_news || "Berita",
  blogDict.category_announcement || "Pengumuman",
  blogDict.category_literacy || "Literasi",
  blogDict.category_hoax || "Hoaks & Klarifikasi",
];

export default function AllUpdatesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-20 text-center uppercase font-black text-slate-300 animate-pulse">
          Loading...
        </div>
      }
    >
      <AllUpdatesContent />
    </React.Suspense>
  );
}

function AllUpdatesContent() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = useI18n();
  const blogDict = dict?.blog || {};

  const { searchQuery, setSearchQuery, resetSearch } = useBlogStore();

  const CATEGORIES = getCategories(blogDict);
  const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0]);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blog-posts-all"],
    queryFn: () => apiService.getBlogPosts(1, 100),
    staleTime: 1000 * 60 * 5,
  });

  const updates = blogData?.data || [];

  const filteredUpdates = useMemo(() => {
    return updates.filter((upd: any) => {
      const matchesSearch =
        upd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        upd.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const catKey = selectedCategory.toLowerCase();
      const isAll = catKey === CATEGORIES[0].toLowerCase() || catKey === "all" || catKey === "semua";
      
      const matchesCategory = isAll || upd.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [updates, searchQuery, selectedCategory, CATEGORIES]);

  const dateLocale = lang === "en" ? "en-US" : "id-ID";

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumbs & Back */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link
          href={`/${lang}/blog`}
          className="flex items-center gap-2 text-primary hover:text-navy transition-colors"
        >
          <ArrowLeft size={14} /> Blog
        </Link>
        <ChevronRight size={10} />
        <span className="text-navy dark:text-white">
          {blogDict.archive_title}
        </span>
      </div>

      {/* Header Section */}
      <section className="relative">
        <div className="absolute -top-20 -right-20 size-64 bg-primary-500/5 blur-[100px] rounded-full -z-10" />
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black text-navy dark:text-white tracking-tighter mb-6 leading-tight uppercase">
            {blogDict.archive_title_prefix}{" "}
            <span className="text-primary italic">
              {blogDict.archive_title_suffix}
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {blogDict.archive_description}
          </p>
        </div>
      </section>

      {/* Toolbar: Search & Filter */}
      <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={blogDict.search_placeholder}
            className="w-full py-4 pl-14 pr-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200/50 dark:shadow-none focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-800 mr-2 shrink-0">
            <Filter size={16} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {blogDict.category_label}
            </span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-glow"
                  : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"
            />
          ))
        ) : filteredUpdates.length > 0 ? (
          filteredUpdates.map((upd: any) => (
            <Card
              key={upd.id}
              className="p-0 border-none rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden group flex flex-col border border-slate-50 dark:border-slate-800"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={
                    upd.image ||
                    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={upd.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-primary shadow-sm border border-primary/10">
                    {upd.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <Clock size={12} />{" "}
                  {new Date(upd.publishDate).toLocaleDateString(dateLocale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Link href={`/${lang}/blog/read?id=${upd.id}`}>
                  <h3 className="text-xl font-black text-navy dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
                    {upd.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 mb-8 line-clamp-3 leading-relaxed flex-1 italic">
                  &quot;{upd.summary}&quot;
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {upd.author}
                  </span>
                  <Link
                    href={`/${lang}/blog/read?id=${upd.id}`}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest group/btn"
                  >
                    {blogDict.read_btn_label}{" "}
                    <ArrowUpRight
                      size={14}
                      className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center text-center">
            <div className="size-24 rounded-[2rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 mb-8">
              <Inbox size={48} />
            </div>
            <h4 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-2">
              {blogDict.no_results}
            </h4>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              {blogDict.no_results_desc}
            </p>
            <button
              onClick={() => {
                resetSearch();
                setSelectedCategory(CATEGORIES[0]);
              }}
              className="px-10 py-4 bg-navy text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all"
            >
              {blogDict.reset_filter}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
