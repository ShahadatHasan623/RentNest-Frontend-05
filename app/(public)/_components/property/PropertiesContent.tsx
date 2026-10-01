"use client";

import { useSearchParams } from "next/navigation";

import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import { PropertyQuery } from "@/src/services/property.service";
import { useProperties } from "@/src/hooks/useProperties";



export default function PropertiesContent() {
  const searchParams = useSearchParams();

  const params: PropertyQuery = {
    search: searchParams.get("search") || undefined,
    location:
      searchParams.get("location") || undefined,
    propertyType:
      searchParams.get("propertyType") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  };

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useProperties(params);
  console.log("properties", properties);

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
      <div className="rounded-xl border p-10 text-center">
        <h3 className="text-xl font-semibold text-red-600">
          Something went wrong
        </h3>

        <p className="mt-2 text-muted-foreground">
          Unable to load properties.
        </p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h3 className="text-xl font-semibold">
          No properties found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Try different filters.
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