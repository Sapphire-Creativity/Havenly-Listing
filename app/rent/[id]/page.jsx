import React from "react";
import PropertyDetails from "../../components/PropertyDetails";
import { getPropertyById } from "../../../public/assets/data";
import { notFound } from "next/navigation";

//
const RentPropertyDetails = async ({ params }) => {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();
  return <PropertyDetails property={property} listingType="rent" />;
};

export default RentPropertyDetails;
