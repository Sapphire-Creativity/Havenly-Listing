"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSaved } from "../../../../hooks/useSaved";
import PropertyCard from "../../../(public)/components/PropertyCard";

export default function SavedPage() {
  const router = useRouter();
  const { savedItems, savedCount, clearSaved } = useSaved();

  const [shareModal, setShareModal] = useState({
    open: false,
    propertyId: null,
    listingType: null,
  });

  // derive route from property's listing_type field
  const getRoute = (property) => {
    const map = {
      rent: "rent",
      buy: "buy",
      shortlet: "shortlet",
    };
    return map[property.listing_type] || "buy";
  };

  const handleCardClick = (property) => {
    if (!property?.id) return;
    router.push(`/${getRoute(property)}/${property.id}`);
  };

  const copyLink = (propertyId, listingType) => {
    const link = `${window.location.origin}/${listingType}/${propertyId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
        closeShareModal();
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const openShareModal = (propertyId, e, listingType) => {
    e.stopPropagation();
    setShareModal({ open: true, propertyId, listingType });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, propertyId: null, listingType: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">
            My Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Saved Properties
          </h1>
          {savedCount > 0 && (
            <p className="mt-2 text-gray-500 text-sm">
              You have{" "}
              <span className="font-semibold text-gray-700">{savedCount}</span>{" "}
              {savedCount === 1 ? "property" : "properties"} saved.
            </p>
          )}
        </div>

        {savedCount > 0 && (
          <button
            onClick={clearSaved}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <span>✕</span> Clear All
          </button>
        )}
      </div>

      {savedCount > 0 && <hr className="border-gray-200 mb-8" />}

      {/* Empty State */}
      {savedCount === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <span className="text-4xl">♡</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No saved properties yet
          </h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Browse listings and tap the heart icon on any property to save it
            here for later.
          </p>
          <Link
            href="/buy"
            className="mt-6 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Saved List */}
      {savedCount > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {savedItems.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              handleCardClick={handleCardClick}
              listingType={property.listing_type} // ✅ each property knows its own type
            />
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Property</h3>
              <button
                onClick={closeShareModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-3">
                Copy the link below to share this property:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <code className="text-sm text-gray-800 break-all">
                  {typeof window !== "undefined" && window.location.origin}/
                  {shareModal.listingType}/{shareModal.propertyId}
                </code>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => copyLink(shareModal.propertyId, shareModal.listingType)}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={closeShareModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}