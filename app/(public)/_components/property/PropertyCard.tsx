import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Property } from "@/src/types/property";



interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const image =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={property.title}
          unoptimized
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <Badge className="absolute left-3 top-3">
          {property.propertyType}
        </Badge>

        {!property.isAvailable && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3"
          >
            Not Available
          </Badge>
        )}
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-xl font-semibold">
            {property.title}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.location}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          {property.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms} Beds
            </span>
          )}

          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} Baths
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">
              {/* ৳{property.price.toLocaleString()} */}
            </span>

            <span className="text-sm text-muted-foreground">
              /month
            </span>
          </div>

          <Button asChild>
            <Link href={`/properties/${property.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}