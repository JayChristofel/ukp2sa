"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield } from "lucide-react";

export default function RoleEditPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          Mempersiapkan Data Role...
        </div>
      }
    >
      <RoleEditContent />
    </React.Suspense>
  );
}

function RoleEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const DEFAULT_PERMISSIONS: any[] = [];
  const id = searchParams.get("id") as string;

  const roles: any = []; // auto-cleaned

  const role = roles.find((r: any) => r.id === id) || {
    name: "Mock Role",
    description: "",
    permissions: [],
  };

  const [form, setForm] = useState({
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  });

  const updateMutation: any = {
    mutate: () => {},
    mutateAsync: async () => {},
    isPending: false,
    isLoading: false,
    data: [],
  }; // auto-cleaned

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
    updateMutation.mutate(form);
  };

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
          Role tidak ditemukan
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
            Edit Role
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {role.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bento-card p-6 md:p-10 space-y-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-none shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Nama Role
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all font-display"
              placeholder="Contoh: Manajer Satelit"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all min-h-[100px] font-display"
              placeholder="Jelaskan tanggung jawab role ini..."
              required
            />
          </div>
        </div>

        <div className="bento-card p-6 md:p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-none shadow-2xl">
          <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <Shield size={18} className="text-primary" />
            Pengaturan Perizinan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DEFAULT_PERMISSIONS.map((p) => {
              const isSelected = form.permissions.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePermission(p.id)}
                  className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between group ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                      : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        isSelected ? "text-primary" : "text-slate-400"
                      }`}
                    >
                      {p.module}
                    </p>
                    <p className="text-xs font-black uppercase tracking-tight">
                      {p.name}
                    </p>
                  </div>
                  <div
                    className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="size-2 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full md:w-auto px-10 py-4 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {updateMutation.isPending ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {updateMutation.isPending ? "Menyimpan..." : "Update Role"}
          </button>
        </div>
      </form>
    </div>
  );
}
