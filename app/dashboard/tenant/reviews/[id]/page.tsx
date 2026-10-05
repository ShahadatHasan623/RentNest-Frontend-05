import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  LogIn,
  MapPin,
  MessageSquareQuote,
  PenLine,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getPropertyById } from "@/services/properties";
import { getPropertyReviews } from "@/services/reviews";

import ReviewForm from "@/_components/tenant/ReviewForm";

interface ReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

/* ---------- helpers ---------- */

const formatDate = (value: string | Date) => {
  const date = new Date(value);

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name?: string | null) => {
  if (!name) return "A";

  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A"
  );
};

const Stars = ({
  rating,
  className = "size-4",
}: {
  rating: number;
  className?: string;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${className} ${
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

/* ---------- main component ---------- */

const ReviewPage = async ({ params }: ReviewPageProps) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Reviews are public
  const reviewsData = await getPropertyReviews(id);

  const reviews = reviewsData?.reviews ?? [];
  const totalReviews = reviewsData?.totalReviews ?? reviews.length;
  const averageRating = totalReviews > 0 ? reviewsData?.averageRating ?? 0 : 0;

  // Check login only for review submission
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 5 -> 1 star distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ================= Back Link ================= */}
      <Link
        href={`/properties/${id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Property
      </Link>

      {/* ================= Property Hero ================= */}
      <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
        <div className="flex flex-col sm:flex-row">
          {/* thumbnail */}
          <div className="relative h-44 shrink-0 sm:h-auto sm:w-56">
            <Image
              unoptimized
              src={property.images?.[0] || "/placeholder-property.jpg"}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, 224px"
              className="object-cover"
            />
          </div>

          {/* info */}
          <CardContent className="flex-1 space-y-3 p-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                {property.title}
              </h1>

              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                {property.location || "Location unavailable"}
              </p>
            </div>

            {/* rating inline */}
            <div className="flex items-center gap-2">
              <Stars rating={averageRating} className="size-4" />

              <span className="text-sm font-semibold">
                {averageRating.toFixed(1)}
              </span>

              <span className="text-sm text-muted-foreground">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* beds/baths chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1 font-normal"
              >
                <BedDouble className="size-3.5" />
                {property.bedrooms ?? 0} Beds
              </Badge>

              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1 font-normal"
              >
                <Star className="size-3.5" />
                {property.bathrooms ?? 0} Baths
              </Badge>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
        {/* ================= Left: Reviews List ================= */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Customer Reviews
            </h2>

            <Badge variant="secondary" className="rounded-full">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </Badge>
          </div>

          {reviews.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <MessageSquareQuote className="size-6 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">No reviews yet</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your experience with this property.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* avatar */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(review.tenant?.name)}
                      </div>

                      <div>
                        <p className="font-semibold leading-tight">
                          {review.tenant?.name || "Anonymous"}
                        </p>

                        <div className="mt-1">
                          <Stars rating={review.rating} className="size-3.5" />
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="mt-4 rounded-xl bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= Right: Rating Summary + Form (Sticky) ================= */}
        <div className="space-y-6 lg:sticky lg:top-8">
          {/* rating summary */}
          {totalReviews > 0 && (
            <Card className="rounded-2xl border-border/70 py-0">
              <CardContent className="space-y-5 p-6">
                <p className="text-sm font-semibold">Rating Summary</p>

                <div className="flex items-center gap-4">
                  <p className="text-4xl font-bold leading-none tracking-tight">
                    {averageRating.toFixed(1)}
                  </p>

                  <div className="space-y-1">
                    <Stars rating={averageRating} />

                    <p className="text-xs text-muted-foreground">
                      out of 5
                    </p>
                  </div>
                </div>

                <Separator />

                {/* distribution bars */}
                <div className="space-y-2">
                  {ratingCounts.map(({ star, count }) => {
                    const percentage =
                      totalReviews > 0
                        ? Math.round((count / totalReviews) * 100)
                        : 0;

                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span className="flex w-8 shrink-0 items-center gap-1 font-medium">
                          {star}
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                        </span>

                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* review form / login prompt */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <PenLine className="size-4 text-primary" />
                </div>

                <p className="font-semibold">Write a Review</p>
              </div>

              {accessToken ? (
                <ReviewForm propertyId={id} />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 rounded-lg border bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
                    <LogIn className="mt-0.5 size-4 shrink-0" />
                    Please login to write a review for this property.
                  </div>

                  <Button className="w-full gap-1.5" size="lg" asChild>
                    <Link href={`/auth/login?redirectTo=/properties/${id}/review`}>
                      Login to Review
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;