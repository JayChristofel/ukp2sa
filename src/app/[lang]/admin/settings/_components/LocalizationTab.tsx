"use client";

import React from "react";
import { Globe } from "lucide-react";
import { Card, Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocalizationTabProps {
  s: any;
}

export const LocalizationTab = ({ s }: LocalizationTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <Card className="p-10 border-none rounded-[2.5rem] shadow-xl bg-white dark:bg-navy/50">
        <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
          <Globe size={20} className="text-primary" />{" "}
          {s.regional_config || "Regional Configuration"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
              {s.default_timezone || "Default Timezone"}
            </Label>
            <Select defaultValue="jkt">
              <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold shadow-sm">
                <SelectValue placeholder={s.select_timezone || "Pilih Timezone"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="jkt" className="font-bold">Asia/Jakarta (GMT+7)</SelectItem>
                <SelectItem value="mks" className="font-bold">Asia/Makassar (GMT+8)</SelectItem>
                <SelectItem value="jyp" className="font-bold">Asia/Jayapura (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
              {s.default_language || "Default Language"}
            </Label>
            <Select defaultValue="id">
              <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold shadow-sm">
                <SelectValue placeholder={s.select_language || "Pilih Bahasa"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="id" className="font-bold">Bahasa Indonesia</SelectItem>
                <SelectItem value="en" className="font-bold">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
              {s.currency_format || "Currency Format"}
            </Label>
            <Select defaultValue="idr">
              <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold shadow-sm">
                <SelectValue placeholder={s.select_currency || "Pilih Mata Uang"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="idr" className="font-bold">IDR (Rp)</SelectItem>
                <SelectItem value="usd" className="font-bold">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};
