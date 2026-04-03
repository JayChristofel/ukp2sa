"use client";

import React from "react";
import { Card } from "@/components/ui";
import { toast } from "sonner";
import {
  Users,
  Building2,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

export default function TrackingManagementPage() {
  const dict = useI18n();
  const t = dict?.tracking || {};
  const common = dict?.common || {};
  const params = useParams();
  const lang = (params?.lang as string) || "id";

  // Real data fetching from connected APIs
  const { data: ngoData = [], isLoading: isLoadingNgo } = useQuery({
    queryKey: ["trackingNgo"],
    queryFn: () => apiService.getNgo(1),
  });

  const { data: r3pData = [], isLoading: isLoadingR3p } = useQuery({
    queryKey: ["trackingR3p"],
    queryFn: () => apiService.getR3P(1).catch(() => []),
  });

  const handleDeleteAsset = (id: string) => {
    toast.success(`Simulation: Delete asset ${id} request sent.`);
  };

  const handleDeleteBeneficiary = (id: string) => {
    toast.success(`Simulation: Delete beneficiary record ${id} request sent.`);
  };

  const isLoading = isLoadingNgo || isLoadingR3p;

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href={`/${lang}/admin/tracking`}
            className="flex items-center gap-2 text-slate-500 hover:text-navy transition-all mb-4 font-bold text-xs uppercase tracking-widest group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {common.back || "Back to Dashboard"}
          </Link>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight">
            {t.manage_title || "Tracking Master Data"}
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Control Center for Beneficiaries & Asset Restoration
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-navy text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-navy/20">
          <Plus size={20} /> {t.add_new || "Add New Record"}
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-6 bg-white/50 dark:bg-slate-900/50 rounded-[3rem] backdrop-blur-xl border border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Loader2 className="animate-spin text-primary" size={48} />
            <Activity className="absolute inset-0 m-auto text-primary/50" size={20} />
          </div>
          <p className="font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">Synchronizing with Node API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Beneficiaries Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
                    {t.beneficiaries || "NGO Interventions"}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{ngoData.length} records found</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {ngoData.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
                   <p className="text-xs font-bold text-slate-400 italic">Database record is empty.</p>
                </div>
              )}
              {ngoData.map((n: any) => (
                <Card
                  key={n.id}
                  className="p-6 border-none rounded-[2.2rem] flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded">
                        {n.interventionCategory || "NGO"}
                      </span>
                    </div>
                    <div className="font-black text-navy dark:text-white group-hover:text-primary transition-colors">
                      {n.interventionActivityDescription?.slice(0, 60) || "Bantuan Kemanusiaan"}...
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                         <Activity size={12} className="text-emerald-500" /> {n.interventionBeneficiariesCount || 0} Souls
                      </span>
                      <span>•</span>
                      <span>{n.regency?.[0] || "Regional Area"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBeneficiary(n.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </Card>
              ))}
            </div>
          </section>

          {/* Assets Section */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 text-accent rounded-2xl shadow-inner">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
                    {t.assets || "Infrastructure R3P"}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{r3pData.length} active projects</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {r3pData.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
                   <p className="text-xs font-bold text-slate-400 italic">No asset projects tracked.</p>
                </div>
              )}
              {r3pData.map((r: any) => (
                <Card
                  key={r.id}
                  className="p-6 border-none rounded-[2.2rem] flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-accent/10 text-accent text-[8px] font-black uppercase rounded">
                        {r.projectType || "Restoration"}
                      </span>
                    </div>
                    <div className="font-black text-navy dark:text-white group-hover:text-accent transition-colors">
                      {r.projectName || r.location || "Pembangunan Infrastruktur"}
                    </div>
                    <div className="space-y-2 mt-3">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                          <span className="text-slate-400">Restoration Progress</span>
                          <span className="text-navy dark:text-white">{r.progress || 0}%</span>
                       </div>
                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)] transition-all duration-1000" 
                            style={{ width: `${r.progress || 0}%` }} 
                          />
                       </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAsset(r.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
