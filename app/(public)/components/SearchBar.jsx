"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BsBuildings } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { MdBed } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiSearch, FiChevronDown, FiX, FiUsers } from "react-icons/fi";

// ─── Options (values match what is stored in your database) ──────────────────
// property_type is free text in the DB, so these are matched with ILIKE.
// "Duplex" also finds Detached and Semi-Detached Duplex, "Shop" finds Retail Shop, etc.
const PROPERTY_TYPES = [
  { value: "", label: "Any type" },
  { value: "Apartment", label: "Apartment / Flat" },
  { value: "Mini Flat", label: "Mini flat" },
  { value: "Duplex", label: "Duplex" },
  { value: "Terrace", label: "Terrace" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Mansion", label: "Mansion" },
  { value: "Villa", label: "Villa" },
  { value: "Office", label: "Office space" },
  { value: "Shop", label: "Retail / Shop" },
  { value: "Commercial Building", label: "Commercial building" },
];

const BEDS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+ bedrooms" },
  { value: "2", label: "2+ bedrooms" },
  { value: "3", label: "3+ bedrooms" },
  { value: "4", label: "4+ bedrooms" },
  { value: "5", label: "5+ bedrooms" },
];

const GUESTS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+ guests" },
  { value: "2", label: "2+ guests" },
  { value: "4", label: "4+ guests" },
  { value: "6", label: "6+ guests" },
  { value: "10", label: "10+ guests" },
];

// Each listing type stores a different price, so the ranges change with the tab.
// value format is "min-max" (either side can be empty).
const PRICE_RANGES = {
  buy: [
    { value: "-", label: "Any price" },
    { value: "-50000000", label: "Under ₦50M" },
    { value: "50000000-150000000", label: "₦50M – ₦150M" },
    { value: "150000000-500000000", label: "₦150M – ₦500M" },
    { value: "500000000-", label: "₦500M+" },
  ],
  rent: [
    { value: "-", label: "Any price" },
    { value: "-2000000", label: "Under ₦2M / year" },
    { value: "2000000-5000000", label: "₦2M – ₦5M / year" },
    { value: "5000000-15000000", label: "₦5M – ₦15M / year" },
    { value: "15000000-", label: "₦15M+ / year" },
  ],
  shortlet: [
    { value: "-", label: "Any price" },
    { value: "-75000", label: "Under ₦75k / night" },
    { value: "75000-150000", label: "₦75k – ₦150k / night" },
    { value: "150000-300000", label: "₦150k – ₦300k / night" },
    { value: "300000-", label: "₦300k+ / night" },
  ],
};

// ─── Dropdown (closes on outside click and Escape) ───────────────────────────
function Dropdown({ icon: Icon, label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const isDefault = selected === options[0];

  return (
    <div ref={ref} className="relative flex-1 min-w-[160px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-3 rounded-xl hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
      >
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="mt-1 flex items-center gap-2 text-sm">
          <Icon className="text-gray-400 shrink-0" />
          <span
            className={`flex-1 truncate ${isDefault ? "text-gray-500" : "text-gray-900 font-medium"}`}
          >
            {selected.label}
          </span>
          <FiChevronDown
            className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value || "any"} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                    active
                      ? "text-primary font-medium bg-primary/5"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
/**
 * One bar for the Buy, Rent and Shortlet pages.
 * @param {"buy"|"rent"|"shortlet"} listingType  Decides which price ranges show.
 *        The bar searches the page it is placed on, so no route needs passing.
 * @param {boolean} onDark  Set true when the bar sits on a dark hero, so the
 *        "Clear filters" link stays readable.
 */
export default function SearchBar({ listingType = "buy", onDark = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(params.get("q") || "");
  const [propertyType, setPropertyType] = useState(params.get("ptype") || "");
  const [beds, setBeds] = useState(params.get("beds") || "");
  const [guests, setGuests] = useState(params.get("guests") || "");
  const isShortlet = listingType === "shortlet";
  const [price, setPrice] = useState(
    `${params.get("minPrice") || ""}-${params.get("maxPrice") || ""}`,
  );

  const priceOptions = PRICE_RANGES[listingType] ?? PRICE_RANGES.buy;

  const hasFilters = q || propertyType || beds || guests || price !== "-";

  const clearAll = () => {
    setQ("");
    setPropertyType("");
    setBeds("");
    setGuests("");
    setPrice("-");
    startTransition(() => router.push(pathname)); // show all results again
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    const [min, max] = price.split("-");

    if (q.trim()) next.set("q", q.trim());
    if (propertyType) next.set("ptype", propertyType);
    if (beds && !isShortlet) next.set("beds", beds);
    if (guests && isShortlet) next.set("guests", guests);
    if (min) next.set("minPrice", min);
    if (max) next.set("maxPrice", max);

    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-8xl mx-auto w-full">
      {/* Fields */}
      <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col lg:flex-row lg:items-stretch gap-1 lg:gap-0 lg:divide-x divide-gray-100">
        {/* Location */}
        <label className="flex-[1.4] min-w-[200px] px-5 py-3 rounded-xl hover:bg-gray-50 focus-within:bg-gray-50 cursor-text transition-colors">
          <span className="block text-xs text-gray-500">Location</span>
          <span className="mt-1 flex items-center gap-2 text-sm">
            <SlLocationPin className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="City, area or keyword"
              className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear location"
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </span>
        </label>

        {isShortlet ? (
          <Dropdown
            icon={FiUsers}
            label="Guests"
            value={guests}
            options={GUESTS}
            onChange={setGuests}
          />
        ) : (
          <>
            <Dropdown
              icon={BsBuildings}
              label="Property type"
              value={propertyType}
              options={PROPERTY_TYPES}
              onChange={setPropertyType}
            />
            <Dropdown
              icon={MdBed}
              label="Bedrooms"
              value={beds}
              options={BEDS}
              onChange={setBeds}
            />
          </>
        )}

        <Dropdown
          icon={BiMoney}
          label="Price"
          value={price}
          options={priceOptions}
          onChange={setPrice}
        />

        {/* Submit */}
        <div className="flex items-center p-1 lg:pl-3">
          <button
            type="submit"
            disabled={pending}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-accent text-white rounded-full px-6 py-4 lg:p-4 font-medium transition-colors disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {pending ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSearch className="text-xl" />
            )}
            <span className="lg:sr-only">
              {pending ? "Searching" : "Search"}
            </span>
          </button>
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className={`mt-3 text-sm underline underline-offset-4 ${
            onDark
              ? "text-white/80 hover:text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
