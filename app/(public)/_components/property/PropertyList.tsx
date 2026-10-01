"use client";

import { useProperties } from "@/src/hooks/useProperties";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";



export default function PropertyList() {
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useProperties();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-red-700">
          Failed to load properties
        </h3>

        <p className="mt-2 text-sm text-red-600">
          Please try again later.
        </p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="rounded-xl border p-12 text-center">
        <h3 className="text-xl font-semibold">
          No properties found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
        />
      ))}
    </div>
  );
}