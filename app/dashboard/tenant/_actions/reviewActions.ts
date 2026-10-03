"use server";

import {
  createReview,
  type CreateReviewPayload,
} from "@/services/reviews";

export const createReviewAction = async (
  payload: CreateReviewPayload
) => {
  try {
    return await createReview(payload);
  } catch (error) {
    console.error("CREATE REVIEW ACTION ERROR:", error);

    return {
      success: false,
      message: "Failed to create review",
    };
  }
};