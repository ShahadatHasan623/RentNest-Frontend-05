"use server";

import { authFetch } from "@/lib/auth-fetch";

export const createPaymentAction = async (
  rentalRequestId: string
) => {
  try {
    const result = await authFetch(
      "/api/payments/create",
      {
        method: "POST",
        body: JSON.stringify({
          rentalRequestId,
        }),
      }
    );

    console.log("PAYMENT RESPONSE:", result);

    return result;
  } catch (error) {
    console.error(
      "CREATE PAYMENT ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to create payment",
    };
  }
};