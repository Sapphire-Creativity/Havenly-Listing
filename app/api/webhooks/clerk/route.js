import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  console.log("🔥 Webhook received!");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.log("❌ Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  console.log("✅ Event type:", evt.type);

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

    const { data, error } = await supabase.from("users").insert({
      id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      role: unsafe_metadata?.role,
      phone: unsafe_metadata?.phone,               // ✅ new
      business_name: unsafe_metadata?.businessName, // ✅ new
    });

    console.log("Insert data:", data);
    console.log("Insert error:", error);
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

    const { error } = await supabase.from("users").update({
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      role: unsafe_metadata?.role,
      phone: unsafe_metadata?.phone,               // ✅ new
      business_name: unsafe_metadata?.businessName, // ✅ new
    }).eq("id", id);

    console.log("Update error:", error);
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    await supabase.from("users").delete().eq("id", id);
    console.log("🗑️ User deleted:", id);
  }

  return new Response("OK", { status: 200 });
}