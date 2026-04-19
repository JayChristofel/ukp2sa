"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { UserStatus, UserRole } from "@/lib/types";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";
import { adminUserSchema } from "@/lib/validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";

export default function UserAddPage() {
  const dict = useI18n();
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          {dict?.common?.preparing_form || "Mempersiapkan Form..."}
        </div>
      }
    >
      <UserAddContent />
    </React.Suspense>
  );
}

function UserAddContent() {
  const dict = useI18n();
  const u_dict = dict?.users || {};
  const common = dict?.common || {};
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "USER_ADD_VIEW",
      "SYSTEM",
      "User accessed the new user enrollment portal.",
    );
  }, [logActivity]);

  const queryClient = useQueryClient();

  // --- DATA FETCHING ---
  const { data: rolesData } = useQuery({
    queryKey: ["admin-roles-dropdown"],
    queryFn: () => apiService.getRoles(),
    staleTime: 60000,
  });
  const roles = rolesData?.data || [];

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "public" as UserRole,
    status: UserStatus.ACTIVE,
    avatar: "",
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => apiService.saveUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(dict.common?.save_success || "User berhasil didaftarkan!");
      logActivity(
        "USER_CREATED",
        "SYSTEM",
        `User enrolled new account: ${form.name} (${form.email})`,
      );
      addNotification({
        title: dict.users?.notif_created_title || "User Baru Terdaftar",
        description: `${dict.users?.notif_created_desc || 'Akun'} "${form.name}" ${dict.users?.notif_created_desc_suffix || 'telah berhasil didaftarkan.'}`,
        type: "system",
        priority: "medium",
        createdAt: new Date().toISOString()
      });
      router.push(`/${lang}/admin/users`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal mendaftarkan user.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = adminUserSchema.safeParse({
      name: form.name,
      email: form.email,
      role: form.role,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    addMutation.mutate(form);
  };

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
            {u_dict.add_title || "Tambah User Baru"}
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {u_dict.add_subtitle ||
              "Daftarkan administrator atau operator baru"}
          </p>
        </div>
      </div>

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
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {u_dict.initial_status || "Status Awal"}
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as UserStatus })
              }
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              <option value={UserStatus.ACTIVE}>
                {dict?.admin?.status_active || "Aktif"}
              </option>
              <option value={UserStatus.INACTIVE}>
                {dict?.admin?.status_inactive || "Non-Aktif"}
              </option>
              <option value={UserStatus.SUSPENDED}>
                {dict?.admin?.status_suspended || "Suspended"}
              </option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {addMutation.isPending ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            {addMutation.isPending
              ? common.registering || "Mendaftarkan..."
              : u_dict.register_btn || "Daftarkan User"}
          </button>
        </div>
      </form>
    </div>
  );
}
