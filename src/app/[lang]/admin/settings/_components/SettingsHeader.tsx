"use client";

import React from "react";
import { Cpu, Save } from "lucide-react";
import { Button } from "@/components/ui";

interface SettingsHeaderProps {
  s: any;
  isSaving: boolean;
  onSave: () => void;
}

export const SettingsHeader = ({
  s,
  isSaving,
  onSave,
}: SettingsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase font-display">
          {s.title_main || "Global App Settings"}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 font-display">
          <Cpu size={14} className="text-primary" />{" "}
          {s.subtitle || "Core System Engine & Configuration"}
        </p>
      </div>
      <Button
        onClick={onSave}
        loading={isSaving}
        className="px-8 py-4 shadow-glow-primary hover:translate-y-[-2px] transition-all font-display rounded-2xl border-none"
      >
        {!isSaving && <Save size={16} />} {s.save_all || "Save All Changes"}
      </Button>
    </div>
  );
};
