import React from "react";
import PropertyDetails from "../../components/PropertyDetails";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Use service role for server-side fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const BuyPropertyDetails = async ({ params }) => {
  const { id } = await params;

  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      owner:users(full_name, phone, business_name)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !property) notFound();

  return <PropertyDetails property={property} listingType="buy" />;
};

export default BuyPropertyDetails;
