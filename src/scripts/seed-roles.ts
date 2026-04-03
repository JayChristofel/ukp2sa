import { createScriptClient } from '../lib/supabase-script';
import { DEFAULT_ROLE_PERMISSIONS } from '../lib/permissions';

/**
 * Seed semua role dengan permission lengkap ke Supabase
 * Run: npx tsx src/scripts/seed-roles.ts
 */

const ROLES = [
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Akses penuh tanpa batas ke seluruh modul sistem admin dan portal.',
    permissions: DEFAULT_ROLE_PERMISSIONS.superadmin,
  },
  {
    id: 'presiden',
    name: 'Presiden / Kepala Unit',
    description: 'Read-access penuh ke seluruh dashboard strategis. Tidak bisa mengedit data operasional.',
    permissions: DEFAULT_ROLE_PERMISSIONS.presiden,
  },
  {
    id: 'deputi',
    name: 'Deputi',
    description: 'Akses operasional dan strategis. Bisa verifikasi laporan dan kelola penugasan.',
    permissions: DEFAULT_ROLE_PERMISSIONS.deputi,
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manajemen operasional harian. Full CRUD pada laporan, user, blog, dan keuangan.',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
  },
  {
    id: 'operator',
    name: 'Operator',
    description: 'Input data, verifikasi laporan, dan penugasan dasar. Akses terbatas ke portal.',
    permissions: DEFAULT_ROLE_PERMISSIONS.operator,
  },
  {
    id: 'partner',
    name: 'Mitra Kerja (Satgas/K/L)',
    description: 'Akses portal mitra: ringkasan, laporan, statistik, dan keuangan instansi sendiri.',
    permissions: DEFAULT_ROLE_PERMISSIONS.partner,
  },
  {
    id: 'ngo',
    name: 'NGO / Filantropi',
    description: 'Akses portal mitra: ringkasan, laporan, dan statistik. Tanpa akses keuangan.',
    permissions: DEFAULT_ROLE_PERMISSIONS.ngo,
  },
  {
    id: 'public',
    name: 'Publik',
    description: 'Pengunjung umum. Hanya bisa melihat halaman publik, tanpa akses admin maupun portal.',
    permissions: DEFAULT_ROLE_PERMISSIONS.public,
  },
];

async function seedRoles() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  🛡️  UKP2SA — Supabase Role Seed      ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');

  try {
    const supabase = await createScriptClient();
    console.log('📡 Connected to Supabase');
    console.log('');

    let upserted = 0;

    for (const roleData of ROLES) {
      const { error } = await supabase
        .from('roles')
        .upsert({
          id: roleData.id,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`  ❌ Error seeding ${roleData.id}:`, error.message);
      } else {
        upserted++;
        console.log(`  ✨ Upserted: ${roleData.name} (${roleData.id})`);
      }
    }

    console.log('');
    console.log(`📊 Summary:`);
    console.log(`   Roles processed: ${ROLES.length}`);
    console.log(`   Roles upserted : ${upserted}`);
    console.log('');
    console.log('✅ Role Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error Seeding Roles:', error);
    process.exit(1);
  }
}

seedRoles();
