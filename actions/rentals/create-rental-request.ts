"use server";

import { revalidateTag } from "next/cache";
import { authFetch } from "@/lib/auth-fetch";

export const createRentalRequest = async (
  prevState: any,
  formData: FormData
) => {
  const payload = {
    propertyId: formData.get("propertyId"),
    message: formData.get("message"),
    moveInDate: formData.get("moveInDate"),
  };

  const result = await authFetch("/api/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (result.success) {
    revalidateTag("my-rentals", "max");
    revalidateTag("landlord-requests", "max");
  }

  return result;
};