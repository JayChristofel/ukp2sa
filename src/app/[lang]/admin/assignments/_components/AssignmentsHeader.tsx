"use client";

import React from "react";
import Link from "next/link";
import { Globe, ShieldCheck, Zap, ClipboardList } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/layouts";

interface AssignmentsHeaderProps {
  aa: any;
  common: any;
  lang: string;
  totalTasks: number;
}

export const AssignmentsHeader = ({
  aa,
  common,
  lang,
  totalTasks,
}: AssignmentsHeaderProps) => {
  return (
    <PageHeader
      title={
        <>
          {aa.title_main || "Agency"}{" "}
          <span className="text-primary italic">
            {aa.title_sub || "Assignments."}
          </span>
        </>
      }
      subtitle={
        <>
          <Globe size={14} className="text-primary" />{" "}
          {aa.subtitle || "Orkestrasi Aksi & Dispatch Lapangan"}
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            <ShieldCheck size={14} /> {common.verify_source || "Source Verified"}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Zap size={14} /> {common.real_time || "Real-time"}
          </div>
          <Button
            asChild
            className="bg-primary text-white px-8 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
          >
            <Link href={`/${lang}/admin/assignments/new`} prefetch={true}>
              <ClipboardList size={18} /> {aa.new_task}
            </Link>
          </Button>
        </div>
      }
    >
      <Badge className="h-7 rounded-xl bg-primary/10 text-primary border-primary/20 font-black text-xs px-3 shadow-sm animate-in fade-in slide-in-from-left duration-500 ml-3">
        {totalTasks}
      </Badge>
    </PageHeader>
  );
};
