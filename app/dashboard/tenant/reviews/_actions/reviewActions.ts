"use server";

import {
  createReview,
  CreateReviewPayload,
} from "@/services/reviews";

export const createReviewAction = async (
  payload: CreateReviewPayload
) => {
  try {


    const result = await createReview(payload);

   

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