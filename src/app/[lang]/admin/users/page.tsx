"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Shield,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { UserStatus } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useI18n } from "@/app/[lang]/providers";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

const StatusBadge = ({ status, dict }: { status: UserStatus; dict: any }) => {
  const configs = {
    [UserStatus.ACTIVE]: {
      color: "emerald",
      label: dict?.admin?.status_active || "Aktif",
    },
    [UserStatus.INACTIVE]: {
      color: "slate",
      label: dict?.admin?.status_inactive || "Non-Aktif",
    },
    [UserStatus.SUSPENDED]: {
      color: "rose",
      label: dict?.admin?.status_suspended || "Ditangguhkan",
    },
  };
  const config = configs[status];
  if (!config) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-${config.color}-500/10 text-${config.color}-500 border border-${config.color}-500/20 text-[10px] font-black uppercase tracking-widest`}
    >
      <div
        className={`size-1.5 rounded-full bg-${config.color}-500 animate-pulse`}
      />
      {config.label}
    </div>
  );
};

export default function UsersPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = useI18n();
  const queryClient = useQueryClient();
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "USERS_MANAGEMENT_VIEW",
      "SYSTEM",
      "User accessed the administrator and field operator management system.",
    );
  }, [logActivity]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from real API
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users", currentPage, searchTerm, filterRole],
    queryFn: () =>
      apiService.getUsers(currentPage, itemsPerPage, searchTerm, filterRole),
    placeholderData: (prev) => prev,
  });

  // Fetch roles from real API
  const { data: rolesData } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => apiService.getRoles(),
    staleTime: 1000 * 60 * 10, // Cache roles for 10min
  });

  const users = usersData?.data || [];
  const roles = rolesData?.data || [];
  const totalPages = usersData?.totalPages || 1;
  const totalItems = usersData?.totalItems || 0;

  // Delete mutation with real API
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(dict?.common?.delete_success || "Data berhasil dihapus");
    },
    onError: () => {
      toast.error(dict?.common?.delete_failed || "Gagal menghapus data");
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(dict?.common?.confirm_delete || "Hapus data ini?")) {
      deleteMutation.mutate(id);
      logActivity("USER_REMOVED", "SYSTEM", `User deleted account: ${id}`);
      addNotification({
        title: "User Dihapus",
        description: `Akun User ID: ${id} telah dihapus permanen dari sistem.`,
        type: "system",
        priority: "high",
      });
    }
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r: any) => r.id === roleId)?.name || roleId;
  };

  return (
    <div className="space-y-8 font-display">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white tracking-tight mb-2 uppercase">
            {dict?.admin?.menu?.users ||
              dict?.admin?.users_title ||
              "Manajemen User"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-bold">
            {dict?.admin?.users_subtitle ||
              "Kelola akses administrator dan operator lapangan."}
          </p>
        </div>
        <Link
          href={`/${lang}/admin/users/add`}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 w-full lg:w-auto"
        >
          <UserPlus size={18} />
          {dict?.admin?.add_user || "Tambah User"}
        </Link>
      </div>

      <div className="bento-card !p-0 overflow-hidden border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="p-4 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row gap-6 justify-between">
          <div className="relative flex-1 max-w-full xl:max-w-lg">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder={
                dict?.common?.search_user_placeholder ||
                "Cari nama atau email..."
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 transition-all font-bold dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-1 sm:flex-initial">
              <Shield size={16} className="text-slate-400" />
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer w-full"
              >
                <option value="">
                  {dict?.admin?.all_roles || "Semua Role"}
                </option>
                {roles.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {usersLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {dict?.common?.loading || "Memuat..."}
            </p>
          </div>
        ) : usersError ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="size-24 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-6">
              <Shield size={32} className="text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {dict?.admin?.load_failed || "Gagal Memuat Data"}
            </h3>
            <p className="text-sm text-slate-500">
              {(usersError as Error).message}
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {dict?.admin?.no_users || "Tidak Ada User"}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchTerm
                ? dict?.admin?.search_no_results ||
                  "Tidak ditemukan hasil untuk pencarian Anda"
                : dict?.admin?.empty_users || "Belum ada user dalam database"}
            </p>
            <button
              onClick={() =>
                searchTerm
                  ? (setSearchTerm(""), setFilterRole(""), setCurrentPage(1))
                  : router.push(`/${lang}/admin/users/add`)
              }
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold"
            >
              {searchTerm
                ? dict?.common?.reset || "Reset Filter"
                : dict?.admin?.add_user || "Tambah User"}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 md:px-8 py-5">
                      {dict?.admin?.profile_label || "Profil"}
                    </th>
                    <th className="px-4 md:px-8 py-5">
                      {dict?.admin?.role_label || "Role & Akses"}
                    </th>
                    <th className="px-4 md:px-8 py-5">
                      {dict?.admin?.status_label || "Status"}
                    </th>
                    <th className="px-4 md:px-8 py-5">
                      {dict?.admin?.registered_label || "Terdaftar"}
                    </th>
                    <th className="px-4 md:px-8 py-5 text-right">
                      {dict?.common?.action || "Aksi"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {users.map((u: any) => (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50 dark:hover:bg-primary-900/5 transition-colors"
                    >
                      <td className="px-4 md:px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-10 md:size-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-base md:text-lg border border-primary-500/20">
                            {u.avatar ? (
                              <Image
                                src={u.avatar}
                                alt={u.name}
                                width={48}
                                height={48}
                                className="size-full object-cover rounded-2xl"
                              />
                            ) : (
                              u.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">
                              {u.name}
                            </p>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Mail size={10} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
                          <Shield size={12} />
                          {getRoleName(u.role)}
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-6">
                        <StatusBadge status={u.status} dict={dict} />
                      </td>
                      <td className="px-4 md:px-8 py-6">
                        <p className="text-[10px] md:text-xs font-bold text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString(
                            lang === "en" ? "en-US" : "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </td>
                      <td className="px-4 md:px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/${lang}/admin/users/edit?id=${u.id}`,
                              )
                            }
                            className="p-2 md:p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(u.id, e)}
                            disabled={deleteMutation.isPending}
                            className="p-2 md:p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-b-[2.5rem]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {lang === "en" ? "Showing" : "Menampilkan"}{" "}
                  {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                  {lang === "en" ? "of" : "dari"} {totalItems} users
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-50"
                  >
                    {dict?.common?.previous || "Sebelumnya"}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-primary-600 text-white disabled:opacity-50"
                  >
                    {dict?.common?.next || "Selanjutnya"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
