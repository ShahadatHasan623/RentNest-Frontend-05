"use server";

import {
  createReview,
  type CreateReviewPayload,
} from "@/services/reviews";

export const createReviewAction = async (
  payload: CreateReviewPayload
) => {
  try {
    console.log("CREATE REVIEW PAYLOAD:", payload);

    const result = await createReview(payload);

    console.log("CREATE REVIEW RESULT:", result);

    return result;
  } catch (error) {
    console.error(
      "CREATE REVIEW ACTION ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to create review",
    };
  }
};