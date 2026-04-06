"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FEATURED_LOCATIONS } from "../../../public/assets/data";

export default function ExploreLocations() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index) => {
    const container = scrollRef.current;
    const card = container.children[index];
    card.scrollIntoView({ behavior: "smooth", inline: "center" });
    setActiveIndex(index);
  };

  const scrollBy = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto px-4 py-20">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Explore Properties Across Nigeria
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl">
            Browse private residences, shortlets, and commercial properties by
            state.
          </p>
        </div>

        {/* Arrows (Desktop) */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scrollBy("left")}
            className="p-2 rounded-full border border-primary color-primary hover:bg-white transition"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="p-2 rounded-full border border-primary color-primary hover:bg-white transition"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Masonry */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
      >
        {FEATURED_LOCATIONS.map((location, index) => (
          <Link
            key={location.slug}
            href={`/listings?location=${location.slug}`}
            onMouseEnter={() => setActiveIndex(index)}
            className="group relative min-w-[280px] h-[420px] snap-center rounded-3xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl transition"
          >
            {/* Image */}
            <Image
              src={location.image}
              alt={location.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Tag */}
            {location.tag && (
              <span className="absolute top-4 left-4 z-10 text-xs bg-white/90 text-gray-900 px-3 py-1 rounded-full backdrop-blur">
                {location.tag}
              </span>
            )}

            {/* Content */}
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-white text-xl font-semibold">
                {location.name}
              </h3>
              <p className="text-white/80 text-sm">{location.state}</p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-3">
                {location.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[11px] px-2 py-1 rounded-full bg-primary-accent text-white backdrop-blur"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm text-white/90">
                  {location.propertyCount}+ listings
                </span>
                <FiArrowUpRight className="text-white text-lg" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {FEATURED_LOCATIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index
                ? "w-6 bg-primary-accent"
                : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
