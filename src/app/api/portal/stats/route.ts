import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { secureRoute } from "@/lib/api-middleware";

/** GET /api/portal/stats — Dashboard stats untuk portal mitra (protected) */
const getHandler = async (req: Request, { session }: any) => {
  try {
    const supabase = await createClient();
    const isPartner = session.user.role === 'partner';
    const instansiId = session.user.instansiId;

    // 1. Fetch Reports Stats
    let reportQuery = supabase.from('reports').select('status');
    
    // Isolation logic: Partner cuma liat aduan di wilayah/instansi mereka
    if (isPartner && instansiId) {
      reportQuery = reportQuery.eq('instansi_id', instansiId);
    }
    
    const { data: reportRows, error: reportError } = await reportQuery;
    if (reportError) throw reportError;

    const reportCounts = (reportRows || []).reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Fetch Financial Stats
    let financialQuery = supabase
      .from('financial_records')
      .select('program_name, allocation, realization, percentage, instansi_id');

    // Isolation logic: Partner cuma liat budget instansi mereka
    if (isPartner && instansiId) {
      financialQuery = financialQuery.eq('instansi_id', instansiId);
    }

    const { data: financialRows, error: financialError } = await financialQuery;
    if (financialError) throw financialError;

    const programsMap = (financialRows || []).reduce((acc: any, curr) => {
      if (!acc[curr.program_name]) {
        acc[curr.program_name] = { allocation: 0, realization: 0, progress: 0, count: 0 };
      }
      acc[curr.program_name].allocation += (curr.allocation || 0);
      acc[curr.program_name].realization += (curr.realization || 0);
      acc[curr.program_name].progress += (curr.percentage || 0);
      acc[curr.program_name].count += 1;
      return acc;
    }, {});

    const partnersMap = (financialRows || []).reduce((acc: any, curr) => {
      const id = curr.instansi_id || 'unknown';
      if (!acc[id]) {
        acc[id] = { allocation: 0, realization: 0 };
      }
      acc[id].allocation += (curr.allocation || 0);
      acc[id].realization += (curr.realization || 0);
      return acc;
    }, {});

    const stats = {
      reports: {
        total: (reportRows || []).length,
        byStatus: reportCounts,
      },
      programs: Object.keys(programsMap).map(name => ({
        name,
        allocation: programsMap[name].allocation,
        realization: programsMap[name].realization,
        progress: programsMap[name].count > 0 ? programsMap[name].progress / programsMap[name].count : 0,
      })),
      partners: Object.keys(partnersMap).map(id => ({
        id,
        allocation: partnersMap[id].allocation,
        realization: partnersMap[id].realization,
      }))
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("Portal Stats Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data statistik portal." }, { status: 500 });
  }
};

export const GET = secureRoute(getHandler, { roles: ['admin', 'partner', 'operator'], limit: 30 });
