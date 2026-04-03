"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_GROUPS = exports.PERMISSIONS = void 0;
/**
 * Master Daftar Permission di UKP2SA
 * Format: 'resource:action'
 */
exports.PERMISSIONS = {
    // Laporan
    REPORTS_READ: 'reports:read',
    REPORTS_CREATE: 'reports:create',
    REPORTS_EDIT: 'reports:edit',
    REPORTS_DELETE: 'reports:delete',
    REPORTS_VERIFY: 'reports:verify',
    REPORTS_REPLY: 'reports:reply',
    // Penugasan (Tasks)
    TASKS_READ: 'tasks:read',
    TASKS_MANAGE: 'tasks:manage',
    // Keuangan
    FINANCE_READ: 'finance:read',
    FINANCE_MANAGE: 'finance:manage',
    // User & Roles
    USERS_READ: 'users:read',
    USERS_MANAGE: 'users:manage',
    ROLES_MANAGE: 'roles:manage',
    // System
    AUDIT_READ: 'audit:read',
    SETTINGS_MANAGE: 'settings:manage',
    // Konten & Blog
    BLOG_READ: 'blog:read',
    BLOG_MANAGE: 'blog:manage',
    // Peta & Monitoring
    MAP_READ: 'map:read',
    INTEL_READ: 'intel:read',
    // Portal Specific
    PORTAL_PARTNER_ACCESS: 'portal:partner:access',
    PORTAL_DEPUTI_ACCESS: 'portal:deputi:access',
};
/**
 * PERMISSION_GROUPS — Source of truth buat UI & Sync ke Database.
 * SEMUA permission WAJIB ada di sini.
 */
exports.PERMISSION_GROUPS = [
    {
        name: 'Laporan (Reports)',
        permissions: [
            { id: exports.PERMISSIONS.REPORTS_READ, label: 'Lihat Laporan' },
            { id: exports.PERMISSIONS.REPORTS_CREATE, label: 'Buat Laporan Baru' },
            { id: exports.PERMISSIONS.REPORTS_EDIT, label: 'Edit Laporan' },
            { id: exports.PERMISSIONS.REPORTS_DELETE, label: 'Hapus Laporan' },
            { id: exports.PERMISSIONS.REPORTS_VERIFY, label: 'Verifikasi Laporan' },
            { id: exports.PERMISSIONS.REPORTS_REPLY, label: 'Balas Laporan' },
        ]
    },
    {
        name: 'Operasional',
        permissions: [
            { id: exports.PERMISSIONS.TASKS_READ, label: 'Lihat Penugasan' },
            { id: exports.PERMISSIONS.TASKS_MANAGE, label: 'Kelola Penugasan (Assign)' },
        ]
    },
    {
        name: 'Keuangan',
        permissions: [
            { id: exports.PERMISSIONS.FINANCE_READ, label: 'Lihat Data Keuangan' },
            { id: exports.PERMISSIONS.FINANCE_MANAGE, label: 'Kelola Anggaran & Realisasi' },
        ]
    },
    {
        name: 'Konten & Monitoring',
        permissions: [
            { id: exports.PERMISSIONS.BLOG_READ, label: 'Lihat Blog & Artikel' },
            { id: exports.PERMISSIONS.BLOG_MANAGE, label: 'Kelola Blog & Artikel' },
            { id: exports.PERMISSIONS.MAP_READ, label: 'Akses Peta & GIS' },
            { id: exports.PERMISSIONS.INTEL_READ, label: 'Akses Intelijen Satelit' },
        ]
    },
    {
        name: 'Manajemen Sistem',
        permissions: [
            { id: exports.PERMISSIONS.USERS_READ, label: 'Lihat Daftar User' },
            { id: exports.PERMISSIONS.USERS_MANAGE, label: 'Kelola User' },
            { id: exports.PERMISSIONS.ROLES_MANAGE, label: 'Kelola Role & Izin' },
            { id: exports.PERMISSIONS.AUDIT_READ, label: 'Lihat Audit Trail' },
            { id: exports.PERMISSIONS.SETTINGS_MANAGE, label: 'Pengaturan Sistem' },
        ]
    },
    {
        name: 'Portal Akses',
        permissions: [
            { id: exports.PERMISSIONS.PORTAL_PARTNER_ACCESS, label: 'Akses Portal Mitra' },
            { id: exports.PERMISSIONS.PORTAL_DEPUTI_ACCESS, label: 'Akses Portal Deputi' },
        ]
    }
];
