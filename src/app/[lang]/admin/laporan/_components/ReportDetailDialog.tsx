"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Badge, Button } from "@/components/ui";
import { 
  Image as ImageIcon, 
  Maximize2, 
  MapIcon, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Truck 
} from "lucide-react";
import Image from "next/image";

interface ReportDetailDialogProps {
  report: any;
  onClose: () => void;
  lang: string;
  ar: any;
  getPriorityColor: (p: string) => string;
  setPreviewImage: (url: string) => void;
  onDispatch: (report: any) => void;
}

export const ReportDetailDialog = ({
  report: r,
  onClose,
  lang,
  ar,
  getPriorityColor,
  setPreviewImage,
  onDispatch,
}: ReportDetailDialogProps) => {
  if (!r) return null;

  const sourceColor =
    r.sourceType === "SAR"
      ? "bg-rose-500"
      : r.sourceType === "KONFLIK"
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <Dialog open={!!r} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] rounded-[2rem] border-none bg-white dark:bg-slate-900 font-display overflow-hidden flex flex-col p-0 shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <DialogHeader className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 ${getPriorityColor(r.displayPriority)}`}>
                  {r.displayPriority} {ar.priority_tag}
                </Badge>
                <Badge className={`rounded-lg border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 text-white ${sourceColor}`}>
                  {r.sourceType} {ar.evidence_tag}
                </Badge>
              </div>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
              {r.displayTitle}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest mt-2 flex items-center gap-2">
              {ar.trace_id}: {r.id || "N/A"} • {r.category || r.sourceType || "General"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 md:space-y-8 py-6 md:py-8 border-y border-slate-100 dark:border-slate-800">
            {/* 🖼️ Evidence Gallery */}
            {(r.attachment?.images?.length > 0 || r.images?.length > 0) && (
              <div className="space-y-4">
                <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} className="text-primary" /> {ar.evidence_images}
                </h5>
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {(r.attachment?.images || r.images || []).map((img: string, i: number) => (
                      <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                          <Image
                            src={img}
                            alt="Evidence"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(img);
                            }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-zoom-in"
                          >
                            <Maximize2 size={32} className="text-white drop-shadow-lg" />
                          </button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-end gap-2 mt-4 pr-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </Carousel>
              </div>
            )}

            {/* 🗺️ Map */}
            {r.coordinate && (
              <div className="space-y-4">
                <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapIcon size={14} className="text-rose-500" /> {ar.location_gis}
                </h5>
                <div className="w-full h-40 md:h-48 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-900/50 relative group">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="rounded-xl font-black text-[8px] uppercase tracking-widest gap-2 shadow-lg" asChild>
                      <a href={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={12} /> {ar.google_maps_btn}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} className="text-primary" /> {ar.intel_detail}
              </h5>
              <div className="p-4 md:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-primary/20 dark:border-primary/40 pl-4 md:pl-6">
                  &quot;{r.displayDesc}&quot;
                </p>
              </div>
            </div>

            {/* Source Specifics */}
            {r.sourceType === "LAPORAN" && r.answers && (
              <div className="space-y-4">
                <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> {ar.tilikan_results}
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {r.answers.map((ans: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">{ans.question}</span>
                      <span className="text-xs font-bold text-navy dark:text-white">
                        {typeof ans.answer === "object"
                          ? Array.isArray(ans.answer) ? ans.answer.map((a: any) => a.label).join(", ") : ans.answer?.label || "-"
                          : ans.answer === true ? "Ya" : ans.answer === false ? "Tidak" : ans.answer || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {r.sourceType === "SAR" && (
              <div className="space-y-4">
                <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-rose-500" /> {ar.subject_profile}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                    <span className="text-[9px] font-black text-rose-400 uppercase">{ar.age_gender}</span>
                    <p className="text-xs font-bold text-navy dark:text-white">
                      {r.missingPersonDetails?.age || "-"} Tahun / {r.missingPersonDetails?.gender === "male" ? "Laki-laki" : "Perempuan"}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                    <span className="text-[9px] font-black text-rose-400 uppercase">{ar.report_status}</span>
                    <p className="text-xs font-bold text-navy dark:text-white">{r.status || "Aktif"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                  <div className="size-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">{ar.focus_area}</p>
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2">{r.displayLocation}</span>
                      {r.coordinate && (
                        <a href={`https://www.google.com/maps?q=${r.coordinate.y},${r.coordinate.x}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 shrink-0">
                          <MapIcon size={12} /> <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                  <div className="size-10 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">{ar.report_time}</p>
                    <span>{new Date(r.displayDate).toLocaleDateString(lang, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                  <div className="size-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">{ar.reporter_id}</p>
                    <span className="truncate block">{r.respondentInfo?.fullName || r.fullName || "Anonim"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-navy dark:text-white">
                  <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="uppercase tracking-widest opacity-40 text-[8px] mb-0.5">{ar.reporter_contact}</p>
                    <span className="truncate block">{r.respondentInfo?.phoneNumber || r.contactPhone || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={() => onDispatch(r)}
            className="w-full sm:w-auto px-10 py-6 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl gap-3 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all outline-none border-none shrink-0"
          >
            <Truck size={18} /> {ar.dispatch_btn}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto font-black uppercase text-[10px] tracking-widest text-slate-400 dark:text-slate-500 hover:text-navy dark:hover:text-white">
            {ar.close_btn}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
