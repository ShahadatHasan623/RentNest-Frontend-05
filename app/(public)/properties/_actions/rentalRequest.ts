"use server";

import { authFetch } from "@/lib/auth-fetch";

export const createRentalRequestAction = async (
  propertyId: string,
  moveInDate: string,
  duration: number
) => {
  try {
    const payload = {
      propertyId,
      moveInDate,
      duration,
    };
    const result = await authFetch("/api/rentals", {
      method: "POST",
      body: JSON.stringify(payload),
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