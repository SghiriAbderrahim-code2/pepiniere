import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load env from .env.local (never print values)
const env = {};
for (const raw of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const plants = [
  { slug: "monstera-deliciosa", name: "Monstera Deliciosa", price: 220, short_description: "نبتة استوائية بأوراق مقسّمة جميلة تضفي طابعاً عصرياً على منزلك.", description: "نبتة استوائية شهيرة بأوراقها الكبيرة المقسّمة، مثالية لركن قراءة أو صالة المعيشة.", main_image: null, visible: true, light_requirement: "إضاءة غير مباشرة ساطعة", water_requirement: "ري معتدل عند جفاف سطح التربة", care_instructions: "رش الأوراق أسبوعياً ونظّفها بقطعة قماش ناعمة.", suitable_location: "داخل المنزل، بعيداً عن الشمس المباشرة", temperature: "18-27°م", humidity: "متوسطة إلى مرتفعة" },
  { slug: "snake-plant", name: "Snake Plant", price: 160, short_description: "نبتة صبارية الشكل تتحمل الإهمال وتنقّي الهواء.", description: "من أسهل النباتات العناية، تتحمل الظل وتساهم في تنقية هواء الغرفة.", main_image: null, visible: true, light_requirement: "تحمل الظل والإضاءة المتوسطة", water_requirement: "قليل، اترك التربة تجف بين الريّات", care_instructions: "لا تفرط في الري لتجنب تعفن الجذور.", suitable_location: "داخل المنزل أو المكتب", temperature: "15-30°م", humidity: "منخفضة" },
  { slug: "peace-lily", name: "Peace Lily", price: 180, short_description: "نبتة مزهرة أنيقة بأوراق خضراء لامعة وأزهار بيضاء.", description: "تُزهر بأزهار بيضاء راقية وتتحمل الظروف الداخلية بسهولة.", main_image: null, visible: true, light_requirement: "ظل ساطع إلى إضاءة متوسطة", water_requirement: "معتدل، تحب التربة رطبة قليلاً", care_instructions: "اسقِها عند ذبول الأوراق ورشّها بانتظام.", suitable_location: "داخل المنزل", temperature: "18-26°م", humidity: "مرتفعة" },
  { slug: "aloe-vera", name: "Aloe Vera", price: 90, short_description: "نبتة عصارية مفيدة طبياً وسهلة العناية.", description: "عصارية معروفة بفوائدها، تتحمل الجفاف وتحب الإضاءة الساطعة.", main_image: null, visible: true, light_requirement: "شمس مباشرة إلى إضاءة ساطعة", water_requirement: "قليل، تجف التربة تماماً بين الريّات", care_instructions: "استخدم تربة جيدة التصريف ولا تفرط في الري.", suitable_location: "داخل المنزل قرب نافذة مشمسة", temperature: "20-30°م", humidity: "منخفضة" },
  { slug: "pothos", name: "Pothos", price: 110, short_description: "نبتة متسلّقة متحمّلة للظل ممتازة للمبتدئين.", description: "نبتة متسلّقة سريعة النمو تتحمل الإهمال وتناسب التعليق أو الرفوف.", main_image: null, visible: true, light_requirement: "إضاءة متوسطة إلى ظل", water_requirement: "معتدل", care_instructions: "اقتصها عند الجفاف ويسهل تكاثرها بالعقل.", suitable_location: "داخل المنزل، يمكن تعليقها", temperature: "18-29°م", humidity: "متوسطة" },
  { slug: "zz-plant", name: "ZZ Plant", price: 170, short_description: "نبتة صلبة تتحمل الإهمال وتنمو ببطء.", description: "من أكثر النباتات تحمّلاً، بأوراق لامعة وسيقان درنية تحفظ الماء.", main_image: null, visible: true, light_requirement: "ظل إلى إضاءة متوسطة", water_requirement: "قليل", care_instructions: "ري نادر وتربة جافة بين الريّات.", suitable_location: "داخل المنزل", temperature: "18-26°م", humidity: "منخفضة إلى متوسطة" },
  { slug: "spider-plant", name: "Spider Plant", price: 95, short_description: "نبتة سهلة بنباتات صغيرة متدلية جميلة.", description: "تُنتج نباتات صغيرة متدلية مثالية للتعليق وتتحمل ظروفاً متنوعة.", main_image: null, visible: true, light_requirement: "إضاءة متوسطة غير مباشرة", water_requirement: "معتدل", care_instructions: "تحب الماء الفاتر وتتحمل الظروف المختلفة.", suitable_location: "داخل المنزل المعلّقة", temperature: "18-27°م", humidity: "متوسطة" },
  { slug: "fiddle-leaf-fig", name: "Fiddle Leaf Fig", price: 320, short_description: "نبتة مميّزة بأوراق كبيرة تعطي طابعاً فخماً.", description: "نجم النباتات الداخلية بأوراقه الكبيرة الجلدية، يضيف أناقة للمساحات.", main_image: null, visible: true, light_requirement: "إضاءة ساطعة غير مباشرة", water_requirement: "معتدل، اترك التربة تجف قليلاً", care_instructions: "تجنّب نقلها المتكرر واروِها بانتظام.", suitable_location: "داخل المنزل قرب نافذة", temperature: "18-25°م", humidity: "متوسطة إلى مرتفعة" },
  { slug: "rubber-plant", name: "Rubber Plant", price: 240, short_description: "نبتة بأوراق كبيرة لامعة تضيف لوناً غنياً.", description: "بأوراق جلدية كبيرة بلون أخضر عميق، نبتة صلبة ومناسبة للأماكن الفسيحة.", main_image: null, visible: true, light_requirement: "إضاءة متوسطة إلى ساطعة", water_requirement: "معتدل", care_instructions: "امسح الأوراق بانتظام حفاظاً على لمعانها.", suitable_location: "داخل المنزل", temperature: "18-27°م", humidity: "متوسطة" },
  { slug: "areca-palm", name: "Areca Palm", price: 280, short_description: "نخيل داخلي يضيف لمسة استوائية وأجواء منعشة.", description: "نخيل كثيف يضيف طابعاً استوائياً ويحسّن رطوبة الغرفة.", main_image: null, visible: true, light_requirement: "إضاءة ساطعة غير مباشرة", water_requirement: "معتدل إلى كثير، تربة رطبة", care_instructions: "رشّها يومياً ورطّب التربة باستمرار.", suitable_location: "داخل المنزل الفسيح", temperature: "18-26°م", humidity: "مرتفعة" },
  { slug: "calathea", name: "Calathea", price: 200, short_description: "نبتة بأوراق مرسومة بنقوش جميلة تُغلق ليلاً.", description: "معروفة بنقوش أوراقها المذهلة وحركتها ليلاً، تناسب محبّي التفاصيل.", main_image: null, visible: true, light_requirement: "ظل ساطع", water_requirement: "معتدل، ماء غير معدني", care_instructions: "استخدم ماءً مقطّراً ورشّها بكثرة.", suitable_location: "داخل المنزل بعيداً عن الشمس", temperature: "18-25°م", humidity: "مرتفعة" },
  { slug: "orchid", name: "Orchid", price: 260, short_description: "زهرة أنيقة طويلة الأزهار تضيف فخامة.", description: "سحلية أنيقة بأزهار تدوم أسابيع، تضيف لمسة فاخرة لأي ركن.", main_image: null, visible: true, light_requirement: "إضاءة ساطعة غير مباشرة", water_requirement: "قليل إلى معتدل", care_instructions: "اروِها عند جفاف الجذور وتجنّب تجمّع الماء.", suitable_location: "داخل المنزل قرب نافذة", temperature: "18-25°م", humidity: "مرتفعة" },
  { slug: "cactus", name: "Cactus", price: 70, short_description: "نبات صحراوي شوكي يتحمل الجفاف طويلاً.", description: "مثالي للمبتدئين والمنازل المشمسة، يحتاج رياً نادراً جداً.", main_image: null, visible: true, light_requirement: "شمس مباشرة", water_requirement: "قليل جداً", care_instructions: "نادراً ما تروِه خاصة في الشتاء.", suitable_location: "داخل المنزل قرب نافذة مشمسة", temperature: "20-35°م", humidity: "منخفضة" },
  { slug: "jade-plant", name: "Jade Plant", price: 130, short_description: "نبتة عصارية بمظهر شجري يُقال إنها تجلب الحظ.", description: "عصارية بمظهر شجري صغير، سهلة العناية ومثالية للأصص.", main_image: null, visible: true, light_requirement: "شمس مباشرة إلى ساطعة", water_requirement: "قليل", care_instructions: "اترك التربة تجف تماماً بين الريّات.", suitable_location: "داخل المنزل", temperature: "18-28°م", humidity: "منخفضة" },
  { slug: "echeveria", name: "Echeveria", price: 85, short_description: "نبتة عصارية وردية الشكل مثالية للأصص الصغيرة.", description: "عصارية بأوراق متماثلة كالوردة، جميلة على النوافذ المشمسة.", main_image: null, visible: true, light_requirement: "شمس مباشرة", water_requirement: "قليل", care_instructions: "اروِها على التربة وليس على الأوراق.", suitable_location: "داخل المنزل على حافة نافذة", temperature: "18-28°م", humidity: "منخفضة" },
  { slug: "lavender", name: "Lavender", price: 120, short_description: "نبتة عطرية بأزهار أرجوانية تبعث رائحة هادئة.", description: "عشبة عطرية بأزهار أرجوانية تبعث هدوءاً وتصلح داخلاً وخارجاً.", main_image: null, visible: true, light_requirement: "شمس مباشرة", water_requirement: "معتدل، تفضّل الجفاف", care_instructions: "تحتاج تربة جيدة التصريف وهواءً جيداً.", suitable_location: "خارجي مشمس أو داخل بنافذة", temperature: "15-28°م", humidity: "منخفضة" },
  { slug: "rosemary", name: "Rosemary", price: 100, short_description: "عشبة عطرية مفيدة في المطبخ والزينة.", description: "عشبة خضراء دائمة تضيف رائحة مميزة وتُستخدم طازجة في الطبخ.", main_image: null, visible: true, light_requirement: "شمس مباشرة", water_requirement: "معتدل", care_instructions: "لا تفرط في الري واترك التربة تجف.", suitable_location: "خارجي أو داخل مشمس", temperature: "15-28°م", humidity: "منخفضة" },
  { slug: "basil", name: "Basil", price: 60, short_description: "عشبة طازجة ذات رائحة مميزة تُستخدم طهياً.", description: "عشبة سريعة النمو برائحة عطرية، ممتازة للمطبخ والنوافذ المشمسة.", main_image: null, visible: true, light_requirement: "شمس مباشرة إلى ساطعة", water_requirement: "معتدل إلى كثير", care_instructions: "حافظ على رطوبة التربة واقتطف الأوراق بانتظام.", suitable_location: "داخل المنزل قرب نافذة أو مطبخ", temperature: "18-30°م", humidity: "متوسطة" },
  { slug: "boston-fern", name: "Boston Fern", price: 140, short_description: "نبتة خضراء كثيفة تعطي طابعاً استوائياً منعشاً.", description: "سرخس كثيف بأوراق ريشية، يفضّل الظل والرطوبة العالية.", main_image: null, visible: true, light_requirement: "ظل ساطع", water_requirement: "كثير، تربة دائماً رطبة", care_instructions: "رشّها يومياً ولا تدع التربة تجف.", suitable_location: "داخل المنزل بعيداً عن الشمس", temperature: "18-25°م", humidity: "مرتفعة جداً" },
  { slug: "bird-of-paradise", name: "Bird of Paradise", price: 380, short_description: "نبتة استوائية كبيرة بأزهار مذهلة شبيهة بالطيور.", description: "نبتة استوائية كبيرة بأوراق ضخمة وأزهار مذهلة، تلفت الأنظار في أي مساحة.", main_image: null, visible: true, light_requirement: "إضاءة ساطعة، شمس صباحية", water_requirement: "معتدل", care_instructions: "اروِها بانتظام ووفّر إضاءة وافرة للإزهار.", suitable_location: "داخل المنزل الفسيح أو تراس", temperature: "18-27°م", humidity: "متوسطة إلى مرتفعة" },
];

const supabase = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Inserting ${plants.length} plants...`);

  // Upsert by slug so re-running is idempotent
  const { error } = await supabase
    .from("products")
    .upsert(plants, { onConflict: "slug" });

  if (error) {
    console.error("INSERT FAILED:", error.message);
    process.exit(1);
  }

  const { data, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("COUNT FAILED:", countError.message);
    process.exit(1);
  }

  console.log(`RESULT: total products in DB = ${data?.length ?? "?"} (exact count via header)`);
  const { count, error: cErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  if (cErr) {
    console.error("COUNT2 FAILED:", cErr.message);
    process.exit(1);
  }
  console.log(`VERIFIED total products = ${count}`);
}

main().catch((e) => {
  console.error("UNEXPECTED ERROR:", e instanceof Error ? e.message : e);
  process.exit(1);
});
