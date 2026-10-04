import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { getPropertyById } from "@/services/properties";
import { getPropertyReviews } from "@/services/reviews";

import ReviewForm from "@/_components/tenant/ReviewForm";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

  // Check login only for review submission
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Property */}
      <Card>
        <CardHeader>
          <CardTitle>
            Review: {property.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            {property.location || "Location unavailable"}
          </p>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

            <span className="font-semibold">
              {reviewsData.averageRating.toFixed(1)}
            </span>

            <span className="text-sm text-muted-foreground">
              ({reviewsData.totalReviews} reviews)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Review Form - Login Required */}
      {accessToken ? (
        <ReviewForm propertyId={id} />
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Please login to write a review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Public Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>

        <CardContent>
          {reviewsData.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <div className="space-y-6">
              {reviewsData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-5 last:border-b-0"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {review.tenant?.name || "Tenant"}
                      </p>

                      {/* Stars */}
                      <div className="mt-1 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-3 text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;