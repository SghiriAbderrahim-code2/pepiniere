import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load env from .env.local (never print values)
const envPath = join(root, ".env.local");
const env = {};
for (const raw of readFileSync(envPath, "utf8").split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const url = (env.NEXT_PUBLIC_SUPABASE_URL || "")
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/+$/, "");
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

console.log("Supabase URL:", url);

const ADMIN_ID = "900774f6-db24-4097-8e11-28c75481848a";

const supabase = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Upserting admin profile...");
  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert({ id: ADMIN_ID, role: "admin" }, { onConflict: "id" });

  if (upsertError) {
    console.error("UPSERT FAILED:", upsertError.message);
    process.exit(1);
  }

  const { data, error: selectError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", ADMIN_ID)
    .single();

  if (selectError) {
    console.error("SELECT FAILED:", selectError.message);
    process.exit(1);
  }

  console.log("RESULT:", JSON.stringify(data));
  console.log(
    data && data.role === "admin"
      ? "VERIFIED: role = admin ✅"
      : "WARNING: role is not 'admin'",
  );
}

main().catch((e) => {
  console.error("UNEXPECTED ERROR:", e instanceof Error ? e.message : e);
  process.exit(1);
});
