"use client";

import React from "react";
import { MailWarning, Cloud } from "lucide-react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InfrastructureTabProps {
  s: any;
}

export const InfrastructureTab = ({ s }: InfrastructureTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-10 border-none rounded-[2.5rem] shadow-xl space-y-8 bg-white dark:bg-navy/50">
          <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
            <MailWarning size={20} className="text-primary" />{" "}
            {s.smtp_server || "SMTP Server (Mail)"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                SMTP Host
              </Label>
              <Input
                defaultValue="smtp.ukp2sa.go.id"
                className="h-12 bg-slate-50 dark:bg-slate-900 border-none px-6 font-black rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  SMTP Port
                </Label>
                <Input
                  type="number"
                  defaultValue={587}
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-none px-6 font-black rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  {s.encryption || "Encryption"}
                </Label>
                <Select defaultValue="tls">
                  <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold shadow-sm">
                    <SelectValue placeholder={s.encryption || "Encryption"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="tls" className="font-bold">TLS</SelectItem>
                    <SelectItem value="ssl" className="font-bold">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6 bg-white dark:bg-navy/50">
          <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Cloud size={20} className="text-emerald-500" />{" "}
            {s.storage || "Storage"}
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                Provider
              </Label>
              <Select defaultValue="local">
                <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold shadow-sm">
                  <SelectValue placeholder={s.select_storage || "Pilih Storage"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="local" className="font-bold text-xs uppercase tracking-widest">Local Storage</SelectItem>
                  <SelectItem value="s3" className="font-bold text-xs uppercase tracking-widest">AWS S3 Bucket</SelectItem>
                  <SelectItem value="gcs" className="font-bold text-xs uppercase tracking-widest">Google Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex items-center justify-between shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 pl-1">
                {s.free_space || "Free Space"}: 78%
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-[9px] font-black uppercase px-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
              >
                Purge
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
