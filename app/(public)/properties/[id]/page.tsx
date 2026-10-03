import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getProperty = async (id: string) => {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/${id}`,
    {
      next: {
        revalidate: 60,
        tags: [`property-${id}`],
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  return result.data;
};

const PropertyDetailsPage = async ({
  params,
}: PropertyDetailsPageProps) => {
  const { id } = await params;

  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>

        <Button className="mt-5" asChild>
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>
    );
  }

  const image =
    property.images?.[0] || "/placeholder-property.jpg";

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            unoptimized
            src={image}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>

            <Badge
              className="flex items-center gap-1 shrink-0"
              variant={
                property.available ? "default" : "destructive"
              }
            >
              {property.available ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Available</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Unavailable</span>
                </>
              )}
            </Badge>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{property.location}</span>
          </p>

          <p className="mt-6 text-3xl font-bold text-primary">
            ৳{property.rent?.toLocaleString()} / month
          </p>

          <div className="mt-6 flex gap-6 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Bed className="h-4 w-4 text-muted-foreground" />
              {property.bedrooms ?? 0} Bedrooms
            </span>

            <span className="flex items-center gap-2 font-medium">
              <Bath className="h-4 w-4 text-muted-foreground" />
              {property.bathrooms ?? 0} Bathrooms
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Description</h2>

            <p className="mt-3 leading-7 text-muted-foreground">
              {property.description}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Amenities</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            {property.available ? (
              <Button size="lg" className="w-full" asChild>
                <Link
                  href={`/auth/login?redirect=/properties/${property.id}`}
                >
                  Request to Rent
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full"
                disabled
              >
                Currently Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailsPage;