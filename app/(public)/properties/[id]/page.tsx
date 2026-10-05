import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Bath,
  BedDouble,
  CheckCircle2,
  Image as ImageIcon,
  LogIn,
  MapPin,
  XCircle,
} from "lucide-react";

import { getPropertyById } from "@/services/properties";
import { Property } from "@/types/property";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import PropertyReviews from "@/_components/properties/PropertyReviews";
import RentalRequestForm from "@/_components/tenant/RentalRequestForm";

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PropertyDetailsPage = async ({
  params,
}: PropertyDetailsPageProps) => {
  const { id } = await params;

  const property: Property | null = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const mainImage = property.images?.[0] || "/placeholder-property.jpg";
  const imageCount = property.images?.length ?? 0;

  const formattedRent = Number(property.rent ?? 0).toLocaleString("en-US");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ================= Back Link ================= */}
      <Link
        href="/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </Link>

      {/* ================= Hero Image ================= */}
      <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border shadow-sm">
        <Image
          unoptimized
          src={mainImage}
          alt={property.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

        {/* availability badge */}
        <Badge
          className={`absolute left-4 top-4 gap-1.5 rounded-full border-transparent px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm ${
            property.available
              ? "bg-emerald-500/90 hover:bg-emerald-500"
              : "bg-red-500/90 hover:bg-red-500"
          }`}
        >
          {property.available ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Available
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5" />
              Unavailable
            </>
          )}
        </Badge>

        {/* photo count */}
        {imageCount > 1 && (
          <Badge className="absolute right-4 top-4 gap-1.5 rounded-full border-transparent bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <ImageIcon className="h-3.5 w-3.5" />
            {imageCount} Photos
          </Badge>
        )}

        {/* price pill */}
        <div className="absolute bottom-4 right-4 rounded-2xl bg-background/95 px-5 py-3 text-right shadow-lg backdrop-blur-sm">
          <p className="text-2xl font-bold leading-none tracking-tight text-primary">
            ৳{formattedRent}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            per month
          </p>
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
        {/* ================= Left: Details ================= */}
        <div className="space-y-8 lg:col-span-2">
          {/* Title & Location */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.title}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.location}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-4 py-4 text-center">
              <BedDouble className="h-5 w-5 text-primary" />
              <p className="text-xl font-bold leading-tight">
                {property.bedrooms ?? 0}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Bedrooms
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-4 py-4 text-center">
              <Bath className="h-5 w-5 text-primary" />
              <p className="text-xl font-bold leading-tight">
                {property.bathrooms ?? 0}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Bathrooms
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-4 py-4 text-center">
              <Banknote className="h-5 w-5 text-primary" />
              <p className="text-xl font-bold leading-tight">
                ৳{formattedRent}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                / Month
              </p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Description
            </h2>

            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {property.description || "No description available."}
            </p>
          </section>

          <Separator />

          {/* Amenities */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Amenities</h2>

            {property.amenities?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="line-clamp-1">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No amenities available.
              </p>
            )}
          </section>
        </div>

        {/* ================= Right: Rental Request (Sticky) ================= */}
        <div className="h-fit lg:sticky lg:top-8">
          <Card className="overflow-hidden rounded-2xl py-0 shadow-sm">
            {/* rent header */}
            <div className="border-b bg-muted/40 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Rent
                </p>

                <Badge
                  className={`gap-1.5 rounded-full border-transparent px-3 py-1 text-xs font-medium text-white ${
                    property.available
                      ? "bg-emerald-500/90 hover:bg-emerald-500"
                      : "bg-red-500/90 hover:bg-red-500"
                  }`}
                >
                  {property.available ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Unavailable
                    </>
                  )}
                </Badge>
              </div>

              <p className="mt-1.5">
                <span className="text-3xl font-bold tracking-tight text-primary">
                  ৳{formattedRent}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  /month
                </span>
              </p>
            </div>

            <CardContent className="p-6">
              {property.available ? (
                accessToken ? (
                  <RentalRequestForm propertyId={id} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5 rounded-lg border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
                      <LogIn className="mt-0.5 h-4 w-4 shrink-0" />
                      Please login to request this property.
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/auth/login?redirectTo=/properties/${id}`}>
                        Login to Request
                      </Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  This property is currently unavailable. Please check back
                  later.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* ================= Reviews ================= */}
      <section>
        <PropertyReviews propertyId={id} />
      </section>
    </div>
  );
};

export default PropertyDetailsPage;