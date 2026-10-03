"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { createReviewAction } from "@/app/dashboard/tenant/_actions/reviewActions";

interface ReviewFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({
  propertyId,
  onSuccess,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    startTransition(async () => {
      const result = await createReviewAction({
        propertyId,
        rating,
        comment,
      });

      if (!result?.success) {
        toast.error(
          result?.message || "Failed to create review"
        );
        return;
      }

      toast.success("Review submitted successfully!");

      setRating(0);
      setComment("");

      onSuccess?.();
    });
  };

  return (
    <div className="space-y-5 rounded-xl border p-5">
      <div>
        <h3 className="text-lg font-semibold">
          Write a Review
        </h3>
        <p className="text-sm text-muted-foreground">
          Share your experience with this property.
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Rating</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110"
              aria-label={`Rate ${star} star`}
            >
              <span
                className={
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Comment
        </label>

        <Textarea
          placeholder="Write your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
};

export default ReviewForm;