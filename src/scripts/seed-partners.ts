import { createScriptClient } from '../lib/supabase-script';
import { PARTNERS_DATA } from '../lib/constants';

/**
 * Script untuk memigrasikan data partner dari constant ke Supabase
 * Run: npx ts-node src/scripts/seed-partners.ts
 */
async function seedPartners() {
  console.log('🚀 Starting Partner Seeding (Supabase)...');
  
  const supabase = await createScriptClient();
  console.log('📡 Connected to Supabase');

  for (const partner of PARTNERS_DATA) {
    console.log(`📦 Seeding: ${partner.name}`);
    
    const { error } = await supabase
      .from('partners')
      .upsert({
        id: partner.id,
        name: partner.name,
        owner: partner.owner,
        category: partner.category,
        url: partner.url,
        image_src: partner.imageSrc,
        status: 'Active',
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error(`❌ Error seeding ${partner.name}:`, error.message);
    }
  }

  console.log('✅ Seeding Partners Completed!');
  process.exit(0);
}

seedPartners().catch(err => {
  console.error('💥 Fatal Error:', err);
  process.exit(1);
});
