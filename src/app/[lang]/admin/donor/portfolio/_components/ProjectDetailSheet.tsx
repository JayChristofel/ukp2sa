"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { 
  Activity, 
  ShieldCheck, 
  ImageIcon, 
  ChevronRight 
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import Image from "next/image";

interface ProjectDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: any;
  formatCurrency: (val: number) => string;
  onViewInClearingHouse: () => void;
}

export const ProjectDetailSheet = ({
  isOpen,
  onOpenChange,
  selectedProject,
  formatCurrency,
  onViewInClearingHouse,
}: ProjectDetailSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 border-none overflow-y-auto no-scrollbar font-display bg-white dark:bg-slate-900 shadow-2xl">
        {selectedProject && (
          <div className="flex flex-col h-full">
            <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-lg">
              {selectedProject.image ? (
                <Image
                  src={selectedProject.image}
                  className="w-full h-full object-cover"
                  alt={selectedProject.programName || selectedProject.name || ""}
                  width={600}
                  height={400}
                />
              ) : (
                <ImageIcon
                  size={48}
                  className="text-slate-300 dark:text-slate-600 opacity-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <Badge className="mb-2 bg-emerald-500 text-white font-black uppercase text-[9px] tracking-widest border-none px-2.5 py-1">
                  {selectedProject.programName ? "Active Project" : "Activity Log"}
                </Badge>
                <SheetTitle className="text-2xl font-black text-white leading-tight uppercase tracking-tight shadow-sm">
                  {selectedProject.programName || selectedProject.name}
                </SheetTitle>
                <SheetDescription className="sr-only text-slate-400">
                  {selectedProject.details || "Rincian detail dari proyek atau aktivitas terpilih."}
                </SheetDescription>
              </div>
            </div>

            <div className="p-8 space-y-10">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-5 bg-slate-50 dark:bg-slate-800/80 border-none shadow-inner rounded-3xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">
                    Status
                  </p>
                  <p className="text-sm font-black text-primary uppercase">
                    {selectedProject.status || "In Progress"}
                  </p>
                </Card>
                <Card className="p-5 bg-slate-50 dark:bg-slate-800/80 border-none shadow-inner rounded-3xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">
                    Progress
                  </p>
                  <p className="text-sm font-black text-primary">
                    {selectedProject.percentage || selectedProject.progress || 0}%
                  </p>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                  <Activity size={14} className="text-primary" /> Rincian Program
                </h4>
                <div className="space-y-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {[
                    { label: "Sektor", val: selectedProject.sector || "NGO / Kemanusiaan" },
                    { label: "Lokasi", val: selectedProject.location },
                    { label: "Alokasi Anggaran", val: formatCurrency(selectedProject.budget || 500000000) },
                    { label: "Outcome Target", val: selectedProject.outcome || "Bantuan Terdampak" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3 last:border-none">
                      <span className="opacity-70">{row.label}</span>
                      <span className="text-navy dark:text-white font-black uppercase text-[10px] text-right">
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-7 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-sm">
                <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} /> Audit Trail & Update Akutual
                </h5>
                <p className="text-[11px] italic text-slate-500 dark:text-slate-300 font-bold mb-6 leading-relaxed">
                  &quot;Informasi sudah divalidasi oleh clearing house nasional menggunakan metode multi-factor verification.&quot;
                </p>
                <Button
                  onClick={onViewInClearingHouse}
                  className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-primary border-none"
                >
                  Buka di Clearing House <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
