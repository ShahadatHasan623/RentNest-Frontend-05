"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const PropertyFilters = () => {
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

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

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

    router.push(
      `/properties?${params.toString()}`
    );
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");

    router.push("/properties");
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >

          <Input
            placeholder="Search property..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
            >
              Search
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>

        </form>

      </CardContent>
    </Card>
  );
};

export default PropertyFilters;