/**
 * Financial & Report Interfaces
 */

export interface FinancialRecord {
  id: string;
  programName: string;
  amount_realization: number;
  realization: number;
  percentage: number;
  kabupatenKota: string;
  agency: string;
  fundingScheme: string;
  payment_status?: string;
  last_update?: string;
}

export interface ReportItem {
  id: string;
  _id?: string;
  isExternal?: boolean;
  question?: string;
  title?: string;
  regency?: string;
  category?: string;
  subject: string;
  status: string;
  details: string;
  timestamp: string;
  createdAt?: string;
  userName: string;
  ipAddress: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: string;
  progress: number;
  category: "SAR" | "Logistik" | "Masyarakat" | "Kemitraan" | "Infrastruktur" | "Keamanan" | string;
  assignee: string;
  createdAt: string;
}
