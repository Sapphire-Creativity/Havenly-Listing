import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/* ------------------------------------------------------------------
   SETTINGS
------------------------------------------------------------------- */
const TABLE = "properties";
const HOW_MANY = 12; // pins on the map
const PER_STATE = 2; // at most this many per state, so pins spread out
const CANDIDATES = 80; // newest listings to choose from
const CACHE_SECONDS = 3600; // refresh the map data once an hour
const ONLY_AVAILABLE = true; // skip listings where is_available is false

// Left side = the field name the map component expects (do not change).
// Right side = your column name in the `properties` table.
const COL = {
  id: "id",
  title: "title",
  listingType: "listing_type", // rent | shortlet | buy
  status: "status",
  propertyType: "property_type",
  location: "location",
  state: "state",
  beds: "beds",
  baths: "baths",
  squareMeters: "square_meters",
  price: "price_value", // the main price of the listing
  images: "images",
  available: "is_available",
  featured: null, // e.g. "is_featured": featured listings get picked first
  createdAt: "created_at", // used to prefer the newest listings
};

/* ------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } },
  );

const num = (v) =>
  v === null || v === undefined || v === "" ? undefined : Number(v);

// Photos might be stored as a text[] column, a JSON column, or one URL
function toImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return [value];
  }
  return [];
}

// Reads "rent" / "For Rent" / "shortlet" / "buy" / "For Sale" and returns one of three
function kindOf(...values) {
  for (const v of values) {
    const s = String(v ?? "").toLowerCase();
    if (s.includes("short")) return "shortlet";
    if (s.includes("rent")) return "rent";
    if (s.includes("sale") || s.includes("buy")) return "buy";
  }
  return null;
}

const LABEL = { shortlet: "Shortlet", rent: "For Rent", buy: "For Sale" };

// Database row -> the shape the map component uses
function toProperty(row) {
  const get = (field) => (COL[field] ? row[COL[field]] : undefined);
  const kind = kindOf(get("listingType"), get("status"));
  const price = num(get("price"));

  return {
    id: get("id"),
    propertyTitle: get("title"),
    status: kind ? LABEL[kind] : get("status"),
    listingType: kind ?? get("listingType"),
    propertyType: get("propertyType"),
    location: get("location"),
    state: get("state"),
    beds: num(get("beds")),
    baths: num(get("baths")),
    squareMeters: num(get("squareMeters")),
    // One price column: read it as per night, per year or a sale price
    nightlyRate: kind === "shortlet" ? price : undefined,
    annualRent: kind === "rent" ? price : undefined,
    price: kind === "shortlet" || kind === "rent" ? undefined : price,
    propertyImages: toImages(get("images")),
  };
}

const clean = (v) =>
  String(v ?? "")
    .replace(/\s*state\s*$/i, "")
    .trim()
    .toLowerCase();

// Which state a listing belongs to (listings with no state can't be pinned)
function stateKey(p) {
  const k = clean(p.state);
  if (["abuja", "fct", "federal capital territory"].includes(k)) return "fct";
  return k;
}

// From one state's listings, take up to `n`, preferring different statuses
function pickFromGroup(items, n) {
  const chosen = [];
  const seen = new Set();
  for (const it of items) {
    if (chosen.length < n && !seen.has(it.status)) {
      chosen.push(it);
      seen.add(it.status);
    }
  }
  for (const it of items) {
    if (chosen.length < n && !chosen.includes(it)) chosen.push(it);
  }
  return chosen;
}

// Choose a few listings spread across different states
function pickSpread(list, max, perState) {
  const groups = new Map();
  for (const p of list) {
    const key = stateKey(p);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  const lists = [...groups.values()].map((g) => pickFromGroup(g, perState));
  const out = [];
  for (let round = 0; round < perState; round++) {
    for (const l of lists) {
      if (l[round] && out.length < max) out.push(l[round]);
    }
  }
  return out;
}

/* ------------------------------------------------------------------
   FETCH
------------------------------------------------------------------- */
// Treats a missing is_available value as "available"
const onlyAvailable = (query) =>
  ONLY_AVAILABLE && COL.available
    ? query.or(`${COL.available}.is.null,${COL.available}.eq.true`)
    : query;

async function fetchMapProperties() {
  const client = supabase();
  const columns = [...new Set(Object.values(COL).filter(Boolean))].join(",");

  let query = onlyAvailable(client.from(TABLE).select(columns));
  if (COL.featured) query = query.order(COL.featured, { ascending: false });
  query = query
    .order(COL.createdAt ?? COL.id, { ascending: false })
    .limit(CANDIDATES);

  const [rows, count] = await Promise.all([
    query,
    onlyAvailable(
      client.from(TABLE).select(COL.id, { count: "exact", head: true }),
    ),
  ]);
  if (rows.error) throw rows.error;

  const picked = pickSpread(rows.data.map(toProperty), HOW_MANY, PER_STATE);
  return { properties: picked, total: count.count ?? picked.length };
}

const cached = unstable_cache(fetchMapProperties, ["map-properties"], {
  revalidate: CACHE_SECONDS,
  tags: ["map-properties"],
});

// If Supabase is down, the map section is simply hidden instead of crashing the page
export async function getMapProperties() {
  try {
    return await cached();
  } catch (error) {
    console.error("[map] Could not load properties:", error?.message ?? error);
    return { properties: [], total: 0 };
  }
}
