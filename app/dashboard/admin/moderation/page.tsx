import Link from "next/link";


import ModerationButton from "@/_components/admin/ModerationButton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { getPendingProperties } from "@/services/moderation-client";


const AdminModerationPage = async () => {
  const properties =
    await getPendingProperties();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Content Moderation
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review and moderate property listings
          submitted by landlords.
        </p>
      </div>

      {/* Pending Count */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Properties
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {properties.length}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Properties waiting for admin approval
          </p>
        </CardContent>
      </Card>

      {/* Properties */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">

            <div className="mb-4 rounded-full bg-muted p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold">
              No Pending Properties
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              All property listings have been
              reviewed.
            </p>

          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">

          {properties.map((property:any) => (
            <Card key={property.id}>

              <CardContent className="p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Property Info */}
                  <div className="space-y-2">

                    <h2 className="text-lg font-semibold">
                      {property.title}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {property.location ||
                        property.address ||
                        property.city ||
                        "Location unavailable"}
                    </p>

                    {property.rent !== undefined && (
                      <p className="font-medium">
                        Rent: ${property.rent}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">

                      {property.bedrooms !==
                        undefined && (
                          <span className="rounded-full border px-3 py-1">
                            {property.bedrooms} Bedrooms
                          </span>
                        )}

                      {property.bathrooms !==
                        undefined && (
                          <span className="rounded-full border px-3 py-1">
                            {property.bathrooms} Bathrooms
                          </span>
                        )}

                      {property.size !==
                        undefined && (
                          <span className="rounded-full border px-3 py-1">
                            {property.size} sq ft
                          </span>
                        )}

                    </div>

                    {/* Landlord */}
                    {property.landlord && (
                      <div className="pt-2">
                        <p className="text-sm font-medium">
                          Landlord:{" "}
                          {property.landlord.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {property.landlord.email}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:flex-row">

                    <Button
                      asChild
                      variant="outline"
                    >
                      <Link
                        href={`/properties/${property.id}`}
                      >
                        View Property
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
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminModerationPage;