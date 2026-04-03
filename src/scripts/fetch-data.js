require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

async function fetchData() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase credentials not found in .env");
    process.exit(1);
  }

  console.log("📡 Connecting to Supabase:", supabaseUrl);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Connected successfully");

    console.log("\n🛡️ ROLES:");
    const { data: roles, error: roleError } = await supabase
      .from("roles")
      .select("*")
      .order("id");

    if (roleError) throw roleError;

    if (!roles || roles.length === 0) {
      console.log("   (Empty)");
    } else {
      roles.forEach((r) => {
        console.log(
          `   - [${r.id}] ${r.name}: ${r.permissions?.length || 0} perms`,
        );
      });
    }

    console.log("\n🔑 PERMISSIONS:");
    const { data: perms, error: permError } = await supabase
      .from("permissions")
      .select("*")
      .order("module");

    if (permError) throw permError;

    if (!perms || perms.length === 0) {
      console.log("   (Empty)");
    } else {
      // Group by module
      const grouped = perms.reduce((acc, p) => {
        const mod = p.module || "Other";
        if (!acc[mod]) acc[mod] = [];
        acc[mod].push(p);
        return acc;
      }, {});

      Object.keys(grouped).forEach((mod) => {
        console.log(`   📦 ${mod}:`);
        grouped[mod].forEach((p) => {
          console.log(`      • ${p.id}: ${p.name}`);
        });
      });
    }

    console.log("\n👋 Fetching Completed");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fetchData();
