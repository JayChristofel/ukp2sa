"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Input, Label } from "@/components/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2, Sparkles, LogIn, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/app/[lang]/providers";
import { forgotPasswordAction } from "@/app/actions/auth";
import { forgotPasswordSchema } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const dict = useI18n();
  const d = dict?.auth || {};
  const params = useParams();
  const lang = (params.lang as string) || "id";
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // --- CLIENT-SIDE VALIDATION WITH ZOD ---
    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    const forgotPromise = forgotPasswordAction(formData, lang);

    toast.promise(forgotPromise, {
      loading: lang === "en" ? "Transmitting recovery link..." : "Mengirim link pemulihan...",
      success: (data: any) => {
        if (data.error) throw new Error(data.error);
        setSubmitted(true);
        setLoading(false);
        return data.success;
      },
      error: (err: any) => {
        setLoading(false);
        return err.message || (lang === "en" ? "Failed to send reset email." : "Gagal kirim email reset.");
      },
    });

    try {
      await forgotPromise;
    } catch {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title={lang === "en" ? "Link Deployed" : "Link Dikirim"}
        subtitle={lang === "en" ? "Check your secure inbox or spam folder." : "Cek inbox atau folder spam lo."}
      >
        <div className="flex flex-col items-center text-center gap-8 py-6">
          <div className="size-24 rounded-[2.5rem] bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
            <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
          </div>
          <div className="space-y-2 px-4">
             <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
               {d.forgot_desc || "Kami telah mengirimkan instruksi pemulihan kata sandi ke email Anda."}
             </p>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 opacity-60">Authentication Protocol Active</p>
          </div>
          <div className="flex flex-col w-full gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                variant="outline"
                className="w-full h-16 rounded-[1.5rem] text-[10px] tracking-[0.2em] uppercase font-black border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={() => setSubmitted(false)}
              >
                <RefreshCw size={18} />
                {lang === "en" ? "RESEND TRANSMISSION" : "KIRIM ULANG EMAIL"}
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

  return (
    <AuthLayout
      title={d.forgot_title || "Recovery Mode"}
      subtitle={d.forgot_desc || "Lost access? We'll help you secure it."}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Terdaftar</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@aceh.go.id"
            required
            autoFocus
            disabled={loading}
            className="h-14 rounded-2xl md:rounded-[1.5rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 focus:ring-primary-500/20"
          />
        </div>

        <motion.div 
          whileHover={!loading ? { scale: 1.02 } : {}} 
          whileTap={!loading ? { scale: 0.95, rotate: -0.5 } : {}}
        >
          <Button
            type="submit"
            className="w-full h-16 rounded-[1.5rem] bg-navy dark:bg-white text-white dark:text-navy hover:shadow-2xl hover:shadow-primary/20 transition-all text-[10px] tracking-[0.2em] uppercase font-black flex items-center justify-center gap-3 overflow-hidden relative group"
            disabled={loading}
          >
             <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <div className="relative flex items-center gap-2 text-[10px]">
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <span className="animate-pulse">{lang === "en" ? "TRANSMITTING..." : "MENGIRIM..."}</span>
                </>
              ) : (
                <>
                  <span className="z-10">{d.send_reset || "INITIATE RECOVERY"}</span>
                  <Mail size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                  <Sparkles size={16} className="absolute -top-4 -right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </Button>
        </motion.div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Already Remember?{" "}
          <Link
            href={`/${lang}/auth/login`}
            className="text-primary-500 hover:text-primary-600 transition-colors"
          >
            {d.login_button || "Sign In Instead"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

