import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { ReportStatus } from "@/lib/types";

export const useUnifiedReports = (limit = 100, lang = "id") => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["reportAnswers", limit],
        queryFn: () => apiService.getReportAnswers(limit),
        refetchInterval: 60000,
        staleTime: 60000,
      },
      {
        queryKey: ["missingPersonsFeed"],
        queryFn: () => apiService.getMissingPersons(1),
        refetchInterval: 300000,
        staleTime: 300000,
      },
      {
        queryKey: ["reportTopics"],
        queryFn: () => apiService.getTopics(),
        staleTime: 3600000,
      },
      {
        queryKey: ["localReports"],
        queryFn: () => apiService.getLocalReports(),
        refetchInterval: 30000,
      },
    ],
  });

  const [qAnswers, qMissingPersons, qTopics, qLocal] = queries;

  const answersData = qAnswers.data;
  const missingData = qMissingPersons.data;
  const topicsData = qTopics.data;
  const localData = qLocal.data;

  const reports = useMemo(() => {
    const combined: any[] = [];
    const topicsMap = new Map();
    topicsData?.forEach((t: any) => {
      const name = 
        typeof t.name === 'object' && t.name !== null
          ? (t.name[lang] || t.name['id'] || "")
          : (t.label || t.name || t.title || "");
      topicsMap.set(t.id, name);
    });

    // 1. Citizen Reports
    answersData?.forEach((item: any) => {
      const topicName = topicsMap.get(item.topicId);
      const answers = item.answers || [];
      const longTextEntry = answers.find((a: any) => a.questionType === "long_text");
      const firstEntry = answers[0];

      const description =
        longTextEntry?.answer ||
        (typeof firstEntry?.answer === "string"
          ? firstEntry?.answer
          : (firstEntry?.answer?.[lang] || firstEntry?.answer?.id || firstEntry?.answer?.label)) ||
        item.answer ||
        item.description ||
        "Tidak ada deskripsi tambahan.";

      const rawTitle = firstEntry?.question || item.question || item.title || "Laporan Warga";
      const title = typeof rawTitle === 'object' && rawTitle !== null
        ? (rawTitle[lang] || rawTitle['id'] || "Laporan Warga")
        : rawTitle.toString();

      let mType = "report";
      const qText = title.toString().toLowerCase();
      if (qText.includes("jalan")) mType = "jalan-rusak";
      else if (qText.includes("jembatan")) mType = "jembatan-rusak";
      combined.push({
        id: `ans-${item.id}`,
        title: title.toString().length > 60 ? title.toString().slice(0, 60) + "..." : title.toString(),
        description,
        location: item.village || item.location || item.address || "Aceh",
        regency: item.regency || "Aceh",
        reporterName: item.respondentInfo?.fullName || item.username || item.reporterName || "Anonim",
        reporterType: "masyarakat",
        status: (() => {
          const s = (item.status || "").toUpperCase();
          if (s === "DONE" || s === "SELESAI") return ReportStatus.DONE;
          if (s === "PROCESS" || s === "DIPROSES") return ReportStatus.PROCESS;
          return ReportStatus.PENDING;
        })(),
        category: topicName || (mType === "report" ? "Laporan Umum" : "Infrastruktur"),
        markerType: mType,
        data: item,
        createdAt: item.date || item.createdAt || new Date().toISOString(),
      });
    });

    // 2. Missing Persons
    missingData?.forEach((item: any) => {
      combined.push({
        id: `missing-${item.id}`,
        title: `Orang Hilang: ${item.missingPersonName || "Tanpa Nama"}`,
        description: item.missingConditionDetails?.conditionWhenMissing || "Informasi orang hilang.",
        location: item.missingConditionDetails?.locationLastSeen?.address || item.village || "Aceh",
        regency: item.regency?.replace("Kabupaten ", "") || "Aceh",
        reporterName: item.reporterName || "Pemerintah",
        reporterType: "pemerintah",
        status: (() => {
          const s = (item.missingPersonStatus || "").toUpperCase();
          if (s === "RESOLVED" || s === "SELESAI" || s === "DONE") return ReportStatus.DONE;
          if (s === "SEARCHING" || s === "DIPROSES" || s === "PROSES") return ReportStatus.PROCESS;
          return ReportStatus.PENDING;
        })(),
        category: "Orang Hilang",
        markerType: "missing-person",
        data: item,
        createdAt: item.createdAt,
      });
    });

    // 3. Local Reports (MongoDB)
    localData?.forEach((item: any) => {
      combined.push({
        id: `local-${item.id || item._id}`,
        title: item.title || "Laporan Citizens",
        description: item.description || "Laporan warga dari sistem.",
        location: item.address || item.location || "Aceh",
        regency: item.regency || "Aceh",
        reporterName: item.reporterName || "Warga",
        reporterType: "masyarakat",
        status: item.status || ReportStatus.PENDING,
        category: item.category || "Infrastruktur",
        markerType: "report",
        data: item,
        createdAt: item.createdAt || new Date().toISOString(),
      });
    });

    return combined.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [answersData, missingData, topicsData, localData, lang]);

  return {
    reports,
    topics: topicsData || [],
    isLoading: queries.some(q => q.isPending),
    isRefetching: queries.some(q => q.isRefetching),
  };
};
