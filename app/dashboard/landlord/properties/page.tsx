import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getMyProperties } from "@/services/landlordProperties";
import PropertyActions from "@/_components/landlord/PropertyActions";


const MyPropertiesPage = async () => {
  const properties = await getMyProperties();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            My Properties
          </h1>

          <p className="text-muted-foreground">
            Manage your rental properties.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Empty */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold">
              No properties found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              You have not added any property yet.
            </p>

            <Button asChild className="mt-4">
              <Link href="/dashboard/landlord/properties/new">
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative h-52 w-full">
                <Image
                  unoptimized
                  src={
                    property.images?.[0] ||
                    "/placeholder-property.jpg"
                  }
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">
                    {property.title}
                  </CardTitle>

                  <Badge
                    variant={
                      property.available
                        ? "default"
                        : "secondary"
                    }
                  >
                    {property.available
                      ? "Available"
                      : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {property.city || property.location || "N/A"}
                </p>

                <div className="flex justify-between text-sm">
                  <span>
                    {property.bedrooms ?? 0} Beds
                  </span>

                  <span>
                    {property.bathrooms ?? 0} Baths
                  </span>

                  <span>
                    {property.size} sqft
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">
                    ৳{property.rent ?? 0}
                    <span className="text-sm font-normal">
                      /month
                    </span>
                  </p>

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