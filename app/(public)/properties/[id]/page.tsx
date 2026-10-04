import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getPropertyById } from "@/services/properties";
import { Property } from "@/types/property";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import PropertyReviews from "@/_components/properties/PropertyReviews";
import RentalRequestForm from "@/_components/tenant/RentalRequestForm";
import { cookies } from "next/headers";

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

  const mainImage =
    property.images?.[0] || "/placeholder-property.jpg";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image
          unoptimized
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Property Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title & Location */}
          <div>
            <h1 className="text-3xl font-bold">
              {property.title}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {property.location}
            </p>
          </div>

          {/* Basic Information */}
          <Card>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Rent
                </p>

                <p className="font-semibold">
                  ৳{property.rent ?? 0}/month
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Bedrooms
                </p>

                <p className="font-semibold">
                  {property.bedrooms ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Bathrooms
                </p>

                <p className="font-semibold">
                  {property.bathrooms ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-2 text-muted-foreground">
              {property.description ||
                "No description available."}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold">
              Amenities
            </h2>

            {property.amenities?.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border px-3 py-1 text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No amenities available.
              </p>
            )}
          </div>
        </div>

        {/* Rental Request */}
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            {/* Monthly Rent */}
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Rent
              </p>

              <p className="text-2xl font-bold">
                ৳{property.rent ?? 0}
              </p>
            </div>

            {/* Availability */}
            <p
              className={
                property.available
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {property.available
                ? "Available"
                : "Currently unavailable"}
            </p>

            {/* Rental Request */}
            {property.available && (
              <>
                {accessToken ? (
                  <RentalRequestForm propertyId={id} />
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Please login to request this property.
                    </p>

                    <Button
                      className="w-full"
                      asChild
                    >
                      <Link
                        href={`/auth/login?redirectTo=/properties/${id}`}
                      >
                        Login to Request
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Reviews */}
            <PropertyReviews propertyId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;