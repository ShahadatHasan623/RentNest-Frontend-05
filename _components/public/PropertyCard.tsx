import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  MapPin,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const image = property.images?.[0] || "/placeholder-property.jpg";

  const amenities = property.amenities ?? [];
  const visibleAmenities = amenities.slice(0, 3);
  const extraAmenities = amenities.length - visibleAmenities.length;

  const formattedRent = Number(property.rent ?? 0).toLocaleString("en-US");

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5">
      {/* ================= Image ================= */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          unoptimized
          src={image}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* availability badge */}
        <Badge
          className={`absolute left-3 top-3 gap-1.5 rounded-full border-transparent px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm ${
            property.available
              ? "bg-emerald-500/90 hover:bg-emerald-500"
              : "bg-red-500/90 hover:bg-red-500"
          }`}
        >
          {property.available ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Available
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5" />
              Unavailable
            </>
          )}
        </Badge>

        {/* price overlay */}
        <div className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3.5 py-1.5 shadow-lg backdrop-blur-sm">
          <span className="text-base font-bold text-primary">
            ৳{formattedRent}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            /month
          </span>
        </div>
      </div>

      {/* ================= Content ================= */}
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* title + location */}
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {property.title}
          </h3>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>
        </div>

        {/* beds / baths */}
        <div className="flex items-center rounded-xl bg-muted/70 px-2 py-2.5 text-sm font-medium">
          <div className="flex flex-1 items-center justify-center gap-2">
            <BedDouble className="h-4 w-4 text-primary" />
            <span>{property.bedrooms ?? 0}</span>
            <span className="font-normal text-muted-foreground">Beds</span>
          </div>

          <div className="h-5 w-px bg-border" />

          <div className="flex flex-1 items-center justify-center gap-2">
            <Bath className="h-4 w-4 text-primary" />
            <span>{property.bathrooms ?? 0}</span>
            <span className="font-normal text-muted-foreground">Baths</span>
          </div>
        </div>

        {/* amenities */}
        {visibleAmenities.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5">
            {visibleAmenities.map((amenity) => (
              <Badge
                key={amenity}
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-xs font-normal"
              >
                {amenity}
              </Badge>
            ))}

            {extraAmenities > 0 && (
              <Badge
                variant="outline"
                className="rounded-full px-2.5 py-0.5 text-xs font-normal text-muted-foreground"
              >
                +{extraAmenities} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* ================= Footer ================= */}
      <CardFooter className="border-t border-border/60 bg-muted/30 px-5 py-4">
        <Button className="w-full gap-2 font-medium" asChild>
          <Link href={`/properties/${property.id}`}>
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;