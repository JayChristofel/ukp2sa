"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Input, Label } from "@/components/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Loader2, Sparkles } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { registerUser } from "@/app/actions/auth";
import { registerSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function RegisterPage() {
  const dict = useI18n();
  const d = dict?.auth || {};
  const params = useParams();
  const lang = (params.lang as string) || "id";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = registerSchema.safeParse({ 
      name, 
      email, 
      password, 
      confirmPassword 
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    const registerPromise = registerUser(formData, lang);

    toast.promise(registerPromise, {
      loading: lang === "en" ? "Processing entry..." : "Memproses pendaftaran...",
      success: (data: any) => {
        if (data.error) throw new Error(data.error);
        router.push(`/${lang}/auth/login`);
        return lang === "en" ? "Account created! Please sign in." : "Akun berhasil dibuat! Silakan login.";
      },
      error: (err: any) => {
        setLoading(false);
        return err.message || (lang === "en" ? "Verification failed." : "Gagal bikin akun.");
      },
    });

    try {
      await registerPromise;
    } catch {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={d.register_title || "Join Protocol"}
      subtitle={d.register_subtitle || "Aceh Recovery Ecosystem Access"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            autoFocus
            disabled={loading}
            className="h-12 rounded-2xl md:rounded-3xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@aceh.go.id"
            required
            disabled={loading}
            className="h-12 rounded-2xl md:rounded-3xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              className="h-12 rounded-2xl md:rounded-3xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Konfirmasi</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              className="h-12 rounded-2xl md:rounded-3xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-1">
          <input
            type="checkbox"
            id="terms"
            className="size-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
            required
            disabled={loading}
          />
          <Label
            htmlFor="terms"
            className="mb-0 text-[11px] md:text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer leading-tight"
          >
            I agree with the{" "}
            <Link
              href={`/${lang}/terms`}
              className="text-primary-500 font-black hover:underline"
            >
              Registry Policy & Security Protocols
            </Link>
          </Label>
        </div>

        <motion.div 
          whileHover={!loading ? { scale: 1.02 } : {}} 
          whileTap={!loading ? { scale: 0.95, rotate: -0.5 } : {}}
        >
          <Button
            type="submit"
            className="w-full h-16 rounded-[1.5rem] bg-navy dark:bg-white text-white dark:text-navy hover:shadow-2xl hover:shadow-primary/20 transition-all text-xs tracking-[0.2em] uppercase font-black flex items-center justify-center gap-3 overflow-hidden relative group"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            
            <div className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <span className="animate-pulse">{lang === "en" ? "VERIFYING..." : "MENDAFTAR..."}</span>
                </>
              ) : (
                <>
                  <span className="z-10">{d.register_here || "Initiate Access"}</span>
                  <UserPlus size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  <Sparkles size={16} className="absolute -top-4 -right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </Button>
        </motion.div>

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href={`/${lang}/auth/login`}
            className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            {d.login_button || "Masuk"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

