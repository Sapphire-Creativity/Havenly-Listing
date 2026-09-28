"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";

/* ------------------------------------------------------------------
   MAP DATA
   The outline is a simplified Nigeria border drawn in an 800 x 640
   box. STATE_XY holds each state's position in that same box
   (state capitals). Pins are placed by state, so they show the
   general area of a listing, not its exact address.
------------------------------------------------------------------- */
const MAP_W = 800;
const MAP_H = 640;

const NIGERIA_PATH =
  "M129 180L133 176L130 172L130 168L132 164L131 158L132 148L132 135L147 122L155 109L158 82L164 81L172 73L178 70L197 66L200 68L216 68L220 66L224 61L232 60L265 73L270 71L277 74L293 91L299 101L307 109L315 109L322 102L332 102L355 89L370 92L378 97L386 104L393 105L400 113L415 117L449 119L452 118L467 100L478 95L507 88L548 88L570 95L581 102L584 103L589 101L593 104L603 105L605 101L607 100L608 95L611 91L614 93L619 87L621 88L620 86L624 83L623 82L628 81L634 78L638 80L639 78L639 80L643 78L649 69L664 70L688 104L694 133L694 142L696 143L711 145L717 153L720 153L717 161L718 168L714 179L718 184L717 189L693 205L684 202L672 216L671 221L660 238L654 263L650 266L644 267L644 269L644 273L642 278L645 283L642 297L630 300L623 305L626 312L622 321L621 335L619 339L616 339L613 344L608 347L597 347L599 353L596 357L592 357L590 359L591 369L588 374L588 381L579 395L579 403L564 420L572 428L568 430L564 434L561 434L554 440L553 443L555 446L553 453L547 457L544 463L538 464L530 463L526 448L520 445L515 437L504 431L502 427L498 440L482 440L479 433L464 445L460 445L455 459L450 460L447 464L442 466L440 469L436 471L432 477L417 491L417 493L414 493L410 496L410 501L408 503L413 509L409 515L407 533L405 534L397 547L397 550L394 552L393 557L389 556L390 554L386 555L387 549L385 552L383 552L374 541L379 548L378 550L383 560L380 565L367 565L351 566L350 567L351 568L348 568L341 566L339 560L340 556L338 564L334 565L326 562L325 565L329 566L326 568L321 562L321 559L318 559L315 554L314 556L316 559L319 560L320 564L319 565L321 567L317 570L315 568L315 571L313 571L311 564L312 560L313 560L311 556L310 557L309 555L310 562L308 562L306 558L307 564L310 564L310 569L312 573L309 575L304 573L301 566L303 561L300 560L299 555L300 551L296 550L299 559L302 562L300 565L302 574L304 575L299 576L296 576L295 568L297 562L295 566L295 572L294 566L292 567L294 577L290 577L289 569L287 568L289 571L288 577L280 576L280 577L272 579L271 577L272 575L275 571L272 573L270 568L271 573L268 571L270 575L268 579L269 579L263 580L262 578L262 573L260 573L261 579L257 577L257 572L256 574L255 573L255 577L252 575L250 573L250 571L249 572L236 561L235 555L229 549L231 550L231 549L225 534L227 534L229 536L228 533L231 533L228 531L228 532L224 532L222 523L228 521L229 523L232 520L235 521L233 517L233 515L236 514L238 512L232 514L230 519L227 518L227 520L218 518L215 514L214 511L216 510L225 511L228 507L231 510L228 506L224 509L222 509L222 502L219 508L214 510L211 507L209 503L209 499L210 498L212 499L212 497L219 494L220 492L207 500L198 487L191 480L180 472L172 468L144 464L120 465L118 463L120 463L121 465L123 463L126 463L128 460L136 459L138 456L142 455L139 454L125 459L123 458L123 455L119 458L117 463L118 466L82 468L83 453L86 450L85 447L83 446L82 435L86 431L83 429L85 425L84 412L86 411L86 408L82 402L83 391L80 385L83 370L81 362L84 353L83 338L84 337L85 323L94 322L96 323L101 321L106 310L105 301L111 294L111 292L115 291L115 283L122 280L125 280L129 274L130 269L133 264L128 256L132 248L138 250L140 249L142 239L142 235L139 233L136 228L138 223L136 211L133 210L122 195L124 187ZM340 569L342 569L341 570L335 571L329 570L332 568L336 569ZM326 568L329 568L327 572L321 574L318 573L323 566Z";

