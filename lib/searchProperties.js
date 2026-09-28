import { supabase } from "./supabase";

// List views only need these columns (skips description, house_rules, etc.)
const LIST_COLUMNS =
  "id,title,location,state,listing_type,status,property_category,property_type," +
  "beds,baths,square_meters,pricing,images,date_listed,is_available,owner_id";

const SEARCH_FIELDS = ["title", "location", "state", "property_type"];

// Strip characters that would break PostgREST's or() / ilike syntax
const clean = (s = "") => String(s).replace(/[%,()*\\]/g, " ").trim();

const num = (v) => {
  const n = Number(v);
  return v !== "" && v != null && Number.isFinite(n) ? n : null;
};

/**
 * Reads the params written by <SearchBar /> and returns matching properties.
 * Call it from a server component with the page's searchParams.
 */
export async function searchProperties({
  q = "",
  listingType, // 'buy' | 'rent' | 'shortlet'
  category, // 'Residential' | 'Commercial' | 'Luxury' ('' or undefined = all)
  propertyType, // matched loosely, e.g. "Duplex" finds "Detached Duplex"
  propertyTypeExact, // exact (case-insensitive) match, for type tabs
  minBeds,
  minGuests, // shortlets: max_guests >= n
  minPrice,
  maxPrice,
  ownerId, // scope to one owner (owner dashboard)
  availableOnly = false, // only is_available = true
  sort = "latest", // 'latest' | 'price-low' | 'price-high'
  columns = "*", // pass LIST_COLUMNS-style string later to slim down list queries
  page = 1,
  pageSize = 12,
} = {}) {
  let query = supabase.from("properties").select(columns, { count: "exact" });

  if (availableOnly) query = query.eq("is_available", true);

  if (sort === "price-low") {
    query = query.order("price_value", { ascending: true, nullsFirst: false });
  } else if (sort === "price-high") {
    query = query.order("price_value", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("date_listed", { ascending: false });
  }
  query = query.order("created_at", { ascending: false }); // stable tie-break

  if (["buy", "rent", "shortlet"].includes(listingType)) {
    query = query.eq("listing_type", listingType);
  }
  if (category) query = query.eq("property_category", category);
  if (ownerId) query = query.eq("owner_id", ownerId);

  const ptype = clean(propertyType);
  if (ptype) query = query.ilike("property_type", `%${ptype}%`);

  const exact = clean(propertyTypeExact);
  if (exact) query = query.ilike("property_type", exact);

  const guests = num(minGuests);
  if (guests !== null) query = query.gte("max_guests", guests);

  const beds = num(minBeds);
  if (beds !== null) query = query.gte("beds", beds);

  // price_value is a generated column (see add-price-value.sql)
  const min = num(minPrice);
  const max = num(maxPrice);
  if (min !== null) query = query.gte("price_value", min);
  if (max !== null) query = query.lte("price_value", max);

  // Every word must match at least one field: "lekki duplex" = lekki AND duplex
  clean(q)
    .split(/\s+/)
    .filter(Boolean)
    .forEach((term) => {
      query = query.or(SEARCH_FIELDS.map((f) => `${f}.ilike.%${term}%`).join(","));
    });

  const safePage = Math.max(1, Number(page) || 1);
  const from = (safePage - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    // Supabase errors print as {} in the browser console, so surface the details
    throw new Error(
      [error.message, error.details, error.hint, error.code && `(code ${error.code})`]
        .filter(Boolean)
        .join(" | "),
    );
  }
  return { properties: data ?? [], total: count ?? 0, page: safePage, pageSize };
}