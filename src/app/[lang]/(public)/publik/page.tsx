"use client";

import React from "react";
import {
  Newspaper,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Users,
  Home,
  ShieldCheck,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui";

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

export default function PublicHub() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <PublicHubContent />
    </React.Suspense>
  );
}

function PublicHubContent() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const updates: any = [];

  const stats = [
    { icon: Home, label: "Rumah Dihuni", value: "24,812", color: "primary" },
    { icon: Users, label: "Penerima Manfaat", value: "82.4k", color: "indigo" },
    { icon: ShieldCheck, label: "Area Tuntas", value: "128", color: "emerald" },
    {
      icon: CheckCircle2,
      label: "Program Aktif",
      value: "412",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section>
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black text-navy dark:text-white tracking-tighter mb-6 leading-[0.9]">
            Pemulihan Sumatera-Aceh <br />
            <span className="text-primary italic">Transparan & Terukur.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Selamat datang di Portal Transparansi Nasional. Kami membuka akses
            informasi bagi seluruh masyarakat untuk memantau setiap rupiah dan
            progres pembangunan di wilayah pascabencana.
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
              <Newspaper className="text-primary" /> Update Mingguan
            </h3>
            <Link
              href={`/${lang}/publik/update`}
              className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group"
            >
              Lihat Semua{" "}
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {updates.map((upd: any) => (
              <Card
                key={upd.id}
                className="p-0 border-none rounded-[2.5rem] bg-white shadow-xl overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {upd.image && (
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                      <Image
                        src={upd.image}
                        alt={upd.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-primary shadow-sm">
                          {upd.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-8 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <Clock size={12} />{" "}
                      {new Date(upd.publishDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h4 className="text-xl font-black text-navy dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                      {upd.title}
                    </h4>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 italic">
                      &quot;{upd.summary}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        By: {upd.author}
                      </span>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:underline">
                        Baca Lengkap
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
                Cek Laporan Publik
              </h4>
              <p className="text-xs text-white/60 mb-8 font-medium leading-relaxed">
                Ingin tahu status laporan di wilayah Anda? Gunakan fitur pantau
                untuk melihat update terkini dari pemerintah.
              </p>
              <Link
                href={`/${lang}/laporan/cek`}
                className="w-full py-4 bg-white text-navy rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                <Search size={16} /> Cari Laporan
              </Link>
            </div>
          </Card>

          <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white">
            <h4 className="text-lg font-black text-navy dark:text-white mb-6 uppercase tracking-tight">
              Literasi Terkini
            </h4>
            <div className="space-y-6">
              {[
                "Strategi Percepatan Jalur Udara Aceh",
                "Digital Trail: Menghapus Celah Korupsi",
                "Peran NGO dalam Pemulihan Ekonomi",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center group cursor-pointer"
                >
                  <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-sm font-black text-navy dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/20">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck size={48} className="text-primary mb-4" />
              <h5 className="font-black text-navy uppercase text-xs mb-2 tracking-widest">
                Integrity Guaranteed
              </h5>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                Setiap data yang ditampilkan telah melalui proses validasi
                bertingkat oleh Tim Data Nasional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
