"use client";

import React from "react";
import Image from "next/image";
import { 
  Edit2, 
  Trash2, 
  Mail, 
  Shield, 
  Loader2, 
  Search, 
  UserPlus 
} from "lucide-react";
import { motion } from "framer-motion";
import { UserStatusBadge } from "./UserStatusBadge";

interface UsersTableProps {
  users: any[];
  roles: any[];
  isLoading: boolean;
  error: any;
  dict: any;
  lang: string;
  searchTerm: string;
  onEdit: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onReset: () => void;
  isDeleting: boolean;
}

export const UsersTable = ({
  users,
  roles,
  isLoading,
  error,
  dict,
  lang,
  searchTerm,
  onEdit,
  onDelete,
  onReset,
  isDeleting,
}: UsersTableProps) => {
  const getRoleName = (roleId: string) => {
    return roles.find((r: any) => r.id === roleId)?.name || roleId;
  };

  if (isLoading) {
    return (
      <div className="p-24 flex flex-col items-center justify-center text-center font-display">
        <Loader2 className="size-12 border-primary animate-spin text-primary mb-6" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">
          {dict?.common?.loading || "Memuat Jaringan..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center font-display">
        <div className="size-24 rounded-[2rem] bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-6 shadow-xl">
          <Shield size={32} className="text-rose-500" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
          {dict?.admin?.load_failed || "Sistem Gagal Memuat"}
        </h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 opacity-60">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center font-display">
        <div className="size-24 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 shadow-inner border border-slate-200/50 dark:border-slate-700/50">
          <Search size={32} className="text-slate-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
          {dict?.admin?.no_users || "Basis Data Kosong"}
        </h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 max-w-sm mx-auto leading-relaxed">
          {searchTerm
            ? dict?.admin?.search_no_results || "Tidak ditemukan hasil untuk parameter pencarian Anda"
            : dict?.admin?.empty_users || "Belum ada entitas user yang terdaftar dalam pusat kendali."}
        </p>
        <button
          onClick={onReset}
          className="px-10 py-4 bg-primary text-white圆rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow-primary transition-all active:scale-95 flex items-center gap-3"
        >
          {searchTerm ? <Search size={14} /> : <UserPlus size={14} />}
          {searchTerm ? dict?.common?.reset || "Reset Filter" : dict?.admin?.add_user || "Inisialisasi User"}
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide font-display">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-200 dark:border-slate-800">
            <th className="px-8 py-6">{dict?.admin?.profile_label || "Profil Personal"}</th>
            <th className="px-8 py-6">{dict?.admin?.role_label || "Otoritas & Role"}</th>
            <th className="px-8 py-6">{dict?.admin?.status_label || "Status Aktuasi"}</th>
            <th className="px-8 py-6">{dict?.admin?.registered_label || "Kronologi Daftar"}</th>
            <th className="px-8 py-6 text-right">{dict?.common?.action || "Navigasi"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
          {users.map((u: any) => (
            <motion.tr
              key={u.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group hover:bg-primary-500/[0.02] dark:hover:bg-primary-400/[0.02] transition-colors"
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                    {u.avatar ? (
                      <Image
                        src={u.avatar}
                        alt={u.name}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    ) : (
                      u.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-black text-navy dark:text-white uppercase text-sm tracking-tight">
                      {u.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                      <Mail size={12} className="text-primary/50" /> {u.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-navy dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy/20 dark:shadow-black/50 border border-transparent hover:border-primary/30 transition-all">
                  <Shield size={14} className="text-primary" />
                  {getRoleName(u.role)}
                </div>
              </td>
              <td className="px-8 py-6">
                <UserStatusBadge status={u.status} dict={dict} />
              </td>
              <td className="px-8 py-6">
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-tight">
                  {new Date(u.createdAt).toLocaleDateString(
                    lang === "en" ? "en-US" : "id-ID",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </p>
                <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5">
                  Verified Registration
                </p>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(u.id)}
                    className="p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={(e) => onDelete(u.id, e)}
                    disabled={isDeleting}
                    className="p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 text-slate-400 hover:text-rose-500 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
