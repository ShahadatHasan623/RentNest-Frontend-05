import { Star } from "lucide-react";

import { getPropertyReviews } from "@/services/reviews";

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews = async ({
  propertyId,
}: PropertyReviewsProps) => {
  const data =
    await getPropertyReviews(propertyId);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Reviews
        </h2>

        <p className="text-sm text-muted-foreground">
          {data.totalReviews} review
          {data.totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 rounded-xl border p-5">
        <div>
          <p className="text-4xl font-bold">
            {data.averageRating.toFixed(1)}
          </p>
        </div>

        <div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <=
                    Math.round(data.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                  }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Average rating
          </p>
        </div>
      </div>

      {/* Reviews */}
      {data.reviews.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">
            No reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {review.tenant?.name ||
                      "Anonymous"}
                  </p>

                  <div className="mt-1 flex">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                            }`}
                        />
                      )
                    )}
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PropertyReviews;