
import Link from "next/link";
import {
  Star,
  MapPin,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getMyReviews } from "@/services/reviews";

const MyReviewsPage = async () => {
  const reviews = await getMyReviews();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              My Reviews
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              All reviews you have submitted for properties.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              No Reviews Yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You haven&apos;t submitted any reviews yet.
            </p>

            <Button asChild className="mt-6">
              <Link href="/properties">
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Review Count */}
          <div className="mb-6">
            <Badge variant="secondary">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "Review"
                : "Reviews"}
            </Badge>
          </div>

          {/* Reviews */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="line-clamp-1">
                        {review.property?.title ||
                          "Property"}
                      </CardTitle>

                      {review.property?.location && (
                        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />

                          <span className="line-clamp-1">
                            {review.property.location}
                          </span>
                        </div>
                      )}
                    </div>

                    <Badge variant="outline">
                      {review.rating}/5
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      )
                    )}
                  </div>

                  {/* Comment */}
                  <div className="mt-4 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm leading-6">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />

                    <span>
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* View Property */}
                  {review.property?.id && (
                    <Button
                      asChild
                      variant="outline"
                      className="mt-5 w-full"
                    >
                      <Link
                        href={`/properties/${review.property.id}`}
                      >
                        View Property
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyReviewsPage;
