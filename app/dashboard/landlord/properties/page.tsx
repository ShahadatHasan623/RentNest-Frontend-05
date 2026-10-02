"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteProperty, useLandlordProperties, useToggleAvailability } from "@/src/hooks/useLandlordProperties";


const MyPropertiesPage = () => {
  const { data: properties = [], isLoading, isError } =
    useLandlordProperties();

  const deleteMutation = useDeleteProperty();
  const availabilityMutation = useToggleAvailability();

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Property deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete property");
      },
    });
  };

  const handleAvailability = (
    id: string,
    currentStatus: boolean
  ) => {
    availabilityMutation.mutate(
      {
        id,
        isAvailable: !currentStatus,
      },
      {
        onSuccess: () => {
          toast.success(
            `Property marked as ${
              !currentStatus ? "available" : "unavailable"
            }`
          );
        },
        onError: () => {
          toast.error("Failed to update availability");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-500">
          Failed to load your properties.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            My Properties
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your rental properties
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
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-lg font-semibold">
              No properties yet
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create your first rental property.
            </p>

            <Button asChild className="mt-5">
              <Link href="/dashboard/landlord/properties/new">
                Add Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={
                    property.images?.[0] ||
                    "/placeholder-property.jpg"
                  }
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute right-3 top-3">
                  <Badge
                    variant={
                      property.isAvailable
                        ? "default"
                        : "destructive"
                    }
                  >
                    {property.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-1 text-lg font-semibold">
                    {property.title}
                  </h2>

                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {property.location}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ৳{property.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      /month
                    </span>
                  </span>

                  <Badge variant="outline">
                    {property.propertyType}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAvailability(
                        property.id,
                        property.isAvailable
                      )
                    }
                    disabled={availabilityMutation.isPending}
                  >
                    {property.isAvailable
                      ? "Disable"
                      : "Enable"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/dashboard/landlord/properties/${property.id}/edit`}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDelete(property.id)
                    }
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
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