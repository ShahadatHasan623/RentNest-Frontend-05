import Image from "next/image";
import { getAllProperties } from "@/services/properties";

const AdminPropertiesPage = async () => {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Property Management
        </h1>

        <p className="text-muted-foreground">
          View and monitor all properties listed on RentNest.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Total Properties
          </p>

          <p className="mt-2 text-3xl font-bold">
            {properties.length}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Available
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {properties.filter((property) => property.available).length}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Unavailable
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {properties.filter((property) => !property.available).length}
          </p>
        </div>
      </div>

      {/* Properties */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.length === 0 ? (
          <div className="col-span-full rounded-xl border p-10 text-center">
            <p className="text-muted-foreground">
              No properties found.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-xl border bg-card"
            >
              {/* Image */}
              <div className="relative h-52 w-full">
                {property.images?.[0] ? (
                  <Image
                  unoptimized
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-1 font-semibold">
                    {property.title}
                  </h2>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      property.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {property.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {property.location || property.city || "Location unavailable"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ৳{property.rent ?? 0}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {property.bedrooms ?? 0} Beds ·{" "}
                    {property.bathrooms ?? 0} Baths
                  </span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Size: {property.size} sq ft
                </div>

                <div className="pt-2">
                  <span className="text-xs text-muted-foreground">
                    Property ID
                  </span>

                  <p className="truncate text-xs">
                    {property.id}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPropertiesPage;