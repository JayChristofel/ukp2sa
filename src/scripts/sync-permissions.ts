import { createScriptClient } from '../lib/supabase-script';
import { PERMISSION_GROUPS, PERMISSIONS } from '../lib/permissions';

/**
 * Sinkronkan semua permission dari kode ke Supabase
 * Menambah yang baru, menghapus yang sudah tidak ada di kode
 * Run: npx tsx src/scripts/sync-permissions.ts
 */
async function syncPermissions() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  🔐 UKP2SA — Supabase Permission Sync ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');

  try {
    const supabase = await createScriptClient();
    console.log('📡 Connected to Supabase\n');

    // Flatten semua permissions dari groups
    const allPermissions = PERMISSION_GROUPS.flatMap(group => 
      group.permissions.map(p => ({
        id: p.id,
        name: p.label,
        module: group.name,
        description: p.description || `Hak akses untuk ${p.label} pada modul ${group.name}`,
        updated_at: new Date().toISOString()
      }))
    );

    let upsertedCount = 0;

    for (const pData of allPermissions) {
      const { error } = await supabase
        .from('permissions')
        .upsert(pData);

      if (error) {
        console.error(`  ❌ Error syncing ${pData.id}:`, error.message);
      } else {
        upsertedCount++;
      }
    }

    // Bersihkan permission lama yang sudah tidak ada di kode
    const existingIds = allPermissions.map(p => p.id);
    const { error: deleteError, count: deletedCount } = await supabase
      .from('permissions')
      .delete()
      .not('id', 'in', `(${existingIds.join(',')})`);

    if (deleteError) {
      console.error("❌ Delete Error:", deleteError.message);
    }

    console.log('');
    console.log(`📊 Summary:`);
    console.log(`   Permissions upserted : ${upsertedCount}`);
    console.log(`   Permissions removed  : ${deletedCount || 0}`);
    console.log(`   Total in code        : ${Object.values(PERMISSIONS).length}`);
    console.log(`   Total synced to DB   : ${allPermissions.length}`);
    console.log('');
    console.log('✅ Permission Sync Completed!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Sync Error:', error);
    process.exit(1);
  }
}

syncPermissions();
