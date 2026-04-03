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
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LiteracyPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const articles: any = []; // auto-cleaned
  const isLoading: any = false; // auto-cleaned

  return (
    <div className="space-y-12">
      <Link
        href={`/${lang}/publik`}
        className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> Kembali ke Hub Publik
      </Link>

      <section>
        <div className="flex items-center gap-4 mb-4">
          <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tighter uppercase">
            Literasi <span className="text-primary italic">Pemulihan.</span>
          </h1>
        </div>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Artikel mendalam mengenai strategi, kebijakan, dan inovasi di balik
          percepatan pemulihan Sumatera-Aceh.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {isLoading ? (
          <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">
            Memuat Konten Edukasi...
          </div>
        ) : (
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
                      src={article.image}
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
                        "id-ID",
                        { month: "long", year: "numeric" },
                      )}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-navy dark:text-white mb-6 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                    {article.title}
                  </h2>
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
                      <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        Baca Lengkap <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      <section className="p-12 bg-navy rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <BookOpen size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">
            Punya Pertanyaan Strategis?
          </h3>
          <p className="text-white/60 text-lg mb-8 font-medium">
            Tim UKP2SA siap menjawab pertanyaan masyarakat mengenai mekanisme
            bantuan, pengelolaan anggaran, dan rencana pemulihan wilayah Anda.
          </p>
          <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Hubungi Media Center
          </button>
        </div>
      </section>
    </div>
  );
}