const STATE_XY = {
  Abia: [337.1, 512.9],
  Adamawa: [604.3, 314.9],
  "Akwa Ibom": [359.6, 539],
  Anambra: [314.7, 476.1],
  Bauchi: [462.7, 254.9],
  Bayelsa: [271.6, 545.1],
  Benue: [392.1, 394.2],
  Borno: [639.2, 172.1],
  "Cross River": [381.5, 543.6],
  Delta: [268.2, 493.3],
  Ebonyi: [370.4, 470],
  Edo: [236.4, 469.4],
  Ekiti: [216, 400.3],
  Enugu: [340.1, 462.8],
  FCT: [332.2, 321.8],
  Gombe: [533.4, 256.1],
  Imo: [312.7, 515.1],
  Jigawa: [435.8, 176.1],
  Kaduna: [333.2, 244.1],
  Kano: [395.9, 162.9],
  Katsina: [343, 108.8],
  Kebbi: [161.3, 138.2],
  Kogi: [296.7, 390.5],
  Kwara: [179.7, 353.1],
  Lagos: [117.6, 459.3],
  Nasarawa: [391.8, 353.4],
  Niger: [287.3, 292.7],
  Ogun: [116.1, 425.1],
  Ondo: [215.1, 419.9],
  Osun: [179.7, 391.6],
  Oyo: [148, 413.4],
  Plateau: [410.1, 277.4],
  Rivers: [313.6, 550.9],
  Sokoto: [217.4, 108],
  Taraba: [543.6, 331.6],
  Yobe: [575.7, 176.8],
  Zamfara: [293, 153.7],
};

const CITY_LABELS = [
  { name: "Lagos", state: "Lagos" },
  { name: "Abuja", state: "FCT" },
  { name: "Port Harcourt", state: "Rivers" },
  { name: "Kano", state: "Kano" },
];

/* ------------------------------------------------------------------
   SETTINGS
------------------------------------------------------------------- */
const MAX_PINS = 12; // safety cap on pins drawn (the server already sends only a few)
const MAX_PER_STATE = 2; // stops pins stacking on top of each other
const OFFSETS = [
  [0, 0],
  [16, 10],
]; // nudge for a second pin in the same state (map units)

const PIN_H = 40; // pin height in px
const PIN_START = 900; // ms before the first pin drops
const PIN_STEP = 80; // ms between pins
const PANEL = "#12362a"; // deep forest panel colour

const STATUS = {
  "For Rent": { label: "For rent", color: "#f4c58a" },
  Shortlet: { label: "Shortlet", color: "#7cc4ff" },
  "For Sale": { label: "For sale", color: "#86efac" },
};
const statusOf = (s) =>
  STATUS[s] ?? { label: s || "Listing", color: "#ffffff" };

/* ------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */
const STATE_NAMES = Object.keys(STATE_XY);

// Works out which state a property belongs to
function resolveState(p) {
  const candidates = [
    p.state,
    ...(p.location ? String(p.location).split(",") : []),
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const k = String(raw)
      .replace(/\s*state\s*$/i, "")
      .trim()
      .toLowerCase();
    if (!k) continue;
    if (["fct", "abuja", "federal capital territory"].includes(k)) return "FCT";
    const hit = STATE_NAMES.find((n) => n.toLowerCase() === k);
    if (hit) return hit;
  }
  return null;
}

function buildPins(properties) {
  const perState = {};
  const pins = [];
  for (const property of properties) {
    const state = resolveState(property);
    if (!state) continue;
    const n = perState[state] ?? 0;
    if (n >= MAX_PER_STATE) continue;
    perState[state] = n + 1;

    const [x, y] = STATE_XY[state];
    const [dx, dy] = OFFSETS[n] ?? [0, 0];
    pins.push({
      id: `${property.id}-${pins.length}`,
      property,
      xPct: ((x + dx) / MAP_W) * 100,
      yPct: ((y + dy) / MAP_H) * 100,
    });
    if (pins.length >= MAX_PINS) break;
  }
  return pins;
}

