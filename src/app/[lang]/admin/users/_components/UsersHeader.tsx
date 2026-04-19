"use client";

import React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface UsersHeaderProps {
  dict: any;
  lang: string;
}

export const UsersHeader = ({ dict, lang }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-display">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white tracking-tight mb-2 uppercase">
          {dict?.admin?.menu?.users || dict?.admin?.users_title || "Manajemen User"}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest pl-1">
          {dict?.admin?.users_subtitle || "Kelola akses administrator dan operator lapangan."}
        </p>
      </div>
      <Link
        href={`/${lang}/admin/users/add`}
        className="flex items-center justify-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-glow-primary hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 w-full lg:w-auto border-none"
      >
        <UserPlus size={18} />
        {dict?.admin?.add_user || "Tambah User"}
      </Link>
    </div>
  );
};
