import React from "react";
import { notFound } from "next/navigation";
import PropertyDetails from "../../components/PropertyDetails";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const RentPropertyDetails = async ({ params }) => {
  const { id } = await params;
  const { data: property, error } = await supabase
    .from("properties")
    .select(`*, owner:users(full_name, phone, business_name)`)
    .eq("id", id)
    .single();
  if (error || !property) notFound();
  return <PropertyDetails property={property} listingType="rent" />;
};

export default RentPropertyDetails;