const naira = (n) => `₦${Number(n).toLocaleString()}`;

function formatPrice(p) {
  if (p.status === "Shortlet" && p.nightlyRate)
    return { value: naira(p.nightlyRate), unit: "/night" };
  if (p.status === "For Rent" && p.annualRent)
    return { value: naira(p.annualRent), unit: "/year" };
  const sale = p.salePrice ?? p.price;
  if (sale) return { value: naira(sale), unit: "" };
  return { value: "Price on request", unit: "" };
}

function detailsHref(p) {
  const route =
    p.listingType === "shortlet"
      ? "shortlet"
      : p.listingType === "buy"
        ? "buy"
        : "rent";
  return `/${route}/${p.id}`;
}

// Keeps the popup inside the map and points its tip at the pin
function placeTooltip(xPct, yPct, mapW) {
  const tw = Math.min(264, Math.max(200, mapW - 16));
  const pinX = (xPct / 100) * mapW;
  const left = Math.min(Math.max(pinX - tw / 2, 0), Math.max(mapW - tw, 0));
  return {
    tw,
    left: left - pinX, // relative to the pin
    tipX: Math.min(Math.max(pinX - left, 20), tw - 20),
    below: yPct < 34, // pins near the top get their popup underneath
  };
}

/* ------------------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------------------- */
function PinIcon({ color }) {
  return (
    <svg
      width="30"
      height="40"
      viewBox="0 0 30 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 39C15 39 2 25.5 2 15a13 13 0 0 1 26 0C28 25.5 15 39 15 39Z"
        fill={color}
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="15" r="4.5" fill={PANEL} />
    </svg>
  );
}

