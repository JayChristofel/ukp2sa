import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Fetch Reports Stats (by status)
    const { data: reportRows, error: reportError } = await supabase
      .from('reports')
      .select('status');
    
    if (reportError) throw reportError;

    const reportCounts = (reportRows || []).reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Fetch Financial Stats (grouped by program_name)
    const { data: financialRows, error: financialError } = await supabase
      .from('financial_records')
      .select('program_name, allocation, realization, percentage, instansi_id');

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
        progress: programsMap[name].progress / programsMap[name].count,
      })),
      partners: Object.keys(partnersMap).map(id => ({
        id,
        allocation: partnersMap[id].allocation,
        realization: partnersMap[id].realization,
      }))
    };

    return NextResponse.json({ status: "success", data: stats });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
