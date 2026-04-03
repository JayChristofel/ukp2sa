import { createScriptClient } from '../lib/supabase-script';
import bcrypt from 'bcryptjs';

/**
 * Seed user sample untuk semua role ke Supabase
 * Run: npx tsx src/scripts/seed-users.ts
 * Default password: password123
 */
const USERS = [
  // === ADMIN DASHBOARD USERS ===
  { name: "Super Admin UKP2SA", email: "superadmin@ukp2sa.go.id", password: "password123", role: "superadmin", status: "ACTIVE", instansiId: null },
  { name: "Presiden Satker", email: "presiden@ukp2sa.go.id", password: "password123", role: "presiden", status: "ACTIVE", instansiId: null },
  { name: "Deputi Rehabilitasi", email: "deputi@ukp2sa.go.id", password: "password123", role: "deputi", status: "ACTIVE", instansiId: null },
  { name: "Admin Operasional", email: "admin@ukp2sa.go.id", password: "password123", role: "admin", status: "ACTIVE", instansiId: null },
  { name: "Operator Lapangan", email: "operator@ukp2sa.go.id", password: "password123", role: "operator", status: "ACTIVE", instansiId: null },

  // === PORTAL / MINI DASHBOARD USERS ===
  { name: "Satgas SAR", email: "sar@partner.id", password: "password123", role: "partner", status: "ACTIVE", instansiId: "p1" },
  { name: "BPBD Aceh", email: "bpbd@partner.id", password: "password123", role: "partner", status: "ACTIVE", instansiId: "p2" },
  { name: "Kementerian PUPR", email: "pupr@partner.id", password: "password123", role: "partner", status: "ACTIVE", instansiId: "p3" },
  { name: "BPN Pertanahan", email: "bpn@partner.id", password: "password123", role: "partner", status: "ACTIVE", instansiId: "p4" },
  { name: "ACF Indonesia", email: "acf@ngo.org", password: "password123", role: "ngo", status: "ACTIVE", instansiId: "p1" },
  { name: "PMI Aceh", email: "pmi@ngo.org", password: "password123", role: "ngo", status: "ACTIVE", instansiId: "p2" },

  // === PUBLIC USER (no access) ===
  { name: "Warga Biasa", email: "warga@gmail.com", password: "password123", role: "public", status: "ACTIVE", instansiId: null },
];

async function seedUsers() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   👤 UKP2SA — Supabase User Seed      ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');

  const supabase = await createScriptClient();
  console.log('📡 Connected to Supabase\n');

  let upsertedCount = 0;

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('users')
      .upsert({
        name: u.name,
        email: u.email,
        password: hash,
        role: u.role,
        status: u.status,
        instansi_id: u.instansiId, // Mapping camelCase to snake_case
        updated_at: now,
      }, { onConflict: 'email' });

    if (error) {
      console.error(`  ❌ Error: ${u.email}:`, error.message);
    } else {
      upsertedCount++;
      console.log(`  ✨ Upserted: ${u.email} [${u.role}]`);
    }
  }

  console.log('');
  console.log(`📊 Summary:`);
  console.log(`   Total users processed: ${USERS.length}`);
  console.log(`   Successfully upserted: ${upsertedCount}`);
  console.log(`   Default pass         : password123`);
  console.log('');
  console.log('✅ User Seeding Completed!');

  process.exit(0);
}

seedUsers().catch(err => { console.error('❌', err); process.exit(1); });
