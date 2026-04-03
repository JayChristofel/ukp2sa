"use client";

import React, { useMemo } from "react";
import {
  Newspaper,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Users,
  Home,
  ShieldCheck,
  Search,
  Inbox,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui";
import { useI18n } from "@/app/[lang]/providers";
import { useBlogStore } from "@/hooks/useBlogStore";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useEffect } from "react";

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50 group hover:scale-[1.02] transition-all">
    <div className="flex justify-between items-start mb-6">
      <div
        className={`p-3 bg-${color}-500/10 text-${color}-500 rounded-2xl group-hover:bg-${color}-500 group-hover:text-white transition-colors`}
      >
        <Icon size={24} />
      </div>
      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-black uppercase">
        Live
      </span>
    </div>
    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </h4>
    <div className="text-4xl font-black text-navy dark:text-white tracking-tighter">
      {value}
    </div>
  </Card>
);

export default function BlogHub() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-slate-300 animate-pulse">
          Loading...
        </div>
      }
    >
      <BlogHubContent />
    </React.Suspense>
  );
}

function BlogHubContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params?.lang as string) || searchParams.get("lang") || "id";
  const dict = useI18n();
  const blogDict = dict?.blog || {};
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "PUBLIC_BLOG_VIEW",
      "PUBLIC",
      "Citizen accessed the recovery updates and news hub.",
    );
  }, [logActivity]);

  const { data: blogData, isLoading: loadingUpdates } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => apiService.getBlogPosts(1, 20),
    staleTime: 1000 * 60 * 5,
  });

  const updates = blogData?.data || [];

  // --- Trending Topics Logic (Top 3 by Views) ---
  const trendingArticles = useMemo(() => {
    return [...updates]
      .filter((upd: any) => upd.views !== undefined)
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  }, [updates]);

  const kpis: any = [];
  const loadingKPIs: any = false;

  const umkm: any = { totalUMKM: 0, pulih: 0 };
  const loadingUMKM: any = false;

  // --- Global Search Logic via Zustand ---
  const { searchQuery, setSearchQuery, resetSearch } = useBlogStore();

  const filteredUpdates = useMemo(() => {
    if (!searchQuery.trim()) return updates;
    const term = searchQuery.toLowerCase();
    return updates.filter(
      (upd: any) =>
        upd.title.toLowerCase().includes(term) ||
        upd.summary.toLowerCase().includes(term) ||
        upd.category.toLowerCase().includes(term),
    );
  }, [updates, searchQuery]);

  // Calculate dynamic stats
  const housingKPI = kpis.find(
    (k: any) =>
      k.indicator.toLowerCase().includes("rumah") ||
      k.indicator.toLowerCase().includes("hunian"),
  );

  const housingValue = loadingKPIs
    ? "..."
    : housingKPI
    ? housingKPI.actual.toLocaleString()
    : "0";

  const totalBeneficiaries = loadingUMKM
    ? "..."
    : umkm.totalUMKM
    ? (umkm.totalUMKM / 1000).toFixed(1) + "k"
    : "0";

  const areaTuntas = kpis.filter((k: any) => k.actual >= k.target).length;
  const programAktif = updates.length + kpis.length;

  const stats = [
    {
      icon: Home,
      label: blogDict.stats?.housing || "Rumah Dihuni",
      value: housingValue,
      color: "primary",
    },
    {
      icon: Users,
      label: blogDict.stats?.beneficiaries || "Penerima Manfaat",
      value: totalBeneficiaries,
      color: "indigo",
    },
    {
      icon: ShieldCheck,
      label: blogDict.stats?.completed_area || "Area Tuntas",
      value: loadingKPIs ? "..." : areaTuntas.toString(),
      color: "emerald",
    },
    {
      icon: CheckCircle2,
      label: blogDict.stats?.active_programs || "Program Aktif",
      value: loadingUpdates || loadingKPIs ? "..." : programAktif.toString(),
      color: "amber",
    },
  ];

  const dateLocale = lang === "en" ? "en-US" : "id-ID";

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section>
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black text-navy dark:text-white tracking-tighter mb-6 leading-[0.9]">
            {blogDict.hero_title_1} <br />
            <span className="text-primary italic">
              {blogDict.hero_title_2}
            </span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {blogDict.hero_description}
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Latest News Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-navy dark:text-white flex items-center gap-3">
              <Newspaper className="text-primary" />{" "}
              {blogDict.stories_title}
            </h3>
            <Link
              href={`/${lang}/blog/update`}
              className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group"
            >
              {blogDict.view_all}{" "}
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredUpdates.map((upd: any) => (
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
            ))}

            {filteredUpdates.length === 0 && !loadingUpdates && (
              <div className="py-24 bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center px-10">
                <div className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-primary/10 text-primary mb-8 animate-pulse">
                  <Inbox size={40} />
                </div>
                <h4 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-3">
                  {blogDict.no_stories_title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed mb-10">
                  {blogDict.no_stories_desc}
                </p>
                {searchQuery && (
                  <button
                    onClick={resetSearch}
                    className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow hover:scale-105 transition-all"
                  >
                    {blogDict.reset_search}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side Module: Quick Checks */}
        <div className="space-y-8">
          <Card className="p-8 border-none rounded-[2.5rem] bg-navy text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Search size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-4 uppercase tracking-tight">
                {blogDict.search_title}
              </h4>
              <p className="text-xs text-white/60 mb-8 font-medium leading-relaxed">
                {blogDict.search_description}
              </p>
              <div className="relative group/input">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/40 group-focus-within/input:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={blogDict.search_placeholder}
                  className="w-full py-5 pl-14 pr-6 bg-white text-navy rounded-2xl font-bold text-sm shadow-xl focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={resetSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-navy uppercase bg-slate-100 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white">
            <h4 className="text-lg font-black text-navy dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              {blogDict.trending_title}
            </h4>
            <div className="space-y-6">
              {trendingArticles.map((item: any, i) => (
                <Link
                  key={item.id}
                  href={`/${lang}/blog/read?id=${item.id}`}
                  className="flex gap-4 items-center group cursor-pointer"
                >
                  <div className="size-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                    <span className="text-xs font-black text-slate-300 group-hover:text-primary">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-navy dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight line-clamp-2">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Eye size={10} /> {item.views?.toLocaleString() || 0}{" "}
                      {blogDict.views_count}
                    </div>
                  </div>
                </Link>
              ))}
              {trendingArticles.length === 0 && (
                <div className="py-8 px-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] text-center">
                  <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {blogDict.no_trending}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
