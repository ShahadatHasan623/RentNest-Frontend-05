"use server";

import {
  updatePropertyModeration,
} from "@/services/moderation";

export const moderateProperty = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  if (!id) {
    throw new Error("Property ID is required");
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid moderation status");
  }

  return await updatePropertyModeration(
    id,
    status
  );
};