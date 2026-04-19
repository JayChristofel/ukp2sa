"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";
import { UserStatus, UserRole } from "@/lib/types";
import { useI18n } from "@/app/[lang]/providers";

export default function UserEditPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          Mempersiapkan Data User...
        </div>
      }
    >
      <UserEditContent />
    </React.Suspense>
  );
}

function UserEditContent() {
  const dict = useI18n();
  const u_dict = dict?.users || {};
  const common = dict?.common || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const id = searchParams.get("id") as string;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "public" as UserRole,
    status: UserStatus.ACTIVE,
  });

  // Fetch roles
  const { data: rolesData } = useQuery({
    queryKey: ["admin-roles-dropdown"],
    queryFn: () => apiService.getRoles(),
    staleTime: 60000,
  });
  const roles = rolesData?.data || [];

  // Fetch user data
  const { data: user, isLoading: loading, error: fetchError } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const res = await apiService.getUsers(1, 1, id); // Use id as search term for precise fetch
      const found = res.data?.find((u: any) => u.id === id);
      if (found) {
        setForm({
          name: found.name || "",
          email: found.email || "",
          role: (found.role as UserRole) || "public",
          status: found.status || UserStatus.ACTIVE,
        });
      }
      return found;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiService.saveUser({ ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(common.save_success || "Data user berhasil diperbarui!");
      router.push(`/${lang}/admin/users`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal memperbarui data user.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <Loader2 size={24} className="animate-spin text-primary-500" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
          Memuat data user...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
          User tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-display">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white uppercase tracking-tight">
            {u_dict.edit_title || "Edit User"}
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
            {form.email}
          </p>
        </div>
      </div>

      {/* Alert Banners */}
      {fetchError && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{(fetchError as Error).message}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bento-card p-6 md:p-10 space-y-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-none shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {common.full_name || "Nama Lengkap"}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder={u_dict.name_placeholder || "Masukkan nama..."}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {u_dict.email_label || "Alamat Email"}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {u_dict.role_access || "Role Akses"}
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserRole })
              }
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              {roles.map((role: any) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {u_dict.initial_status || "Status Akun"}
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as UserStatus })
              }
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              <option value={UserStatus.ACTIVE}>{dict.admin?.status_active || "Aktif"}</option>
              <option value={UserStatus.INACTIVE}>{dict.admin?.status_inactive || "Non-Aktif"}</option>
              <option value={UserStatus.SUSPENDED}>{dict.admin?.status_suspended || "Suspended"}</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {updateMutation.isPending ? common.saving || "Menyimpan..." : u_dict.update_btn || "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
}
