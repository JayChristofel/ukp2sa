"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { UserStatus } from "@/lib/types";
import { Button, Card, Input } from "@/components/ui";

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
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "public",
    status: UserStatus.ACTIVE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for save logic goes here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.back()}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white uppercase tracking-tighter">
            Edit Profile <span className="text-primary italic">User.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Manajemen Hak Akses & Status Keanggotaan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <Card className="p-10 border-none rounded-[3rem] shadow-3xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                Nama Lengkap
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-16 px-6 rounded-2xl border-none bg-slate-50 dark:bg-slate-900/50 font-bold"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                Alamat Email
              </label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-16 px-6 rounded-2xl border-none bg-slate-50 dark:bg-slate-900/50 font-bold"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-10 h-16 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-3 shadow-glow-primary hover:brightness-110 active:scale-95 transition-all"
          >
            <Save size={20} /> Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
