"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [propertyType, setPropertyType] =
    useState(
      searchParams.get("propertyType") || ""
    );

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (location) {
      params.set("location", location);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    if (propertyType) {
      params.set("propertyType", propertyType);
    }

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("");

    router.push("/properties");
  };

  return (
    <div className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
      <div>
        <Label>Search</Label>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Apartment, house..."
          className="mt-2"
        />
      </div>

      <div>
        <Label>Location</Label>

        <Input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          placeholder="Dhaka, Barisal..."
          className="mt-2"
        />
      </div>

      <div>
        <Label>Property Type</Label>

        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value)
          }
          className="mt-2 w-full rounded-md border bg-background px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="ROOM">Room</option>
          <option value="OFFICE">Office</option>
          <option value="SHOP">Shop</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Price</Label>

          <Input
            type="number"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            placeholder="৳0"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Max Price</Label>

          <Input
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            placeholder="৳50000"
            className="mt-2"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleFilter}
          className="flex-1"
        >
          Apply Filters
        </Button>

        <Button
          variant="outline"
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}