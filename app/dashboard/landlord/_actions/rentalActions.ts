
"use server";

import { updateRentalStatus } from "@/services/rentals";

export const updateRentalStatusAction = async (
  id: string,
  status: "APPROVED" | "REJECTED" | "COMPLETED"
) => {
  try {
    return await updateRentalStatus(
      id,
      status
    );
  } catch (error) {
    console.error(
      "UPDATE RENTAL STATUS ACTION ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Failed to update rental status",
    };
  }
};
