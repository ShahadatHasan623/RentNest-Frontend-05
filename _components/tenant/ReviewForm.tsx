
"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { createReviewAction } from "@/app/dashboard/tenant/reviews/_actions/reviewActions";

interface ReviewFormProps {
  propertyId: string;
}

const ReviewForm = ({
  propertyId,
}: ReviewFormProps) => {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isPending, startTransition] =
    useTransition();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error(
        "Please select a rating"
      );
      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please write a comment"
      );
      return;
    }

    startTransition(async () => {
      const result =
        await createReviewAction({
          propertyId,
          rating,
          comment: comment.trim(),
        });

      console.log(
        "REVIEW RESULT:",
        result
      );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Failed to submit review"
        );

        return;
      }

      toast.success(
        "Review submitted successfully"
      );

      setRating(0);
      setComment("");

      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-card p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Leave a Review
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Share your experience with this property.
        </p>
      </div>

      {/* Rating */}

      <div className="space-y-3">
        <p className="text-sm font-medium">
          Your Rating
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
                disabled={isPending}
                aria-label={`Rate ${star} stars`}
                className="rounded-md p-1 transition hover:scale-110 disabled:opacity-50"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            )
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {rating > 0
            ? `${rating} out of 5 stars`
            : "Select your rating"}
        </p>
      </div>

      {/* Comment */}

      <div className="space-y-3">
        <label
          htmlFor="review-comment"
          className="text-sm font-medium"
        >
          Your Comment
        </label>

        <Textarea
          id="review-comment"
          placeholder="Write your experience..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          rows={5}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending
          ? "Submitting..."
          : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;

