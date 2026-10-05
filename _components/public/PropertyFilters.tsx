"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PropertyFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(
    searchParams.get("search") || "",
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || "",
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || "",
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || "",
  );

  // active filter count (URL theke)
  const activeFilters = [
    "search",
    "location",
    "minPrice",
    "maxPrice",
  ].filter((key) => searchParams.get(key)).length;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");

    startTransition(() => {
      router.push("/properties");
    });
  };

  const inputBase = "h-11 bg-background";

  return (
    <Card className="mb-8 rounded-2xl border-border/70 py-0 shadow-sm">
      <CardContent className="p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ---------- header row ---------- */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <SlidersHorizontal className="size-4 text-primary" />
              </div>

              <p className="text-sm font-semibold">
                Filter Properties
              </p>
            </div>

            {/* active filter badge */}
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <X className="size-3" />
                {activeFilters} filter
                {activeFilters > 1 ? "s" : ""} active — clear
              </button>
            )}
          </div>

          {/* ---------- fields ---------- */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* search */}
            <div className="space-y-1.5">
              <Label htmlFor="filter-search" className="text-xs text-muted-foreground">
                Keyword
              </Label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="filter-search"
                  placeholder="Property name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputBase} pl-9`}
                />
              </div>
            </div>

            {/* location */}
            <div className="space-y-1.5">
              <Label htmlFor="filter-location" className="text-xs text-muted-foreground">
                Location
              </Label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="filter-location"
                  placeholder="City, area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`${inputBase} pl-9`}
                />
              </div>
            </div>

            {/* price range */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground">
                Price Range (৳/month)
              </Label>

              <div className="flex items-center gap-2">
                {/* min */}
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    ৳
                  </span>

                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={`${inputBase} pl-8`}
                  />
                </div>

                {/* dash */}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                  <Wallet className="size-4 text-muted-foreground" />
                </div>

                {/* max */}
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    ৳
                  </span>

                  <Input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={`${inputBase} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- actions ---------- */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={isPending}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="min-w-36 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Search Properties
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;