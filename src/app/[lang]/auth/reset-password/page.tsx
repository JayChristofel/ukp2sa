"use client";

import React, { useState, Suspense } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Input, Label } from "@/components/ui";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Save, AlertTriangle, Loader2, Sparkles, RefreshCw, LogIn } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";

import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordForm() {
  const dict = useI18n();
  const d = dict?.auth || {};
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params.lang as string) || "id";

  const token = searchParams.get("token");

  if (!token) {
    return (
      <AuthLayout
        title={d.invalid_link_title || "Invalid Link"}
        subtitle={d.invalid_link_desc || "Reset token missing or compromised."}
      >
        <div className="flex flex-col items-center text-center gap-8 py-6">
          <div className="size-24 rounded-[2.5rem] bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/20 border border-rose-500/20 animate-in fade-in zoom-in duration-500">
            <AlertTriangle size={48} className="animate-pulse" />
          </div>
          <div className="space-y-3 px-4">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
              {d.token_expired || "This reset link has expired or is mathematically invalid."}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 opacity-60">Security Protocol Violation</p>
          </div>
          
          <div className="flex flex-col w-full gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                className="w-full h-16 rounded-[1.5rem] bg-navy dark:bg-white text-white dark:text-navy text-[10px] tracking-[0.2em] uppercase font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-navy/20 dark:shadow-white/5"
                onClick={() => router.push(`/${lang}/auth/forgot-password`)}
              >
                <RefreshCw size={18} />
                {d.request_new_link || "REQUEST NEW LINK"}
              </Button>
            </motion.div>
            <Link
              href={`/${lang}/auth/login`}
              className="group flex items-center justify-center gap-2 font-black text-[10px] tracking-[0.2em] uppercase text-slate-400 hover:text-primary-500 transition-colors"
            >
              <LogIn size={16} className="group-hover:-translate-x-1 transition-transform" />
              {d.back_to_login || "Back to Login"}
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm-password") as string;

    if (password !== confirm) {
      toast.error(d.passwords_mismatch || "Passwords do not match!");
      return;
    }

    setLoading(true);
    const resetPromise = fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, lang }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    });

    toast.promise(resetPromise, {
      loading: d.encrypting || "ENCRYPTING...",
      success: () => {
        router.push(`/${lang}/auth/login`);
        return d.success_reset || "Password updated!";
      },
      error: (err: any) => {
        setLoading(false);
        return err.message || (lang === "en" ? "Update failed." : "Gagal ganti password.");
      },
    });

    try {
      await resetPromise;
    } catch {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={d.reset_title || "Secure Reset"}
      subtitle={d.reset_desc || "Enter your new authentication credentials."}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {d.new_secure_password || "New Secure Password"}
            </Label>
            <div className="relative group">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoFocus
                className="h-14 pr-12 rounded-2xl md:rounded-[1.5rem] bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 focus:ring-primary-500/20 transition-all font-mono"
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {d.confirm_password || "Confirm Password"}
            </Label>
            <div className="relative group">
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                className="h-14 pr-12 rounded-2xl md:rounded-[1.5rem] bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 focus:ring-primary-500/20 transition-all font-mono"
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          whileHover={!loading ? { scale: 1.02, y: -2 } : {}} 
          whileTap={!loading ? { scale: 0.98 } : {}}
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
                  <span className="animate-pulse">{d.encrypting || "ENCRYPTING..."}</span>
                </>
              ) : (
                <>
                  <span className="z-10">{d.finalize_recovery || "FINALIZE RECOVERY"}</span>
                  <Save size={18} className="group-hover:translate-y-1 transition-transform duration-300" />
                  <Sparkles size={16} className="absolute -top-4 -right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
             <div className="animate-spin rounded-[1rem] h-12 w-12 border-4 border-primary-500 border-t-transparent" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initializing Security Session...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
