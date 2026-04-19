"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface OutcomeHeaderProps {
  t: any;
}

export const OutcomeHeader = ({ t }: OutcomeHeaderProps) => {
  return (
    <div className="font-display">
      <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
        {t.outcome_title || "Tracking Outcome"}
      </h1>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <CheckCircle2 size={14} className="text-primary" />{" "}
        {t.outcome_desc || "Pemantauan Penerima Manfaat & Aset Nasional"}
      </p>
    </div>
  );
};
