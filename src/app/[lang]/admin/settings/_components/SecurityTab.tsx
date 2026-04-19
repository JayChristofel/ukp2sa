"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Card, Label, Switch } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";

interface SecurityTabProps {
  s: any;
}

export const SecurityTab = ({ s }: SecurityTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <Card className="p-10 border-none rounded-[2.5rem] shadow-xl bg-white dark:bg-navy/50">
        <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
          <Shield size={20} className="text-rose-500" />{" "}
          {s.access_governance || "Access Governance"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-black text-sm text-navy dark:text-white uppercase tracking-tight">
                  {s.maintenance_mode || "Maintenance Mode"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">
                  {s.maintenance_desc || "Hanya pengembang & pimpinan yang bisa login."}
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-black text-sm text-navy dark:text-white uppercase tracking-tight">
                  {s.public_auth || "Public Auth"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">
                  {s.public_auth_desc || "Izinkan pembuatan akun masyarakat umum."}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block pl-1">
              {s.ip_whitelist || "IP Whitelist (Admin only)"}
            </Label>
            <Textarea
              placeholder="Masukkan IP dipisahkan koma..."
              rows={3}
              className="bg-white dark:bg-slate-900 border-none font-mono text-xs opacity-50 px-5 py-4 rounded-2xl resize-none"
              disabled
            />
            <p className="mt-4 text-[9px] font-black text-primary/60 italic uppercase tracking-tighter">
              {s.ip_restricted_desc || "Fitur Restricted IP hanya tersedia dengan lisensi Enterprise."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
