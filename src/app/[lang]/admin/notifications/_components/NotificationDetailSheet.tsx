"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import { 
  CreditCard, 
  FileText, 
  Info, 
  CheckCircle2, 
  Bell, 
  ChevronRight 
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface NotificationDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNotif: any;
  dict: any;
  n: any;
  lang: string;
}

export const NotificationDetailSheet = ({
  isOpen,
  onOpenChange,
  selectedNotif,
  dict,
  n,
  lang,
}: NotificationDetailSheetProps) => {
  const router = useRouter();
  const cats = n.categories || {};

  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard size={20} className="text-emerald-500" />;
      case "report":
        return <FileText size={20} className="text-primary-500" />;
      case "system":
        return <Info size={20} className="text-blue-500" />;
      case "assignment":
        return <CheckCircle2 size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[500px] border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 font-display z-[9999]">
        {selectedNotif && (
          <div className="flex flex-col h-full">
            <SheetHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                  {getIcon(selectedNotif.type)}
                </div>
                <div>
                  <SheetTitle className="text-2xl font-black text-navy dark:text-white uppercase tracking-tighter">
                    {dict?.common?.detail || "Detail"}{" "}
                    <span className="text-primary italic">
                      {n.title_sub || "Notifikasi."}
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {dict?.common?.id || "ID"}: {selectedNotif.id} • {selectedNotif.date}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 px-8 space-y-8 overflow-y-auto no-scrollbar">
              <section className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "uppercase text-[9px] font-black px-3 py-1 border-none",
                      selectedNotif.priority === "high"
                        ? "bg-rose-500 text-white shadow-glow-rose"
                        : "bg-primary-500/10 text-primary-500",
                    )}
                  >
                    {cats[selectedNotif.type] || selectedNotif.type}
                  </Badge>
                  <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-400 border-none text-[9px] font-black uppercase px-3 py-1">
                    {selectedNotif.priority || "regular"}
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-navy dark:text-white uppercase leading-tight tracking-tighter">
                  {selectedNotif.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedNotif.description}
                </p>
              </section>

              <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>{dict?.common?.timeline || "TIMELINE"}</span>
                  <span>{selectedNotif.time}</span>
                </div>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />
                <p className="text-[11px] font-medium text-slate-500 uppercase leading-relaxed text-center italic">
                  {n.sop_desc ||
                    "LAPORAN INI MEMERLUKAN TINDAK LANJUT SEGERA SESUAI DENGAN STANDAR PROSEDUR OPERASIONAL (SOP) UKP2SA."}
                </p>
              </section>
            </div>

            <SheetFooter className="p-8 pt-4 gap-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 sm:flex-row flex-col">
              <Button
                variant="outline"
                className="rounded-2xl h-14 flex-1 font-black uppercase text-[10px] tracking-widest border-slate-200 dark:border-slate-800"
                onClick={() => onOpenChange(false)}
              >
                {dict?.common?.close_panel || "Tutup Panel"}
              </Button>
              {selectedNotif.link && (
                <Button
                  className="rounded-2xl h-14 flex-1 font-black uppercase text-[10px] tracking-widest shadow-glow-primary border-none"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/${lang}${selectedNotif.link}`);
                  }}
                >
                  {selectedNotif.actionLabel ||
                    n.run_action ||
                    "Jalankan Aksi"}{" "}
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              )}
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
