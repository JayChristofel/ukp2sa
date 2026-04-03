"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/providers";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

export default function AdminBlogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400 animate-pulse">
          Loading Context...
        </div>
      }
    >
      <AdminBlogPageContent />
    </React.Suspense>
  );
}

function AdminBlogPageContent() {
  const dict = useI18n();
  const db = dict?.blog || {};
  const common = dict?.common || {};
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "id";

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "BLOG_VIEW",
      "SYSTEM",
      "User accessed the blog and content management system.",
    );
  }, [logActivity]);

  const categories = [
    { id: "all", label: common.all || "Semua" },
    { id: "news", label: db.category_news || "Berita" },
    { id: "announcement", label: db.category_announcement || "Pengumuman" },
    { id: "literacy", label: db.category_literacy || "Literasi" },
    {
      id: "hoax",
      id_label: "hoax",
      label: db.category_hoax || "Hoaks & Klarifikasi",
    },
  ];

  // Placeholder for real data
  const articles: any[] = [];
  const isLoading = false;

  const handleEdit = (id: string) => {
    router.push(`/${lang}/admin/blog/edit/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(common.confirm_delete || "Hapus artikel ini?")) {
      toast.success(common.delete_success || "Artikel berhasil dihapus");
      logActivity(
        "ARTICLE_REMOVED",
        "SYSTEM",
        `User removed article: ${title}`,
        "warn",
      );
      addNotification({
        title: "Artikel Dihapus",
        description: `Artikel "${title}" telah dihapus oleh tim admin.`,
        type: "system",
        priority: "medium",
      });
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {db.title_main || "Manajemen Konten"}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-primary" />{" "}
            {db.subtitle || "Portal Berita & Literasi Pemulihan Nasional"}
          </p>
        </div>
        <Link href={`/${lang}/admin/blog/new`}>
          <Button className="px-8 py-4 shadow-glow-primary hover:translate-y-[-2px] transition-all rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest gap-2">
            <Plus size={16} /> {db.add_btn || "Tulis Artikel Baru"}
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="relative w-full xl:max-w-md">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={common.search_placeholder || "Cari sesuatu..."}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full xl:w-auto pb-2 xl:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">{db.th_article || "Artikel"}</th>
                <th className="px-8 py-5">{db.th_category || "Kategori"}</th>
                <th className="px-8 py-5">{db.th_status || "Status"}</th>
                <th className="px-8 py-5">{db.th_date || "Tanggal"}</th>
                <th className="px-8 py-5 text-right">
                  {common.action || "Aksi"}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="size-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {common.loading || "Memuat..."}
                    </p>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <FileText size={32} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {db.no_articles || "Belum ada artikel"}
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((article: any) => (
                  <tr
                    key={article.id}
                    className="group border-b border-slate-50 dark:border-slate-800 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {article.image && (
                            <Image
                              src={article.image}
                              alt={article.title || ""}
                              width={56}
                              height={56}
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-navy dark:text-white uppercase text-sm tracking-tight line-clamp-1">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {article.views} Views
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {article.duration} Min
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        variant="outline"
                        className="rounded-lg border-primary/20 text-primary font-black uppercase text-[9px] tracking-widest"
                      >
                        {article.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      {article.status === "published" ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-black uppercase text-[9px] tracking-widest">
                          <CheckCircle2 size={12} />{" "}
                          {db.status_published || "Terbit"}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-500 font-black uppercase text-[9px] tracking-widest">
                          <AlertCircle size={12} /> {db.status_draft || "Draft"}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-bold text-slate-500">
                        {new Date(article.createdAt).toLocaleDateString(
                          lang === "en" ? "en-US" : "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEdit(article.id)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-400"
                          onClick={() =>
                            handleDelete(article.id, article.title)
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </Card>
      </motion.div>
    </div>
  );
}
