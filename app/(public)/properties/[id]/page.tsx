import Image from "next/image";
import { notFound } from "next/navigation";

import { getPropertyById } from "@/services/properties";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RentalRequestForm from "@/_components/tenant/RentalRequestForm";
import PropertyReviews from "@/_components/properties/PropertyReviews";

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PropertyDetailsPage = async ({
  params,
}: PropertyDetailsPageProps) => {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const mainImage =
    property.images?.[0] ||
    "/placeholder-property.jpg";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
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
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-3xl font-bold">
              {property.title}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {property.location}
            </p>
          </div>

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

          <div>
            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-2 text-muted-foreground">
              {property.description ||
                "No description available."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Amenities
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {property.amenities?.map(
                (amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border px-3 py-1 text-sm"
                  >
                    {amenity}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Rent
              </p>

              <p className="text-2xl font-bold">
                ৳{property.rent ?? 0}
              </p>
            </div>

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

            {property.available && (
              <RentalRequestForm
                propertyId={property.id}
              />
            )}
             <PropertyReviews propertyId={property.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;