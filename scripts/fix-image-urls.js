import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  
);

async function main() {
  const { data: properties, error } = await supabase
    .from("properties")  
    .select("id, images");

  if (error) {
    console.error("❌ Failed to fetch properties:", error.message);
    process.exit(1);
  }

  let fixed = 0;

  for (const property of properties) {
    const cleanedImages = property.images.map((url) =>
      url.replace(/^["']+|["']+$/g, "").trim()
    );

    const isDirty = cleanedImages.some((url, i) => url !== property.images[i]);

    if (isDirty) {
      const { error: updateError } = await supabase
        .from("properties") // 👈 same table name here
        .update({ images: cleanedImages })
        .eq("id", property.id);

      if (updateError) {
        console.error(`❌ Failed to update ${property.id}:`, updateError.message);
      } else {
        fixed++;
      }
    }
  }

  console.log(`✅ Cleaned ${fixed} out of ${properties.length} properties`);
}

main().catch(console.error);