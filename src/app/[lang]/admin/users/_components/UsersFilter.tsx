"use client";

import React from "react";
import { Search, Shield } from "lucide-react";

interface UsersFilterProps {
  dict: any;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterRole: string;
  onFilterRoleChange: (val: string) => void;
  roles: any[];
}

export const UsersFilter = ({
  dict,
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  roles,
}: UsersFilterProps) => {
  return (
    <div className="p-5 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row gap-6 justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-t-[2.5rem] font-display">
      <div className="relative flex-1 w-full xl:max-w-xl group">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder={dict?.common?.search_user_placeholder || "Cari nama atau email..."}
          className="w-full pl-14 pr-6 py-4.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-[13px] focus:ring-4 focus:ring-primary/10 transition-all font-bold dark:text-white shadow-inner"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-1 sm:flex-initial shadow-inner border border-transparent focus-within:border-primary/20 transition-all">
          <Shield size={16} className="text-slate-400" />
          <select
            value={filterRole}
            onChange={(e) => onFilterRoleChange(e.target.value)}
            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer w-full dark:bg-slate-800"
          >
            <option value="">{dict?.admin?.all_roles || "Semua Role"}</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
