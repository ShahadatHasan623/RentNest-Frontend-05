"use server";

import { authFetch } from "@/lib/auth-fetch";

export const createRentalRequestAction = async (
  propertyId: string,
  moveInDate: string,
  duration: number
) => {
  try {
    const result = await authFetch("/api/rentals", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
        moveInDate,
        duration,
      }),
    });

    return result;
  } catch (error) {
    console.error("CREATE RENTAL REQUEST ERROR:", error);

    return {
      success: false,
      message: "Failed to submit rental request",
    };
  }
};