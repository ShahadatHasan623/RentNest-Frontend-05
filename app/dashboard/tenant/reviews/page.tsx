import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  MessageSquareQuote,
  Star,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getMyReviews } from "@/services/reviews";

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

const Stars = ({
  rating,
  className = "size-4",
}: {
  rating: number;
  className?: string;
}) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${className} ${
          index < rating
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

/* ---------- main component ---------- */

const MyReviewsPage = async () => {
  const reviews = (await getMyReviews()) ?? [];

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      : 0;

  const fiveStarCount = reviews.filter(
    (review) => review.rating === 5,
  ).length;

  const fiveStarPercent =
    totalReviews > 0
      ? Math.round((fiveStarCount / totalReviews) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* ================= Hero Banner ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80">
            Your voice matters 💬
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            My Reviews
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            All the feedback you&apos;ve shared about properties you&apos;ve
            experienced.
          </p>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-20 size-52 rounded-full bg-white/10" />
      </div>

      {totalReviews === 0 ? (
        /* ================= Empty State ================= */
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <MessageSquareQuote className="size-7 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold">No reviews yet</p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t submitted any reviews yet. Share your
              experience to help other renters.
            </p>
          </div>

          <Button asChild className="mt-2 gap-1.5">
            <Link href="/properties">
              Browse Properties
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* ================= Summary Cards ================= */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* total reviews */}
            <Card className="rounded-2xl border-border/70 py-0">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquareQuote className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Reviews
                  </p>

                  <p className="text-2xl font-bold leading-tight tracking-tight">
                    {totalReviews}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* average rating */}
            <Card className="rounded-2xl border-border/70 py-0">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold leading-tight tracking-tight">
                      {averageRating.toFixed(1)}
                    </p>

                    <Stars rating={averageRating} className="size-3.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-star percentage */}
            <Card className="rounded-2xl border-border/70 py-0">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">5-Star Given</p>

                  <p className="text-2xl font-bold leading-tight tracking-tight">
                    {fiveStarPercent}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= Reviews Grid ================= */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => {
              const image = review.property?.images?.[0];

              return (
                <Card
                  key={review.id}
                  className="group flex h-full flex-col gap-0 rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
                >
                  {/* property thumbnail header */}
                  <div className="relative h-32 overflow-hidden rounded-t-2xl">
                    {image ? (
                      <Image
                        unoptimized
                        src={image}
                        alt={review.property?.title || "Property"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <MessageSquareQuote className="size-8 text-muted-foreground" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* rating badge on image */}
                    <Badge className="absolute right-3 top-3 gap-1 rounded-full border-transparent bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {review.rating}/5
                    </Badge>

                    {/* property title over image */}
                    <div className="absolute inset-x-0 bottom-0 p-3.5">
                      <p className="line-clamp-1 text-sm font-semibold text-white drop-shadow">
                        {review.property?.title || "Property"}
                      </p>

                      {review.property?.location && (
                        <p className="mt-0.5 flex items-center gap-1 line-clamp-1 text-xs text-white/85">
                          <MapPin className="size-3 shrink-0" />
                          {review.property.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    {/* stars + date */}
                    <div className="flex items-center justify-between gap-2">
                      <Stars rating={review.rating} />

                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* comment quote */}
                    <div className="relative mt-4 flex-1 rounded-xl bg-muted/50 px-4 py-3.5">
                      <MessageSquareQuote className="absolute -top-2 left-3 size-4 fill-muted text-muted" />

                      <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>

                    {/* footer action */}
                    {review.property?.id && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full gap-1.5"
                      >
                        <Link href={`/properties/${review.property.id}`}>
                          View Property
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyReviewsPage;