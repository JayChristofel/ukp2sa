"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield, CheckCircle2 } from "lucide-react";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";
import { adminRoleSchema } from "@/lib/validations";

export default function RoleAddPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const queryClient = useQueryClient();
  const { logActivity } = useAuditLogger();

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const { data: permissionGroupsData, isLoading: permissionsLoading } =
    useQuery({
      queryKey: ["admin-permissions-grouped"],
      queryFn: () => apiService.getPermissionsGrouped(),
    });

  const permissionGroups = permissionGroupsData?.data || [];

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiService.saveRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role berhasil dibuat!");
      logActivity("ROLE_CREATED", "SYSTEM", `Role created: ${form.name}`);
      router.push(`/${lang}/admin/roles`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal membuat role");
    },
  });

  const togglePermission = (pId: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(pId)
        ? prev.permissions.filter((id) => id !== pId)
        : [...prev.permissions, pId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = adminRoleSchema.safeParse({
      name: form.name,
      description: form.description,
      permissions: form.permissions,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    const roleId = form.id || form.name.toLowerCase().replace(/\s+/g, "-");
    saveMutation.mutate({ ...form, id: roleId });
  };

  return (
    <div className="space-y-10 font-display pb-20">
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.back()}
          className="size-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:scale-105 transition-all shadow-xl"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-5xl font-black dark:text-white uppercase tracking-tighter">
            Tambah Role Baru
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            Konfigurasi Hierarki Akses Sistem UKP2SA
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-10"
      >
        {/* Basic Info */}
        <div className="xl:col-span-1 space-y-10">
          <div className="bento-card p-10 bg-navy text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">
              Informasi Dasar
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Nama Role
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Verifikator"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mt-2 text-sm font-bold focus:bg-white/10 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Deskripsi (Tugas)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Tugas utama role ini..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mt-2 text-sm font-bold focus:bg-white/10 focus:border-primary transition-all min-h-[120px]"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {saveMutation.isPending ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saveMutation.isPending ? "Menyimpan..." : "Simpan Role"}
          </button>
        </div>

        {/* Permissions Groups */}
        <div className="xl:col-span-2 space-y-10">
          {permissionsLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="size-10 animate-spin mx-auto text-primary mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Loading Permissions...
              </p>
            </div>
          ) : (
            permissionGroups.map((group: any, gIdx: number) => (
              <div
                key={gIdx}
                className="bento-card p-10 bg-white dark:bg-slate-900 border-none rounded-[2.5rem] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                      <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      {group.name}
                    </h3>
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    {
                      group.permissions.filter((p: any) =>
                        form.permissions.includes(p.id),
                      ).length
                    }{" "}
                    / {group.permissions.length} Aktif
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.permissions.map((p: any) => {
                    const isSelected = form.permissions.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.id)}
                        className={`p-6 rounded-3xl border text-left flex items-center justify-between transition-all group ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                            : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {p.id.split(":")[0]}
                          </p>
                          <p className="text-xs font-black uppercase tracking-tight">
                            {p.name || p.label}
                          </p>
                        </div>
                        <div
                          className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </form>
    </div>
  );
}

const Loader2 = ({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
