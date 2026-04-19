"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Link as LinkIcon, Phone, ArrowRight, Bell, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui";
import { getCategoryIcon, getStatusColor } from "./AssignmentHelpers";

interface AssignmentDetailDialogProps {
  selectedTask: any;
  setSelectedTask: (task: any) => void;
  onPing: (assignee: string) => void;
  lang: string;
  d: any;
  common: any;
}

export const AssignmentDetailDialog = ({
  selectedTask,
  setSelectedTask,
  onPing,
  lang,
  d,
  common,
}: AssignmentDetailDialogProps) => {
  return (
    <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
      <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] md:max-h-[85vh] rounded-[2rem] md:rounded-[2.5rem] border-none bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-3xl p-0 overflow-hidden flex flex-col">
        {selectedTask && (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
              <DialogHeader className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl">
                    {getCategoryIcon(selectedTask.category)}
                  </div>
                  <Badge
                    className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 ${getStatusColor(
                      selectedTask.status,
                    )}`}
                  >
                    {selectedTask.status}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
                  {selectedTask.title}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1.5 min-w-fit">
                    Case ID: {selectedTask.id}
                  </span>
                  {selectedTask.sourceType && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded-md border border-primary/10 min-w-fit">
                      <LinkIcon size={10} /> {selectedTask.sourceType} EVIDENCE
                    </span>
                  )}
                  <span className="min-w-fit">
                    • {selectedTask.category} Sector
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
                <div className="space-y-8">
                  <div>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Keterangan Tugas
                    </h5>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary/20 pl-4 bg-slate-50 dark:bg-slate-900/50 py-4 rounded-r-xl">
                      &quot;{selectedTask.notes || "Tidak ada catatan tambahan."}&quot;
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Informasi Lokasi & PIC
                    </h5>
                    <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                      <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">Wilayah Operasional</p>
                        <span>{selectedTask.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                      <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">Penanggung Jawab</p>
                        <span>{selectedTask.assignee}</span>
                      </div>
                    </div>

                    {selectedTask.sourceId && (
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                          <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <LinkIcon size={18} />
                          </div>
                          <div>
                            <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">Referensi Sumber Data</p>
                            <span className="text-primary uppercase tracking-tighter">
                              [{selectedTask.sourceType}] ID: {selectedTask.sourceId}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Progres & Metrik</h5>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase text-slate-400">Penyelesaian</span>
                        <span className="text-2xl font-black text-primary">{selectedTask.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedTask.progress}%` }}
                          className="h-full bg-primary shadow-glow-primary"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">{d.label_created_at || "Waktu Laporan"}</span>
                          <span className="text-navy dark:text-white">
                            {new Date(selectedTask.createdAt).toLocaleDateString(lang, { day: "2-digit", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">{d.label_urgency || "Tingkat Urgensi"}</span>
                          <div className="flex items-center gap-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 h-2 w-28">
                            <div
                              className={`h-full ${selectedTask.urgencyScore > 75 ? "bg-rose-500" : "bg-primary"}`}
                              style={{ width: `${selectedTask.urgencyScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Kontak Darurat</h5>
                    <Button
                      variant="outline"
                      className="w-full justify-between px-6 py-7 rounded-2xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/5 group"
                    >
                      <div className="flex items-center gap-4">
                        <Phone size={18} className="group-hover:animate-bounce" />
                        <div className="text-left">
                          <p className="text-[8px] opacity-60">HUBUNGI PIC</p>
                          <span>{selectedTask.phone}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => onPing(selectedTask.assignee)}
                  className="flex-1 sm:flex-none px-8 py-5 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl gap-2 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
                >
                  <Bell size={16} /> Kirim Pengingat
                </Button>
                {selectedTask.status === "Resolved" && (
                  <div className="hidden sm:flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-4 border-l border-slate-200 dark:border-slate-700">
                    <CheckCircle2 size={16} /> Terverifikasi
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedTask(null)}
                className="w-full sm:w-auto font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-navy dark:hover:text-white"
              >
                {common.close_panel || "Tutup Panel"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
