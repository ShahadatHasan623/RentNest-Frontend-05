import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  DoorClosed,
  DoorOpen,
  Home,
  MapPin,
  Plus,
  Ruler,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getMyProperties } from "@/services/landlordProperties";
import PropertyActions from "@/_components/landlord/PropertyActions";

/* ---------- helpers ---------- */

const formatCurrency = (value: number | string | null | undefined) =>
  `৳${Number(value ?? 0).toLocaleString("en-US")}`;

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "AVAILABLE", label: "Available" },
  { key: "UNAVAILABLE", label: "Unavailable" },
] as const;

interface MyPropertiesPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

/* ---------- main component ---------- */

const MyPropertiesPage = async ({ searchParams }: MyPropertiesPageProps) => {
  const { status } = await searchParams;

  const properties = (await getMyProperties()) ?? [];

  const activeFilter =
    status === "AVAILABLE" || status === "UNAVAILABLE" ? status : "ALL";

  const filtered =
    activeFilter === "ALL"
      ? properties
      : properties.filter((property) =>
          activeFilter === "AVAILABLE"
            ? property.available
            : !property.available,
        );

  const availableCount = properties.filter(
    (property) => property.available,
  ).length;

  const unavailableCount = properties.length - availableCount;

  // available properties theke estimated monthly income
  const monthlyIncome = properties
    .filter((property) => property.available)
    .reduce((sum, property) => sum + Number(property.rent ?? 0), 0);

  const countBy = (key: string) =>
    key === "ALL"
      ? properties.length
      : key === "AVAILABLE"
        ? availableCount
        : unavailableCount;

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">
              Your listings 🏠
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              My Properties
            </h1>

            <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
              Manage your rental listings, availability and pricing.
            </p>
          </div>

          <Button
            asChild
            variant="secondary"
            className="gap-1.5 sm:shrink-0"
          >
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Summary Strip ================= */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Listings</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {properties.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DoorOpen className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Available</p>

            <p className="text-xl font-bold leading-tight tracking-tight">
              {availableCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="size-4.5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Est. Monthly Income</p>

            <p className="text-xl font-bold leading-tight tracking-tight text-primary">
              {formatCurrency(monthlyIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= Filter Tabs ================= */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = countBy(filter.key);

          return (
            <Link
              key={filter.key}
              href={
                filter.key === "ALL"
                  ? "/dashboard/landlord/properties"
                  : `/dashboard/landlord/properties?status=${filter.key}`
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter.label}

              <span
                className={`rounded-full px-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ================= Properties Grid ================= */}
      {properties.length === 0 ? (
        /* ---- completely empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Home className="size-7 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold">No properties yet</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first property and start receiving rental requests
              from tenants.
            </p>
          </div>

          <Button asChild className="mt-2 gap-1.5">
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" />
              Add Your First Property
            </Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        /* ---- filter result empty ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
          <p className="font-medium">
            No {activeFilter === "AVAILABLE" ? "available" : "unavailable"}{" "}
            properties
          </p>

          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/landlord/properties">Clear filter</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <Card
              key={property.id}
              className="group flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
            >
              {/* ---------- image ---------- */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  unoptimized
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* readability gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                {/* availability badge */}
                <Badge
                  className={`absolute left-3 top-3 gap-1.5 rounded-full border-transparent px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm ${
                    property.available
                      ? "bg-emerald-500/90 hover:bg-emerald-500"
                      : "bg-slate-600/90 hover:bg-slate-600"
                  }`}
                >
                  {property.available ? (
                    <>
                      <DoorOpen className="size-3.5" />
                      Available
                    </>
                  ) : (
                    <>
                      <DoorClosed className="size-3.5" />
                      Unavailable
                    </>
                  )}
                </Badge>

                {/* price overlay */}
                <div className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3.5 py-1.5 shadow-lg backdrop-blur-sm">
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(property.rent)}
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    /mo
                  </span>
                </div>
              </div>

              {/* ---------- content ---------- */}
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                {/* title + location */}
                <div className="space-y-1.5">
                  <h3 className="line-clamp-1 font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {property.title}
                  </h3>

                  <p className="flex items-center gap-1.5 line-clamp-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    {property.city || property.location || "Location unavailable"}
                  </p>
                </div>

                {/* specs strip */}
                <div className="flex items-center rounded-xl bg-muted/70 px-2 py-2.5 text-sm font-medium">
                  <div className="flex flex-1 items-center justify-center gap-1.5">
                    <BedDouble className="size-4 text-primary" />

                    <span>{property.bedrooms ?? 0}</span>

                    <span className="hidden font-normal text-muted-foreground sm:inline">
                      Beds
                    </span>
                  </div>

                  <div className="h-5 w-px bg-border" />

                  <div className="flex flex-1 items-center justify-center gap-1.5">
                    <Bath className="size-4 text-primary" />

                    <span>{property.bathrooms ?? 0}</span>

                    <span className="hidden font-normal text-muted-foreground sm:inline">
                      Baths
                    </span>
                  </div>

                  <div className="h-5 w-px bg-border" />

                  <div className="flex flex-1 items-center justify-center gap-1.5">
                    <Ruler className="size-4 text-primary" />

                    <span>{property.size ?? "N/A"}</span>

                    <span className="hidden font-normal text-muted-foreground sm:inline">
                      sqft
                    </span>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                  <Link
                    href={`/properties/${property.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                  >
                    View Public Page
                    <ArrowRight className="size-3.5" />
                  </Link>

                  <PropertyActions
                    id={property.id}
                    available={property.available}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;