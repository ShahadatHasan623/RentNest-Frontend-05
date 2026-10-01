import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Bath,
  BedDouble,
  MapPin,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPropertyById } from "@/src/services/property.service";
import RequestToRent from "@/app/dashboard/_components/RequestToRent";



interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  let property;

  try {
    property = await getPropertyById(id);
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  const mainImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* Back */}

        <Button
          asChild
          variant="ghost"
          className="mb-6"
        >
          <Link href="/properties">
            <ArrowLeft />
            Back to Properties
          </Link>
        </Button>

        {/* Gallery */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-2xl md:h-[500px]">
            <Image
              src={mainImage}
              unoptimized
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {property.images
              ?.slice(1, 5)
              .map((image, index) => (
                <div
                  key={index}
                  className="relative min-h-[180px] overflow-hidden rounded-xl"
                >
                  <Image
                  unoptimized
                    src={image}
                    alt={`${property.title} ${
                      index + 2
                    }`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Main Content */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_350px]">

          {/* Left */}

          <div className="space-y-8">

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>
                  {property.propertyType}
                </Badge>

                {property.isAvailable ? (
                  <Badge variant="secondary">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Not Available
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold">
                {property.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {property.location}
              </div>
            </div>

            {/* Price */}

            <div>
              <span className="text-3xl font-bold">
                {/* ৳{property.price.toLocaleString()} */}
              </span>

              <span className="text-muted-foreground">
                /month
              </span>
            </div>

            {/* Features */}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {property.bedrooms !== undefined && (
                <Card>
                  <CardContent className="flex items-center gap-3 p-5">
                    <BedDouble className="h-6 w-6 text-primary" />

                    <div>
                      <p className="font-semibold">
                        {property.bedrooms}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Bedrooms
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {property.bathrooms !== undefined && (
                <Card>
                  <CardContent className="flex items-center gap-3 p-5">
                    <Bath className="h-6 w-6 text-primary" />

                    <div>
                      <p className="font-semibold">
                        {property.bathrooms}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Bathrooms
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}

            <section>
              <h2 className="text-2xl font-bold">
                About this property
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                {property.description}
              </p>
            </section>

            {/* Amenities */}

            {property.amenities?.length ? (
              <section>
                <h2 className="text-2xl font-bold">
                  Amenities
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.map(
                    (amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="px-4 py-2"
                      >
                        {amenity}
                      </Badge>
                    )
                  )}
                </div>
              </section>
            ) : null}

            {/* Landlord */}

            {property.landlord && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Property Owner
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      {property.landlord.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {property.landlord.email}
                    </p>

                    {property.landlord.phone && (
                      <p className="text-sm text-muted-foreground">
                        {property.landlord.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right */}

          <aside>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>
                  Interested in this property?
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RequestToRent
                  propertyId={property.id}
                  propertyTitle={property.title}
                  isAvailable={
                    property.isAvailable
                  }
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}