"use client";

import React, { useState } from "react";
import Script from "next/script";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Wallet,
  FileText,
  CheckCircle2,
  Printer,
  AlertCircle,
  ShieldCheck,
  LayoutDashboard,
  Zap,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Building2,
  ReceiptText,
  ArrowLeft,
} from "lucide-react";
import { Card, Button } from "@/components/ui";
import { useI18n } from "@/app/[lang]/providers";
import {
  budgetPaymentSchema,
  type BudgetPaymentInput as BudgetPaymentFormData,
} from "@/lib/validations";
import { FundingSourceType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FinancialPaymentPortalProps {
  partnerId: string;
  partnerName: string;
  hideHeader?: boolean;
  topBadge?: React.ReactNode;
  isAdmin?: boolean;
}

export default function FinancialPaymentPortal({
  partnerId,
  partnerName,
  hideHeader = false,
  topBadge,
  isAdmin = false,
}: FinancialPaymentPortalProps) {
  const router = useRouter(); // Correctly use hook
  const dict = useI18n();
  const d = dict?.portal || {};
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetPaymentFormData>({
    resolver: zodResolver(budgetPaymentSchema),
    defaultValues: {
      programName: "",
      budgetCode: "",
      allocation: 0,
      // @ts-expect-error - Fixed legacy type mismatch
      source: FundingSourceType.APBN,
      disbursementStage: "Planning",
    },
  });

  const formData = watch();

  const handleNextStep = () => {
    // Basic trigger for current step validation could be added here
    setStep(2);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    try {
      const response = await axios.post("/api/payment/create", {
        amount: formData.allocation,
        budgetCode: formData.budgetCode,
        programName: formData.programName,
        partnerName: partnerName,
        partnerId: partnerId,
        source: formData.source,
        disbursementStage: formData.disbursementStage,
      });

      const { token } = response.data;

      // @ts-expect-error - Midtrans Window Object
      if (window.snap) {
        // @ts-expect-error - Midtrans Pay Method
        window.snap.pay(token, {
          onSuccess: (result: any) => {
            setInvoiceId(result.order_id || "INV-SUCCESS");
            setIsProcessing(false);
            setStep(3);
            toast.success(dict?.common?.success || "Transaksi Berhasil!", {
              description:
                d.payment_success_desc ||
                `Alokasi anggaran telah divalidasi dan tercatat.`,
            });
          },
          onPending: (result: any) => {
            console.log("Pending:", result);
            setIsProcessing(false);
            toast.info(d.payment_pending || "Pembayaran Pending", {
              description:
                d.payment_pending_desc || "Silakan selesaikan pembayaran Anda.",
            });
          },
          onError: (error: any) => {
            console.error("Snap Error:", error);
            setIsProcessing(false);
            toast.error(d.payment_failed || "Transaksi Gagal", {
              description:
                d.payment_failed_desc ||
                "Terjadi kesalahan saat memproses pembayaran.",
            });
          },
          onClose: () => {
            setIsProcessing(false);
            toast.warning(d.payment_cancelled || "Pembayaran Dibatalkan", {
              description:
                d.payment_cancelled_desc || "Anda menutup jendela pembayaran.",
            });
          },
        });
      } else {
        throw new Error("Midtrans Snap SDK not loaded.");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      setIsProcessing(false);
      toast.error(dict?.common?.error || "Error", {
        description:
          error.response?.data?.error ||
          d.midtrans_error ||
          "Gagal menghubungkan ke Midtrans.",
      });
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(dict?.lang === "en" ? "en-US" : "id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-5xl py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        {!hideHeader ? (
          <div>
            <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">
              <Zap size={14} className="fill-primary" /> {d.budget_portal_title}
            </div>
            <h1 className="text-5xl font-black text-navy dark:text-white tracking-tighter uppercase leading-none">
              Dana <span className="text-primary italic">Alokasi.</span>
            </h1>
            <p className="mt-4 text-slate-500 font-medium text-sm">
              {isAdmin
                ? d.budget_desc_admin
                : "Input anggaran terintegrasi untuk "}{" "}
              {!isAdmin && (
                <span className="text-navy dark:text-white font-black">
                  {partnerName === "Mitra Kerja"
                    ? d.internal_office
                    : partnerName}
                </span>
              )}
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topBadge}
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
              {isAdmin
                ? d.budget_desc_admin
                : `Input anggaran terintegrasi untuk ${
                    partnerName === "Mitra Kerja"
                      ? d.internal_office
                      : partnerName
                  }`}
            </p>
          </div>
        )}
        <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-bento">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "size-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500",
                step === s
                  ? "bg-primary text-white shadow-glow translate-y-[-2px]"
                  : step > s
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400",
              )}
            >
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 md:p-12 border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] border-t-8 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Wallet size={180} />
              </div>

              <form
                onSubmit={handleSubmit(handleNextStep)}
                className="relative z-10 space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <FileText size={16} className="text-primary-500" /> Nama
                      Program / Kegiatan
                    </label>
                    <input
                      {...register("programName")}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/20 text-sm font-bold shadow-inner dark:text-white"
                      placeholder="Contoh: Rehabilitasi Fasilitas Publik..."
                    />
                    {errors.programName && (
                      <p className="text-[10px] text-red-500 font-bold uppercase">
                        {errors.programName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <ShieldCheck size={16} className="text-primary-500" />{" "}
                      {d.budget_code}
                    </label>
                    <input
                      {...register("budgetCode")}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/20 text-sm font-bold shadow-inner dark:text-white uppercase"
                      placeholder={d.budget_code_placeholder}
                    />
                    {errors.budgetCode && (
                      <p className="text-[10px] text-red-500 font-bold uppercase">
                        {errors.budgetCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
                    >
                      <ArrowLeft size={16} /> {dict?.common?.back || "Kembali"}
                    </button>
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <Wallet size={16} className="text-primary-500" />{" "}
                      {d.amount_label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-navy dark:text-white pr-4 border-r border-slate-200 dark:border-slate-700">
                        Rp
                      </div>
                      <input
                        type="number"
                        onChange={(e) =>
                          setValue("allocation", Number(e.target.value))
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-16 pr-6 py-5 focus:ring-4 focus:ring-primary/20 text-xl font-black shadow-inner dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    {errors.allocation && (
                      <p className="text-[10px] text-red-500 font-bold uppercase">
                        {errors.allocation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <Building2 size={16} className="text-primary-500" />{" "}
                      {dict?.financial?.composition_title || "Sumber Dana"}
                    </label>
                    <select
                      {...register("source")}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/20 text-sm font-bold shadow-inner dark:text-white appearance-none"
                    >
                      {Object.values(FundingSourceType).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    type="submit"
                    className="group h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-primary transition-all hover:scale-[1.02]"
                    icon={
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    }
                  >
                    {dict?.common?.next || "Lanjutkan"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col gap-8"
          >
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle size={32} />
              </div>
              <div>
                <h4 className="font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest text-sm mb-1">
                  Peringatan Validasi
                </h4>
                <p className="text-xs font-medium text-amber-700/70 dark:text-amber-400/70 leading-relaxed">
                  {d.payment_notice}
                </p>
              </div>
            </div>

            <Card className="p-0 border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
              <div className="p-8 md:p-12 border-b-2 border-dashed border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="size-16 bg-navy rounded-2xl flex items-center justify-center text-white mb-6">
                      <ReceiptText size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-navy dark:text-white uppercase">
                      {d.confirm_payment_title}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      {d.billing_summary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {isAdmin ? d.budget_recipient : "Partner"}
                    </p>
                    <p className="text-lg font-black text-navy dark:text-white tracking-tighter">
                      {partnerName === "Mitra Kerja"
                        ? d.internal_office
                        : partnerName}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">
                      {partnerId === "INTERNAL" ? "UKP-INTERNAL-01" : partnerId}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Program/Kegiatan
                    </span>
                    <span className="text-sm font-black text-navy dark:text-white">
                      {formData.programName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Kode Anggaran
                    </span>
                    <span className="text-sm font-black text-primary font-mono select-all decoration-dotted underline decoration-2">
                      {formData.budgetCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Sumber Pendanaan
                    </span>
                    <span className="text-sm font-black text-navy dark:text-white">
                      {formData.source}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-8">
                    <span className="text-sm font-black text-navy dark:text-white uppercase tracking-tighter">
                      Total Billing
                    </span>
                    <span className="text-4xl font-black text-primary tracking-tighter italic">
                      {formatCurrency(formData.allocation)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-slate-800"
                  icon={<ChevronLeft size={16} />}
                >
                  {dict?.common?.back || "Kembali"}
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  loading={isProcessing}
                  className="flex-[2] h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-glow-primary"
                  icon={<CreditCard size={16} />}
                >
                  {d.pay_confirm}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-12"
          >
            <div className="size-32 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-glow-emerald mb-10 rotate-3 animate-bounce-subtle">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-5xl font-black text-navy dark:text-white uppercase tracking-tighter mb-4 text-center">
              {dict?.common?.transaction || "Transaksi"}{" "}
              <span className="text-emerald-500 italic">
                {dict?.common?.status_done || "Selesai"}.
              </span>
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">
              {d.payment_success_subtitle ||
                "Anggaran Berhasil Dialokasikan dalam Sistem Nasional"}
            </p>

            <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border-0 relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <ReceiptText size={120} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {d.invoice_number}
                    </p>
                    <p className="text-lg font-black text-navy dark:text-white">
                      {invoiceId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {d.payment_status}
                    </p>
                    <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-emerald-500/20">
                      SUCCESS
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      {isAdmin ? d.budget_recipient : "Penerima Alokasi"}
                    </label>
                    <p className="text-xs font-black text-navy dark:text-white uppercase">
                      {partnerName === "Mitra Kerja"
                        ? d.internal_office
                        : partnerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Kode Anggaran
                    </label>
                    <p className="text-xs font-black text-primary font-mono">
                      {formData.budgetCode}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">
                    Jumlah Terbayar
                  </p>
                  <p className="text-2xl font-black text-navy dark:text-white tracking-tighter">
                    {formatCurrency(formData.allocation)}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-slate-800"
                icon={<Printer size={16} />}
              >
                {d.generate_invoice}
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = `/${
                    dict?.lang || "id"
                  }/portal/partner/id?id=${partnerId}`)
                }
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-navy"
                icon={<LayoutDashboard size={16} />}
              >
                {dict?.nav?.dashboard || "Dasbor"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Midtrans Snap SDK */}
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
}
