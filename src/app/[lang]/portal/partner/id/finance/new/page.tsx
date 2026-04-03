"use client";

import React from "react";
import FinancialPaymentPortal from "@/components/sections/FinancialPaymentPortal";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PARTNERS_DATA } from "@/lib/constants";
import { useI18n } from "@/app/[lang]/providers";

import { useSession } from "next-auth/react";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function NewPortalFinance() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <NewPortalFinanceContent />
    </React.Suspense>
  );
}

function NewPortalFinanceContent() {
  const { data: session, status: authStatus } = useSession();
  const dict = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const partnerId = id || "";
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (authStatus === "loading") return;
    if (!session?.user) {
      setIsAuthorized(false);
      return;
    }
    const user = session.user as any;
    const hasAccess =
      user.role === "superadmin" ||
      user.role === "admin" ||
      user.instansiId === partnerId;
    setIsAuthorized(hasAccess);
  }, [session, partnerId, authStatus]);

  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="size-24 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-4xl font-black text-navy dark:text-white mb-4 uppercase tracking-tight">
          {dict?.common?.access_denied || "Akses Ditolak"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mb-10 leading-relaxed">
          {dict?.common?.no_permission ||
            "Maaf, Anda tidak memiliki izin untuk mengakses Dashboard ini."}{" "}
          {dict?.common?.use_correct_account ||
            "Silakan gunakan akun yang sesuai."}
        </p>
        <button
          onClick={() => router.push(`/${dict?.lang || "id"}/auth/login`)}
          className="flex items-center gap-3 px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {dict?.common?.back_to_login || "Kembali ke Login"}{" "}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Find partner name if available
  const partner = PARTNERS_DATA.find((p) => p.id === partnerId);
  const partnerName = partner?.name || "Mitra";

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> {dict?.common?.back || "Kembali"}
      </button>
      <FinancialPaymentPortal partnerId={partnerId} partnerName={partnerName} />
    </div>
  );
}
