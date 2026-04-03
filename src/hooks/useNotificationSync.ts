import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useNotificationStore } from "./useNotificationStore";
import { toast } from "sonner";

export function useNotificationSync() {
  const { 
    lastSeenReportId, 
    setLastSeenReportId, 
    lastSeenPaymentId, 
    setLastSeenPaymentId, 
    addNotification 
  } = useNotificationStore();
  const isFirstRun = useRef(true);
  const isFirstRunPayment = useRef(true);

  // --- 1. SYNC REPORTS ---
  const { data: reports } = useQuery({
    queryKey: ["sync-reports"],
    queryFn: () => apiService.getReportAnswers(5),
    refetchInterval: 60000,
  });

  // --- 2. SYNC PAYMENTS ---
  const { data: payments } = useQuery({
    queryKey: ["sync-payments"],
    queryFn: async () => {
      const res = await fetch("/api/admin/financial/latest");
      return res.json();
    },
    refetchInterval: 65000, // Slightly offset from reports for stability
  });

  // Handle Reports Sync
  useEffect(() => {
    if (!reports || reports.length === 0) return;
    const latestId = reports[0].id.toString();
    if (isFirstRun.current) {
      if (!lastSeenReportId) setLastSeenReportId(latestId);
      isFirstRun.current = false;
      return;
    }

    const newItems = [];
    for (const item of reports) {
      if (item.id.toString() === lastSeenReportId) break;
      newItems.push(item);
    }

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        addNotification({
          title: "Laporan Warga Baru",
          description: (item.answers?.[0]?.answer || "Laporan baru masuk.").toString().slice(0, 80),
          type: "report",
          priority: "high",
          actionLabel: "Lihat Peta",
          link: "/admin/map",
        });
        toast.info("Laporan Baru", { description: "Ada laporan warga baru terdeteksi." });
      });
      setLastSeenReportId(latestId);
    }
  }, [reports, lastSeenReportId, setLastSeenReportId, addNotification]);

  // Handle Payments Sync
  useEffect(() => {
    if (!payments || !Array.isArray(payments) || payments.length === 0) return;
    
    // Defensive check for the ID field
    const firstPayment = payments[0];
    const latestId = firstPayment?._id?.toString() || firstPayment?.id?.toString();

    if (!latestId) return; // Skip if no ID found

    if (isFirstRunPayment.current) {
      if (!lastSeenPaymentId) setLastSeenPaymentId(latestId);
      isFirstRunPayment.current = false;
      return;
    }

    const newItems = [];
    for (const item of payments) {
      const itemId = item?._id?.toString() || item?.id?.toString();
      if (!itemId || itemId === lastSeenPaymentId) break;
      newItems.push(item);
    }

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        const isSuccess = item.paymentStatus === "settlement" || item.paymentStatus === "capture";
        const isFailed = ["failed", "cancel", "deny", "expire"].includes(item.paymentStatus);

        if (isSuccess) {
          addNotification({
            title: "Pembayaran Berhasil",
            description: `Dana bantuan untuk ${item.regency} telah terverifikasi via Midtrans.`,
            type: "payment",
            priority: "medium",
            actionLabel: "Cek Audit",
            link: "/admin/financial/progress",
          });
          toast.success("DANA TERVERIFIKASI", { 
            description: `Alokasi dana ${item.regency} sudah masuk ke sistem.` 
          });
        } else if (isFailed) {
          addNotification({
            title: "Pembayaran Gagal/Expired",
            description: `Transaksi untuk ${item.regency} tidak berhasil. Status: ${item.paymentStatus}.`,
            type: "payment",
            priority: "high",
            actionLabel: "Follow Up",
            link: "/admin/financial/progress",
          });
          toast.error("PEMBAYARAN BERMASALAH", { 
            description: `Transaksi ${item.regency} gagal atau expired.` 
          });
        }
      });
      setLastSeenPaymentId(latestId);
    }
  }, [payments, lastSeenPaymentId, setLastSeenPaymentId, addNotification]);
}