function PropertyTooltip({ property: p, status, tw, left, tipX, below }) {
  const price = formatPrice(p);
  const image = p.propertyImages?.[0];
  const meta = [
    p.beds > 0 ? `${p.beds} ${p.beds === 1 ? "bed" : "beds"}` : null,
    p.baths > 0 ? `${p.baths} ${p.baths === 1 ? "bath" : "baths"}` : null,
    p.squareMeters ? `${p.squareMeters} m²` : null,
  ].filter(Boolean);

  return (
    // The padding is an invisible bridge so the popup stays open
    // while the mouse travels from the pin to the card.
    <div
      className={`absolute ${below ? "pt-3" : "pb-3"}`}
      style={{ width: tw, left, ...(below ? { top: 0 } : { bottom: PIN_H }) }}
    >
      <div
        className="transition-[opacity,translate,scale] duration-300 ease-out starting:translate-y-1 starting:scale-95 starting:opacity-0 motion-reduce:transition-none"
        style={{ transformOrigin: `${tipX}px ${below ? "top" : "bottom"}` }}
      >
        <div className="relative">
          <Link
            href={detailsHref(p)}
            className="group/card block overflow-hidden rounded-2xl bg-white text-foreground shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {image && (
              <div className="relative h-32 w-full bg-border">
                <Image
                  src={image}
                  alt={p.propertyTitle}
                  fill
                  sizes="264px"
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: status.color,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                    }}
                  />
                  {status.label}
                </span>
              </div>
            )}

            <div className="p-3.5">
              <h4 className="line-clamp-1 font-heading text-[15px] font-bold leading-snug">
                {p.propertyTitle}
              </h4>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <FiMapPin size={12} className="shrink-0" />
                <span className="line-clamp-1">
                  {[p.location, p.state].filter(Boolean).join(", ")}
                </span>
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-base font-bold text-primary">
                  {price.value}
                  <span className="text-xs font-medium text-muted">
                    {price.unit}
                  </span>
                </p>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover/card:bg-primary-dark">
                  <FiArrowUpRight size={16} />
                </span>
              </div>

              {meta.length > 0 && (
                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted">
                  {meta.map((m, i) => (
                    <Fragment key={m}>
                      {i > 0 && <span className="h-3 w-px bg-border" />}
                      <span>{m}</span>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* The sharp pointer */}
          <span
            aria-hidden="true"
            className={`absolute h-2.5 w-5 -translate-x-1/2 bg-white ${
              below
                ? "bottom-full [clip-path:polygon(50%_0,0_100%,100%_100%)]"
                : "top-full [clip-path:polygon(0_0,100%_0,50%_100%)]"
            }`}
            style={{ left: tipX }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   MAIN SECTION
------------------------------------------------------------------- */
export default function PropertyMap({ properties = [], total = 0 }) {
  const panelRef = useRef(null);
  const mapRef = useRef(null);

  const [visible, setVisible] = useState(false); // scrolled into view
  const [settled, setSettled] = useState(false); // intro animation finished
  const [mapW, setMapW] = useState(0);
  const [filter, setFilter] = useState("All");
  const [activeId, setActiveId] = useState(null);

  const pins = useMemo(() => buildPins(properties), [properties]);

  // Filter buttons: only statuses that actually have pins
  const filters = useMemo(() => {
    const counts = {};
    pins.forEach((p) => {
      const s = p.property.status;
      counts[s] = (counts[s] ?? 0) + 1;
    });
    const known = Object.keys(STATUS).filter((s) => counts[s]);
    const other = Object.keys(counts).filter((s) => !STATUS[s]);
    return [
      {
        key: "All",
        label: "All listings",
        count: pins.length,
        color: "#ffffff",
      },
      ...[...known, ...other].map((s) => ({
        key: s,
        label: statusOf(s).label,
        count: counts[s],
        color: statusOf(s).color,
      })),
    ];
  }, [pins]);

  // Play the intro once, when the panel scrolls into view
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // After the intro, remove the stagger so filtering feels instant
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(
      () => setSettled(true),
      PIN_START + pins.length * PIN_STEP + 900,
    );
    return () => clearTimeout(t);
  }, [visible, pins.length]);

  // Track the map width so popups can stay inside it
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setMapW(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close the popup: tap outside a pin, or press Escape
  useEffect(() => {
    const onDown = (e) => {
      if (!e.target.closest?.("[data-pin]")) setActiveId(null);
    };
    const onKey = (e) => e.key === "Escape" && setActiveId(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (pins.length === 0) return null;

  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div
          ref={panelRef}
          className="relative isolate rounded-[2rem] p-6 sm:p-10 lg:p-12"
          style={{ backgroundColor: PANEL }}
        >
          {/* Backdrop: faint dot grid + one soft glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]"
          >
            <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
            <div className="absolute -right-24 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-primary/40 blur-3xl" />
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
            {/* ---------- Left: copy + filters ---------- */}
            <div>
              <h2 className="text-3xl leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                Find your next place on the map
              </h2>
              <p className="mt-4 max-w-md text-base text-white/70">
                Every pin is a live listing. Hover or tap a pin to preview it,
                then open the full details.
              </p>

              <div
                role="group"
                aria-label="Filter by listing type"
                className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-1"
              >
                {filters.map((f) => {
                  const active = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setFilter(f.key);
                        setActiveId(null);
                      }}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        active
                          ? "border-white bg-white text-foreground"
                          : "border-white/15 text-white/80 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="size-2.5 rounded-full"
                          style={{
                            background: f.color,
                            boxShadow: active
                              ? "0 0 0 1px rgba(0,0,0,0.2)"
                              : "none",
                          }}
                        />
                        {f.label}
                      </span>
                      <span className={active ? "text-muted" : "text-white/50"}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------- Right: the map ---------- */}
            <div>
              <div ref={mapRef} className="relative aspect-[5/4] w-full">
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  className="absolute inset-0 size-full"
                  role="img"
                  aria-label="Map of Nigeria showing where featured properties are located"
                >
                  {/* Faint grid lines */}
                  <g stroke="white" strokeOpacity="0.07" strokeDasharray="2 6">
                    {Array.from({ length: 7 }, (_, i) => (
                      <line
                        key={`h${i}`}
                        x1="0"
                        x2={MAP_W}
                        y1={40 + i * 100}
                        y2={40 + i * 100}
                      />
                    ))}
                    {Array.from({ length: 8 }, (_, i) => (
                      <line
                        key={`v${i}`}
                        y1="0"
                        y2={MAP_H}
                        x1={50 + i * 100}
                        x2={50 + i * 100}
                      />
                    ))}
                  </g>

                  {/* Country fill fades in... */}
                  <path
                    d={NIGERIA_PATH}
                    fill="#1b4f3b"
                    className={`transition-opacity duration-1000 delay-700 motion-reduce:transition-none ${
                      visible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {/* ...while the border draws itself */}
                  <path
                    d={NIGERIA_PATH}
                    pathLength="1"
                    fill="none"
                    stroke="#a7d9c0"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className={`[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[2200ms] ease-out motion-reduce:transition-none ${
                      visible
                        ? "[stroke-dashoffset:0]"
                        : "[stroke-dashoffset:1]"
                    }`}
                  />

                  {/* State dots + a few city names */}
                  <g
                    className={`transition-opacity duration-1000 delay-[1400ms] motion-reduce:transition-none ${
                      visible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {STATE_NAMES.map((name) => (
                      <circle
                        key={name}
                        cx={STATE_XY[name][0]}
                        cy={STATE_XY[name][1]}
                        r="1.8"
                        fill="white"
                        fillOpacity="0.25"
                      />
                    ))}
                    <g
                      className="font-sans max-sm:hidden"
                      fill="white"
                      fillOpacity="0.55"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {CITY_LABELS.map((c) => (
                        <text
                          key={c.name}
                          x={STATE_XY[c.state][0]}
                          y={STATE_XY[c.state][1] + 18}
                        >
                          {c.name}
                        </text>
                      ))}
                    </g>
                  </g>
                </svg>

                {/* Pins */}
                {pins.map((pin, i) => {
                  const p = pin.property;
                  const st = statusOf(p.status);
                  const matches = filter === "All" || p.status === filter;
                  const shown = visible && matches;
                  const isActive = activeId === pin.id;
                  const delay = settled ? 0 : PIN_START + i * PIN_STEP;
                  const tip =
                    isActive && mapW
                      ? placeTooltip(pin.xPct, pin.yPct, mapW)
                      : null;

                  const close = () =>
                    setActiveId((cur) => (cur === pin.id ? null : cur));

                  return (
                    <div
                      key={pin.id}
                      data-pin
                      className="absolute size-0"
                      style={{
                        left: `${pin.xPct}%`,
                        top: `${pin.yPct}%`,
                        zIndex: isActive ? 30 : 10,
                      }}
                      onMouseEnter={() => shown && setActiveId(pin.id)}
                      onMouseLeave={close}
                      onFocus={() => setActiveId(pin.id)}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) close();
                      }}
                    >
                      {/* Marker on the exact spot */}
                      <span
                        className={`absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 ring-4 ring-white/15 transition-opacity duration-500 motion-reduce:transition-none ${
                          shown ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ transitionDelay: `${delay}ms` }}
                      />

                      {/* Pulse, only on the pin being looked at */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-0 size-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full motion-reduce:animate-none"
                          style={{ background: st.color, opacity: 0.35 }}
                        />
                      )}

                      {/* The pin drops in */}
                      <div
                        className={`absolute bottom-0 left-0 -translate-x-1/2 origin-bottom transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                          shown
                            ? "translate-y-0 scale-100 opacity-100"
                            : "pointer-events-none -translate-y-8 scale-50 opacity-0"
                        }`}
                        style={{ transitionDelay: `${delay}ms` }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveId(pin.id)}
                          tabIndex={shown ? 0 : -1}
                          aria-hidden={!shown}
                          aria-label={`${p.propertyTitle}, ${
                            p.location ?? p.state ?? ""
                          }. ${st.label}`}
                          className={`block origin-bottom cursor-pointer rounded-md drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] transition-[translate,scale] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${
                            isActive ? "-translate-y-1.5 scale-110" : ""
                          }`}
                        >
                          <PinIcon color={st.color} />
                        </button>
                      </div>

                      {tip && (
                        <PropertyTooltip property={p} status={st} {...tip} />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-white/50">
                Pins show the general area of each listing, not the exact
                address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
