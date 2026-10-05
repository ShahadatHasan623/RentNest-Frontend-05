import { MessageSquareText, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getPropertyReviews } from "@/services/reviews";

interface PropertyReviewsProps {
  propertyId: string;
}

/* ---------- helpers ---------- */

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

const formatDate = (value: string | Date) => {
  const date = new Date(value);
  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ---------- small components ---------- */

const Stars = ({
  rating,
  className = "h-4 w-4",
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

const PropertyReviews = async ({ propertyId }: PropertyReviewsProps) => {
  const data = await getPropertyReviews(propertyId);

  const reviews = data?.reviews ?? [];
  const totalReviews = data?.totalReviews ?? reviews.length;
  const averageRating = totalReviews > 0 ? data?.averageRating ?? 0 : 0;

  // 5 -> 1 star distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));

  return (
    <section className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>

        <Badge variant="secondary" className="rounded-full">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </Badge>
      </div>

      {/* ================= Rating Summary ================= */}
      {totalReviews > 0 && (
        <Card className="rounded-2xl border-border/70 py-0">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-10">
            {/* average score */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <p className="text-5xl font-bold leading-none tracking-tight">
                {averageRating.toFixed(1)}
              </p>

              <Stars rating={averageRating} className="h-5 w-5" />

              <p className="text-xs text-muted-foreground">out of 5</p>
            </div>

            <div className="hidden h-20 w-px bg-border sm:block" />

            {/* star distribution bars */}
            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => {
                const percentage =
                  totalReviews > 0
                    ? Math.round((count / totalReviews) * 100)
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="flex w-9 shrink-0 items-center gap-1 font-medium">
                      {star}
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </span>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= Review List ================= */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquareText className="h-6 w-6 text-muted-foreground" />
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
              className="rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/30 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* avatar with initials */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(review.tenant?.name)}
                  </div>

                  <div>
                    <p className="font-semibold leading-tight">
                      {review.tenant?.name || "Anonymous"}
                    </p>

                    <div className="mt-1">
                      <Stars rating={review.rating} />
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
    </section>
  );
};

export default PropertyReviews;