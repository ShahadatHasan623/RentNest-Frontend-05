import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Ruler,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import ModerationButton from "@/_components/admin/ModerationButton";

import { getPendingProperties } from "@/services/moderation-client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ---------- helpers ---------- */

const formatCurrency = (value: number | string | null | undefined) =>
  `৳${Number(value ?? 0).toLocaleString("en-US")}`;

const getInitials = (name?: string | null) => {
  if (!name) return "L";

  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "L"
  );
};

/* ---------- main component ---------- */

const AdminModerationPage = async () => {
  const properties = (await getPendingProperties()) ?? [];

  const pendingCount = properties.length;

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Review queue 🛡️
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Content Moderation
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Review and moderate property listings submitted by landlords.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {/* ================= Pending Alert Strip ================= */}
      <div
        className={`flex items-center gap-3.5 rounded-2xl border px-5 py-4 ${
          pendingCount > 0
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-emerald-500/30 bg-emerald-500/10"
        }`}
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            pendingCount > 0
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {pendingCount > 0 ? (
            <Clock className="size-4.5" />
          ) : (
            <CheckCircle2 className="size-4.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold ${
              pendingCount > 0
                ? "text-amber-700 dark:text-amber-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {pendingCount > 0
              ? `${pendingCount} ${
                  pendingCount === 1 ? "property" : "properties"
                } waiting for review`
              : "All caught up!"}
          </p>

          <p className="text-sm text-muted-foreground">
            {pendingCount > 0
              ? "Approve or reject the listings below to keep the platform clean."
              : "No pending properties — every listing has been reviewed."}
          </p>
        </div>
      </div>

      {/* ================= Moderation Queue ================= */}
      {properties.length === 0 ? (
        /* ---- all reviewed empty state ---- */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldCheck className="size-7 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <p className="text-lg font-semibold">No pending properties</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              All property listings have been reviewed. New submissions will
              appear here.
            </p>
          </div>

          <Button asChild variant="outline" className="mt-1 gap-1.5">
            <Link href="/dashboard/admin/properties">
              <Building2 className="size-4" />
              View All Properties
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property: any) => {
            const image = property.images?.[0];

            return (
              <Card
                key={property.id}
                className="rounded-2xl border-amber-500/25 py-0 transition-colors hover:border-amber-500/45"
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
                    {/* ---------- thumbnail ---------- */}
                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border lg:h-auto lg:w-52">
                      {image ? (
                        <Image
                          unoptimized
                          src={image}
                          alt={property.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 208px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 bg-muted">
                          <Home className="size-7 text-muted-foreground" />

                          <p className="text-xs text-muted-foreground">
                            No image
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ---------- property info ---------- */}
                    <div className="min-w-0 flex-1 space-y-3">
                      {/* title + location */}
                      <div>
                        <h2 className="line-clamp-1 text-lg font-semibold tracking-tight">
                          {property.title}
                        </h2>

                        <p className="mt-1 flex items-center gap-1.5 line-clamp-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />
                          {property.location ||
                            property.address ||
                            property.city ||
                            "Location unavailable"}
                        </p>
                      </div>

                      {/* specs + rent */}
                      <div className="flex flex-wrap items-center gap-2">
                        {property.rent !== undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                            <Wallet className="size-3.5" />
                            {formatCurrency(property.rent)}
                            <span className="text-xs font-medium text-muted-foreground">
                              /mo
                            </span>
                          </span>
                        )}

                        {property.bedrooms !== undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <BedDouble className="size-3.5" />
                            {property.bedrooms} Beds
                          </span>
                        )}

                        {property.bathrooms !== undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <Bath className="size-3.5" />
                            {property.bathrooms} Baths
                          </span>
                        )}

                        {property.size !== undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <Ruler className="size-3.5" />
                            {property.size} sqft
                          </span>
                        )}
                      </div>

                      {/* landlord */}
                      <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5">
                        <Avatar className="size-8 shrink-0 rounded-full border">
                          <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                            {getInitials(property.landlord?.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {property.landlord?.name || "Unknown Landlord"}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {property.landlord?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ---------- actions ---------- */}
                    <div className="flex shrink-0 flex-col justify-center gap-2 border-border/60 lg:w-44 lg:border-l lg:pl-5">
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <Link href={`/properties/${property.id}`}>
                          View Property
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </Button>

                      <ModerationButton
                        propertyId={property.id}
                        status="APPROVED"
                      />

                      <ModerationButton
                        propertyId={property.id}
                        status="REJECTED"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminModerationPage;