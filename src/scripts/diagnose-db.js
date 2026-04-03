require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

async function diagnose() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase credentials missing!");
    process.exit(1);
  }

  try {
    console.log("📡 Connecting to Supabase:", supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Connected");

    const tables = ['users', 'roles', 'permissions', 'partners', 'reports'];
    console.log("📦 Checking Tables...");

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: Found ${count} records`);
      }
    }

    const { data: roles, error: roleError } = await supabase
      .from("roles")
      .select("id, name");

    if (roleError) throw roleError;
    
    console.log(
      "📝 Roles summary:",
      JSON.stringify(roles, null, 2)
    );

    console.log("\n👋 Diagnostic Completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

diagnose();
