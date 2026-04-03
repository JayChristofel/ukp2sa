export enum ReportStatus {
  PROCESS = 'Diproses',
  DONE = 'Selesai',
  PENDING = 'Menunggu'
}

export interface SatellitePoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

export interface SatelliteLayer {
  id: string;
  name: string;
  type: "Heatmap" | "Deformation" | "Rainfall";
  lastUpdate: string;
  points: SatellitePoint[];
}

export interface SatelliteIntel {
  rainfallLevel?: string;
  groundDeformation?: string;
  vegetationIndex?: number;
  confidenceScore?: number;
  lastScan?: string;
  additionalData?: any; // For external API extensions
}

export type ReporterType = 'masyarakat' | 'pemerintah' | 'admin' | 'partner' | 'ngo';

export type UserRole = 'presiden' | 'deputi' | 'partner' | 'ngo' | 'admin' | 'operator' | 'superadmin' | 'public';

export interface Partner {
  id: string;
  name: string;
  category: 'K/L' | 'Pemda' | 'Satgas' | 'NGO';
  url: string;
  imageSrc: string;
}

export interface AdminReply {
  content: string;
  repliedAt: string;
  repliedBy: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  regency: string;
  district?: string;
  village?: string;
  address?: string;
  reporterName: string;
  contactPhone: string;
  nik?: string;
  latitude: string;
  longitude: string;
  timeAgo: string;
  status: ReportStatus;
  category: string;
  source: 'rest' | 'graphql' | 'mobile' | 'satellite';
  reporterType: ReporterType;
  adminReply?: AdminReply;
  isVerified?: boolean;
  images?: string[];
  answers?: {
    questionId: number;
    answer: any;
  }[];
  createdAt?: string;
  satelliteIntel?: SatelliteIntel;
  data?: any;
}

export type IReport = Report;

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended'
}

export interface Permission {
  id: string;
  name: string;
  module:
    | "dashboard"
    | "laporan"
    | "kpi"
    | "map"
    | "intel"
    | "assignments"
    | "clearing-house"
    | "donor"
    | "financial"
    | "tracking"
    | "economy"
    | "portfolio"
    | "blog"
    | "users"
    | "roles"
    | "audit-trail"
    | "settings"
    | "notifications"
    | "portal";
  key: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  instansiId?: string; // For Partner/NGO data isolation
  instansi?: any;      // Virtual/Populated Partner data
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}

export enum FundingSourceType {
  APBN = 'APBN',
  APBD = 'APBD',
  HIBAH = 'Hibah Government',
  NGO = 'NGO/Filantropi',
  CWLS = 'CWLS (Islamic Finance)',
  DIASPORA = 'Diaspora Bond',
  PPP = 'PPP/KPBU'
}

export type DisbursementStage = 'Planning' | 'Approval' | 'Treasury' | 'Transfer' | 'Completed';

export interface DisbursementHistory {
  stage: DisbursementStage;
  amount: number;
  date: string;
  note?: string;
}

export interface FinancialRecord {
  id: string;
  partnerId: string;
  programName: string;
  allocation: number;
  realization: number;
  percentage: number;
  source: FundingSourceType;
  disbursementStage: DisbursementStage;
  history: DisbursementHistory[];
  lastUpdate: string;
  status: 'Draft' | 'Final';
}

export interface ProgramLink {
  label: string;
  href: string;
  requiresAuth: boolean;
}

export interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  change?: string;
  isAccent?: boolean;
}

export interface ReportFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalCount: number;
}
export interface BeneficiaryGroup {
  id: string;
  category: 'UMKM' | 'Petani' | 'Nelayan' | 'Pengungsi' | 'Lainnya';
  totalPeople: number;
  totalFunds: number;
  impactMetric: string;
  impactValue: string;
}

export interface AssetRestoration {
  id: string;
  name: string;
  type: 'Fasum' | 'Sekolah' | 'Masjid/Ibadah' | 'Jalan' | 'Jembatan';
  status: 'Survey' | 'Konstruksi' | 'Selesai';
  progress: number;
  location: string;
}

export interface PublicUpdate {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "Berita" | "Pengumuman" | "Literasi" | "Hoaks & Klarifikasi";
  publishDate: string;
  author: string;
  image?: string;
  tags: string[];
  views?: number;
}
export interface ProgramAlignment {
  id: string;
  location: string;
  isOverlapping: boolean;
  conflictDetails?: string;
  programs: {
    source: string;
    name: string;
    budget: number;
    status: string;
  }[];
}

export interface BeneficiaryTimelineEvent {
  stage: "Tenda" | "Huntara" | "Huntap";
  date: string;
  location: string;
  status: "Completed" | "In Progress" | "Pending";
  note?: string;
}

export interface BeneficiaryPersonal {
  nik: string;
  name: string;
  regency: string;
  timeline: BeneficiaryTimelineEvent[];
}

export interface LandRecovery {
  id: string;
  type: "Sawah" | "Tambak" | "Kebun";
  location: string;
  totalArea: number;
  recoveredArea: number;
  lastUpdate: string;
}

export interface EconomicOutcome {
  stabilizationIndex: number; // 0.0 - 5.0
  marketPriceStability: number;
  employmentRate: number;
  landRecoveryRate: number;
  target?: number;
  mom?: string;
}

export interface UMKMMetrics {
  totalUMKM: number;
  pulih: number;
  rataRataOmzetPulih: number;
  penerapanCashForWork: number;
}

export interface IntegrityScore {
  totalScore: number; // 0-100
  dimensions: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
  overlapsFound: number;
  lastAudit: string;
}

// --- Phase A: New Types ---

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Assigned' | 'En Route' | 'On Site' | 'Resolved' | 'Escalated';

export interface FieldTask {
  id: string;
  reportId?: string;
  title: string;
  assignedTo: string; // Partner ID or K/L name
  assignedToCategory: 'K/L' | 'Pemda' | 'Satgas' | 'NGO';
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  notes: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface KPITarget {
  id: string;
  sector: 'Sosial' | 'Infrastruktur' | 'Ekonomi' | 'Lingkungan';
  indicator: string;
  unit: string;
  target: number;
  actual: number;
  lastUpdate: string;
}
