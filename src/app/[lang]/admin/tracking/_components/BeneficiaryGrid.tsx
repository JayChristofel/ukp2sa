"use client";

import React from "react";
import { 
  Users, 
  ShoppingBag, 
  Tractor, 
  Waves, 
  Home 
} from "lucide-react";
import { Card } from "@/components/ui";

interface BeneficiaryGridProps {
  t: any;
  beneficiaries: any[];
  lang: string;
}

export const BeneficiaryGrid = ({
  t,
  beneficiaries,
  lang,
}: BeneficiaryGridProps) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "UMKM":
        return <ShoppingBag size={24} className="text-primary" />;
      case "Petani":
        return <Tractor size={24} className="text-emerald-500" />;
      case "Nelayan":
        return <Waves size={24} className="text-blue-500" />;
      case "Pengungsi":
        return <Home size={24} className="text-orange-500" />;
      default:
        return <Users size={24} className="text-primary" />;
    }
  };

  return (
    <section className="space-y-8 font-display">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shadow-inner">
          <Users size={26} />
        </div>
        <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight">
          {t.beneficiaries || "Penerima Manfaat"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {beneficiaries.map((b) => (
          <Card
            key={b.id}
            className="p-8 border-slate-100 dark:border-slate-800 rounded-[2rem] group hover:border-primary/40 transition-all shadow-xl bg-white dark:bg-slate-900 border-none"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-slate-100/50 dark:border-slate-700/50">
                  {getCategoryIcon(b.category)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
                    {b.category}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {b.totalPeople.toLocaleString(
                      lang === "en" ? "en-US" : "id-ID",
                    )}{" "}
                    {t.lives_covered || "Jiwa Tercover"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                  {b.impactMetric}
                </div>
                <div className="text-2xl font-black text-navy dark:text-white tabular-nums">
                  {b.impactValue}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
