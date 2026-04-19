"use client";

import React from "react";
import Image from "next/image";
import { Card } from "../ui";
import { ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { useI18n } from "@/app/[lang]/providers";

interface PartnerMeta {
  color: string;
  bg: string;
}

const PARTNER_META: Record<string, PartnerMeta> = {
  p1: {
    color: "text-primary",
    bg: "bg-primary/5",
  },
  p2: {
    color: "text-accent",
    bg: "bg-accent/5",
  },
  p3: {
    color: "text-primary",
    bg: "bg-primary/5",
  },
  p4: {
    color: "text-accent",
    bg: "bg-accent/5",
  },
};

export const PartnersSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.partners || {};
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  interface Partner {
    id: string;
    name: string;
    imageSrc: string;
    color: string;
    bg: string;
  }

  const partners: Partner[] = (d.partner_list || []).map(
    (p: { id: string; name: string }) => ({
      ...p,
      ...(PARTNER_META[p.id] || { color: "text-primary", bg: "bg-primary/5" }),
      imageSrc: "/assets/Logo MM.png",
    }),
  );

  return (
    <section className="flex flex-col gap-10 md:gap-16 py-10">
      <div className="flex flex-col gap-3 text-center items-center">
        <span className="text-primary font-black tracking-[0.3em] text-[10px] uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          {d.sub || "Kolaborasi"}
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tight">
          {d.title || "Partner Strategis & Instansi"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl px-6">
          {d.description ||
            "Bekerja sama dengan berbagai instansi pemerintah untuk memastikan setiap laporan ditindaklanjuti secara profesional dan transparan."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-0">
        {partners.map((partner) => (
          <Card
            key={partner.name}
            className="p-8 md:p-8 flex flex-col items-center text-center group hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem]"
          >
            <div
              className={`size-32 rounded-2xl ${partner.bg} flex items-center justify-center ${partner.color} group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6`}
            >
              <Image
                src={partner.imageSrc}
                alt={`Logo ${partner.name}`}
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
            </div>
            <h4 className="font-black text-navy dark:text-white text-xl tracking-tighter mb-4 group-hover:text-primary transition-colors">
              {partner.name}
            </h4>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Redirect to login first for Partners, preserving locale and setting target
                router.push(`/${lang}/auth/login?target=${partner.id || "p1"}`);
              }}
              className="mt-auto py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all duration-300 border border-transparent hover:border-primary/30 shadow-sm flex items-center justify-center gap-2 px-6"
            >
              {d.button || "Pelajari Lebih Lanjut"} <ArrowRight size={16} />
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
};
