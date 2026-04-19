"use client";

import React, { useState, Suspense } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Input, Label } from "@/components/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff, LogIn, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useAuthStore } from "@/stores/authStore";
import { loginSchema } from "@/lib/validations";

function LoginForm() {
  const dict = useI18n();
  const d = dict?.auth || {};
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const params = useParams();
  const lang = (params.lang as string) || "id";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const { login } = useAuthStore.getState();
      const result = await login(email, password, lang);

      if (!result.success) {
        setFormError(result.error || "Login gagal.");
        setLoading(false);
        return;
      }

      setFormSuccess(lang === "en" ? "Success! Redirecting..." : "Berhasil masuk! Mengarahkan...");
      window.location.href = result.redirectUrl || `/${lang}`;
    } catch {
      setFormError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={d.welcome || "Welcome Back"}
      subtitle={d.subtitle || "Sign in to your Dashboard"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Alert Banners (Premium Glassmorphism) */}
        <AnimatePresence mode="wait">
          {formError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="flex items-start gap-4 p-5 rounded-[2rem] bg-rose-50/80 dark:bg-rose-950/30 backdrop-blur-xl border border-rose-200/50 dark:border-rose-500/20 shadow-lg shadow-rose-500/10"
            >
              <div className="p-2 bg-rose-500 rounded-xl text-white shrink-0">
                 <AlertCircle size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 opacity-60">
                  {d.error_detected || "ERROR DETECTED"}
                </span>
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400 leading-tight">{formError}</p>
              </div>
            </motion.div>
          )}

          {formSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="flex items-start gap-4 p-5 rounded-[2rem] bg-emerald-50/80 dark:bg-emerald-950/30 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10"
            >
              <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
                 <CheckCircle2 size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-60">
                  {dict?.common?.success || "SUCCESS!"}
                </span>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 leading-tight">{formSuccess}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@aceh.go.id"
            required
            autoFocus
            disabled={loading}
            className="h-14 rounded-2xl md:rounded-3xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 transition-all focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Password
            </Label>
            <Link
              href={`/${lang}/auth/forgot-password`}
              className="text-[10px] font-black text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest underline decoration-primary/30 underline-offset-4"
            >
              {d.forgot_password || "FORGOT PASSWORD?"}
            </Link>
          </div>
          <div className="relative group">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-14 pr-12 rounded-2xl md:rounded-3xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 transition-all focus:ring-primary/20"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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
                  <span className="animate-pulse">{d.identifying || "IDENTIFYING..."}</span>
                </>
              ) : (
                <>
                  <span className="z-10">{d.login_button || "SECURE ENTRY"}</span>
                  <LogIn size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  <Sparkles size={16} className="absolute -top-4 -right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </Button>
        </motion.div>

        <p className="text-center text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
          {d.no_account || "Don't have an account?"}{" "}
          <Link
            href={`/${lang}/auth/register`}
            className="text-primary-500 hover:text-primary-600 transition-colors underline decoration-primary/30 underline-offset-4"
          >
            {d.register_here || "Register Here"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
