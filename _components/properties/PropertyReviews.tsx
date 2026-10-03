import { getPropertyReviews } from "@/services/reviews";

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews = async ({
  propertyId,
}: PropertyReviewsProps) => {
  const data = await getPropertyReviews(propertyId);

  return (
    <section className="mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Reviews
        </h2>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-xl font-semibold">
            ⭐ {data.averageRating.toFixed(1)}
          </span>

          <span className="text-sm text-muted-foreground">
            ({data.totalReviews} reviews)
          </span>
        </div>
      </div>

      {data.reviews.length === 0 ? (
        <div className="rounded-xl border p-6 text-center">
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
                  <h3 className="font-semibold">
                    {review.tenant?.name || "Anonymous"}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-yellow-400">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6">
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