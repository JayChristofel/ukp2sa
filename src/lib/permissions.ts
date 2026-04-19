/**
 * Master Daftar Permission UKP2SA
 * Format: 'resource:action'
 * 
 * Mapping halaman:
 * - Admin: /admin/* (16 halaman)
 * - Portal: /portal/partner/* (4 halaman)
 */
export const PERMISSIONS = {
  // ═══════════════════════════════════════
  // ADMIN DASHBOARD
  // ═══════════════════════════════════════

  // Dashboard Utama
  DASHBOARD_READ: 'dashboard:read',

  // Laporan (Reports)
  REPORTS_READ: 'reports:read',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EDIT: 'reports:edit',
  REPORTS_DELETE: 'reports:delete',
  REPORTS_VERIFY: 'reports:verify',
  REPORTS_REPLY: 'reports:reply',
  REPORTS_EXPORT: 'reports:export',

  // KPI & Monitoring
  KPI_READ: 'kpi:read',
  KPI_MANAGE: 'kpi:manage',

  // Peta & GIS
  MAP_READ: 'map:read',

  // Intelijen Satelit
  INTEL_READ: 'intel:read',

  // Penugasan (Assignments)
  TASKS_READ: 'tasks:read',
  TASKS_MANAGE: 'tasks:manage',

  // Clearing House
  CLEARING_READ: 'clearing:read',
  CLEARING_MANAGE: 'clearing:manage',

  // Donor Registration
  DONOR_READ: 'donor:read',
  DONOR_MANAGE: 'donor:manage',

  // Keuangan (Financial)
  FINANCE_READ: 'finance:read',
  FINANCE_MANAGE: 'finance:manage',

  // Tracking
  TRACKING_READ: 'tracking:read',

  // Ekonomi
  ECONOMY_READ: 'economy:read',
  ECONOMY_MANAGE: 'economy:manage',

  // Donor Portfolio
  PORTFOLIO_READ: 'portfolio:read',

  // Blog & Konten
  BLOG_READ: 'blog:read',
  BLOG_MANAGE: 'blog:manage',

  // User Management
  USERS_READ: 'users:read',
  USERS_MANAGE: 'users:manage',

  // Role Management
  ROLES_MANAGE: 'roles:manage',

  // Audit Trail
  AUDIT_READ: 'audit:read',

  // Settings
  SETTINGS_MANAGE: 'settings:manage',

  // Notifications
  NOTIFICATIONS_READ: 'notifications:read',

  // ═══════════════════════════════════════
  // MINI DASHBOARD (PORTAL)
  // ═══════════════════════════════════════

  // Portal Access
  PORTAL_PARTNER_ACCESS: 'portal:partner:access',
  PORTAL_DEPUTI_ACCESS: 'portal:deputi:access',

  // Portal - Ringkasan
  PORTAL_DASHBOARD_READ: 'portal:dashboard:read',

  // Portal - Monitor Laporan
  PORTAL_REPORTS_READ: 'portal:reports:read',
  PORTAL_REPORTS_CREATE: 'portal:reports:create',

  // Portal - Statistik
  PORTAL_STATS_READ: 'portal:stats:read',

  // Portal - Finansial
  PORTAL_FINANCE_READ: 'portal:finance:read',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface IPermission {
  id: string;
  label: string;
  description?: string;
}

export interface IPermissionGroup {
  name: string;
  permissions: IPermission[];
}

/**
 * PERMISSION_GROUPS — Source of truth buat UI & Seed ke Database.
 * SEMUA permission WAJIB terdaftar di sini.
 */
export const PERMISSION_GROUPS: IPermissionGroup[] = [
  {
    name: 'Dashboard',
    permissions: [
      { id: PERMISSIONS.DASHBOARD_READ, label: 'Akses Dashboard Utama', description: 'Melihat halaman utama dasbor' },
    ]
  },
  {
    name: 'Laporan (Reports)',
    permissions: [
      { id: PERMISSIONS.REPORTS_READ, label: 'Lihat Laporan', description: 'Melihat daftar & detail laporan' },
      { id: PERMISSIONS.REPORTS_CREATE, label: 'Buat Laporan Baru', description: 'Membuat laporan baru dari admin' },
      { id: PERMISSIONS.REPORTS_EDIT, label: 'Edit Laporan', description: 'Mengedit data laporan' },
      { id: PERMISSIONS.REPORTS_DELETE, label: 'Hapus Laporan', description: 'Menghapus laporan permanen' },
      { id: PERMISSIONS.REPORTS_VERIFY, label: 'Verifikasi Laporan', description: 'Memverifikasi laporan masuk' },
      { id: PERMISSIONS.REPORTS_REPLY, label: 'Balas Laporan', description: 'Memberikan respon ke pelapor' },
      { id: PERMISSIONS.REPORTS_EXPORT, label: 'Ekspor Laporan', description: 'Mengunduh laporan dalam format file' },
    ]
  },
  {
    name: 'Strategis',
    permissions: [
      { id: PERMISSIONS.KPI_READ, label: 'Lihat KPI', description: 'Melihat Key Performance Indicators' },
      { id: PERMISSIONS.KPI_MANAGE, label: 'Kelola KPI', description: 'Mengatur target & parameter KPI' },
      { id: PERMISSIONS.MAP_READ, label: 'Akses Peta & GIS', description: 'Melihat peta interaktif' },
      { id: PERMISSIONS.INTEL_READ, label: 'Akses Intelijen Satelit', description: 'Melihat data satelit & prakiraan' },
    ]
  },
  {
    name: 'Operasional',
    permissions: [
      { id: PERMISSIONS.TASKS_READ, label: 'Lihat Penugasan', description: 'Melihat daftar tugas lapangan' },
      { id: PERMISSIONS.TASKS_MANAGE, label: 'Kelola Penugasan', description: 'Membuat & assign tugas ke partner' },
      { id: PERMISSIONS.CLEARING_READ, label: 'Lihat Clearing House', description: 'Melihat data program alignment' },
      { id: PERMISSIONS.CLEARING_MANAGE, label: 'Kelola Clearing House', description: 'Mengatur clearing house data' },
      { id: PERMISSIONS.DONOR_READ, label: 'Lihat Data Donor', description: 'Melihat data registrasi donor' },
      { id: PERMISSIONS.DONOR_MANAGE, label: 'Kelola Registrasi Donor', description: 'Menambah & edit donor' },
    ]
  },
  {
    name: 'Keuangan & Ekonomi',
    permissions: [
      { id: PERMISSIONS.FINANCE_READ, label: 'Lihat Data Keuangan', description: 'Melihat progress anggaran' },
      { id: PERMISSIONS.FINANCE_MANAGE, label: 'Kelola Anggaran', description: 'Input & edit data keuangan' },
      { id: PERMISSIONS.TRACKING_READ, label: 'Lihat Tracking', description: 'Melihat tracking progress' },
      { id: PERMISSIONS.ECONOMY_READ, label: 'Lihat Data Ekonomi', description: 'Melihat indikator ekonomi' },
      { id: PERMISSIONS.ECONOMY_MANAGE, label: 'Kelola Data Ekonomi', description: 'Input data ekonomi & UMKM' },
      { id: PERMISSIONS.PORTFOLIO_READ, label: 'Lihat Portfolio Donor', description: 'Melihat portfolio donor' },
    ]
  },
  {
    name: 'Konten',
    permissions: [
      { id: PERMISSIONS.BLOG_READ, label: 'Lihat Blog & Artikel', description: 'Melihat konten publikasi' },
      { id: PERMISSIONS.BLOG_MANAGE, label: 'Kelola Blog & Artikel', description: 'CRUD blog posts' },
    ]
  },
  {
    name: 'Manajemen Sistem',
    permissions: [
      { id: PERMISSIONS.USERS_READ, label: 'Lihat Daftar User', description: 'Melihat daftar pengguna' },
      { id: PERMISSIONS.USERS_MANAGE, label: 'Kelola User', description: 'Tambah, edit, hapus user' },
      { id: PERMISSIONS.ROLES_MANAGE, label: 'Kelola Role & Izin', description: 'Mengatur role & permission' },
      { id: PERMISSIONS.AUDIT_READ, label: 'Lihat Audit Trail', description: 'Melihat log aktivitas sistem' },
      { id: PERMISSIONS.SETTINGS_MANAGE, label: 'Pengaturan Sistem', description: 'Mengatur konfigurasi aplikasi' },
      { id: PERMISSIONS.NOTIFICATIONS_READ, label: 'Notifikasi', description: 'Melihat pusat notifikasi' },
    ]
  },
  {
    name: 'Portal Mitra',
    permissions: [
      { id: PERMISSIONS.PORTAL_PARTNER_ACCESS, label: 'Akses Portal Mitra', description: 'Masuk ke mini dashboard partner' },
      { id: PERMISSIONS.PORTAL_DEPUTI_ACCESS, label: 'Akses Portal Deputi', description: 'Masuk ke portal deputi' },
      { id: PERMISSIONS.PORTAL_DASHBOARD_READ, label: 'Lihat Ringkasan Portal', description: 'Melihat dashboard portal' },
      { id: PERMISSIONS.PORTAL_REPORTS_READ, label: 'Monitor Laporan Portal', description: 'Melihat laporan terkait instansi' },
      { id: PERMISSIONS.PORTAL_REPORTS_CREATE, label: 'Buat Laporan dari Portal', description: 'Mengirim laporan via portal' },
      { id: PERMISSIONS.PORTAL_STATS_READ, label: 'Lihat Statistik Portal', description: 'Melihat statistik instansi' },
      { id: PERMISSIONS.PORTAL_FINANCE_READ, label: 'Lihat Keuangan Portal', description: 'Melihat data keuangan instansi' },
    ]
  }
];

/**
 * DEFAULT_ROLE_PERMISSIONS — Mapping default permission per role
 * Ini digunakan saat seeding & sebagai fallback
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  superadmin: Object.values(PERMISSIONS), // Semua permission tanpa kecuali

  presiden: [
    // Full read access ke seluruh admin dashboard
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.KPI_READ, PERMISSIONS.KPI_MANAGE,
    PERMISSIONS.MAP_READ, PERMISSIONS.INTEL_READ,
    PERMISSIONS.TASKS_READ,
    PERMISSIONS.CLEARING_READ,
    PERMISSIONS.DONOR_READ,
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.TRACKING_READ,
    PERMISSIONS.ECONOMY_READ,
    PERMISSIONS.PORTFOLIO_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
  ],

  deputi: [
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_VERIFY, PERMISSIONS.REPORTS_REPLY, PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.KPI_READ,
    PERMISSIONS.MAP_READ, PERMISSIONS.INTEL_READ,
    PERMISSIONS.TASKS_READ, PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.CLEARING_READ, PERMISSIONS.CLEARING_MANAGE,
    PERMISSIONS.DONOR_READ,
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.TRACKING_READ,
    PERMISSIONS.ECONOMY_READ,
    PERMISSIONS.PORTFOLIO_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    // Portal deputi
    PERMISSIONS.PORTAL_DEPUTI_ACCESS,
    PERMISSIONS.PORTAL_DASHBOARD_READ,
  ],

  admin: [
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_CREATE, PERMISSIONS.REPORTS_EDIT, PERMISSIONS.REPORTS_VERIFY, PERMISSIONS.REPORTS_REPLY, PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.KPI_READ,
    PERMISSIONS.MAP_READ, PERMISSIONS.INTEL_READ,
    PERMISSIONS.TASKS_READ, PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.CLEARING_READ, PERMISSIONS.CLEARING_MANAGE,
    PERMISSIONS.DONOR_READ, PERMISSIONS.DONOR_MANAGE,
    PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE,
    PERMISSIONS.TRACKING_READ,
    PERMISSIONS.ECONOMY_READ, PERMISSIONS.ECONOMY_MANAGE,
    PERMISSIONS.PORTFOLIO_READ,
    PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_MANAGE,
    PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.NOTIFICATIONS_READ,
  ],

  operator: [
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_CREATE, PERMISSIONS.REPORTS_EDIT, PERMISSIONS.REPORTS_VERIFY, PERMISSIONS.REPORTS_REPLY,
    PERMISSIONS.MAP_READ,
    PERMISSIONS.TASKS_READ, PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.CLEARING_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    // Portal operator (bisa juga masuk portal)
    PERMISSIONS.PORTAL_PARTNER_ACCESS,
    PERMISSIONS.PORTAL_DASHBOARD_READ,
    PERMISSIONS.PORTAL_REPORTS_READ,
    PERMISSIONS.PORTAL_REPORTS_CREATE,
  ],

  partner: [
    // Hanya portal, TIDAK bisa akses admin
    PERMISSIONS.PORTAL_PARTNER_ACCESS,
    PERMISSIONS.PORTAL_DASHBOARD_READ,
    PERMISSIONS.PORTAL_REPORTS_READ,
    PERMISSIONS.PORTAL_REPORTS_CREATE,
    PERMISSIONS.PORTAL_STATS_READ,
    PERMISSIONS.PORTAL_FINANCE_READ,
  ],

  ngo: [
    // Hanya portal, TIDAK bisa akses admin
    PERMISSIONS.PORTAL_PARTNER_ACCESS,
    PERMISSIONS.PORTAL_DASHBOARD_READ,
    PERMISSIONS.PORTAL_REPORTS_READ,
    PERMISSIONS.PORTAL_REPORTS_CREATE,
    PERMISSIONS.PORTAL_STATS_READ,
  ],

  public: [
    // Nol permission — hanya bisa lihat halaman publik
  ],
};

/**
 * Helper: Cek apakah role punya permission tertentu
 */
export function hasPermission(role: string, permission: string): boolean {
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;
  return rolePermissions.includes(permission);
}

/**
 * Helper: Get semua permission untuk sebuah role
 */
export function getPermissionsForRole(role: string): string[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}
