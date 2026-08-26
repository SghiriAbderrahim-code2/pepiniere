import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const env = {};
for (const raw of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  env[key] = val;
}
const url = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const supabase = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await supabase
  .from("products")
  .select("slug, name, price, visible")
  .order("slug");

if (error) { console.error(error.message); process.exit(1); }
const visible = data.filter((p) => p.visible).length;
console.log(`TOTAL=${data.length}  VISIBLE=${visible}  HIDDEN=${data.length - visible}`);
console.log("--- slugs ---");
for (const p of data) console.log(`${p.visible ? "v" : "h"}  ${p.slug}  (${p.price} DH)`);
