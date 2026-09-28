"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { FEATURED_LOCATIONS } from "../../../public/assets/data";

const TILE_LAYOUT = [
  "md:col-span-2 lg:row-span-2", // 0: big
  "", //                            1
  "lg:row-span-2", //               2: tall
  "", //                            3
  "lg:col-span-2", //               4: wide
  "", //                            5
  "", //                            6
];

const WIDE_TILES = new Set([0, 4]);
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function ExploreLocations() {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Trigger the reveal animation once, when the section scrolls into view
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const locations = FEATURED_LOCATIONS.slice(0, TILE_LAYOUT.length);

  return (
    <section>
      <div ref={wrapperRef} className="mx-auto max-w-7xl">
        {/* Header */}
        <div
          className={`mb-10 flex flex-col gap-6 transition-[opacity,transform] duration-700 ${EASE} motion-reduce:transition-none md:mb-14 md:flex-row md:items-end md:justify-between ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="max-w-5xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-10 bg-primary" />
              Locations
            </span>
            <h2 className="mt-4 text-3xl tracking-tight text-foreground md:text-4xl ">
              Explore Properties Across Nigeria
            </h2>
            <p className="mt-3 text-base text-muted">
              Browse private residences, shortlets, and commercial properties by
              state.
            </p>
          </div>

           
        </div>

        {/* Bento grid */}
        <div className="grid grid-flow-dense auto-rows-[280px] grid-cols-1 gap-4 md:auto-rows-[260px] md:grid-cols-2 md:gap-5 lg:auto-rows-[250px] lg:grid-cols-4">
          {locations.map((location, index) => {
            const isWide = WIDE_TILES.has(index);
            const isBig = index === 0;

            return (
               
              <div
                key={location.slug}
                className={`${TILE_LAYOUT[index]} transition-[opacity,transform] duration-700 ${EASE} motion-reduce:transition-none ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
              >
                <Link
                  href="#"
                  aria-label={`Browse properties in ${location.name}, ${location.state}`}
                  className="group relative block h-full overflow-hidden rounded-3xl bg-border shadow-sm ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {/* Image */}
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    sizes={
                      isWide
                        ? "(min-width: 1024px) 50vw, 100vw"
                        : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    }
                    className={`object-cover transition-transform duration-[900ms] ${EASE} group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                  />

                  {/* Dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/5" />

                  {/* Forest-green tint that fades in on hover */}
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/25" />

                  {/* Top row: tag + arrow */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
                    {location.tag ? (
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                        {location.tag}
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-md transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                      <FiArrowUpRight
                        size={18}
                        className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <h3
                      className={`font-heading font-bold leading-tight text-white ${
                        isBig ? "text-3xl md:text-4xl" : "text-xl"
                      }`}
                    >
                      {location.name}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-2 text-sm text-white/80">
                      <FiMapPin size={14} className="shrink-0" />
                      <span>{location.state}</span>
                      <span className="size-1 rounded-full bg-white/50" />
                      <span>{location.propertyCount}+ listings</span>
                    </div>

                    {/* Categories: always visible on mobile,
                        slide open on hover for desktop */}
                    <div className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-visible:grid-rows-[1fr] lg:group-focus-visible:opacity-100">
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 pt-3">
                          {location.categories.slice(0, 3).map((cat) => (
                            <span
                              key={cat}
                              className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
