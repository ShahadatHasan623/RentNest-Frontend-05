import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const image = property.images?.[0] || "/placeholder-property.jpg";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          unoptimized
          src={image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        <Badge
          className="absolute left-3 top-3 flex items-center gap-1"
          variant={property.available ? "default" : "destructive"}
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

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold">
            {property.title}
          </h3>

          <span className="whitespace-nowrap font-bold text-primary">
            ৳{property.rent}
          </span>
        </div>

        <p className="flex items-center gap-1 line-clamp-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{property.location}</span>
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-muted-foreground" />
            {property.bedrooms ?? 0} Beds
          </span>

          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-muted-foreground" />
            {property.bathrooms ?? 0} Baths
          </span>
        </div>

        {property.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;