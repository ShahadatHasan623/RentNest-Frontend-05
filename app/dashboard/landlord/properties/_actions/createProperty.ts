"use server";

import { createProperty } from "@/services/landlordProperties";
import type { CreatePropertyPayload } from "@/types/property";

export const createPropertyAction = async (
  payload: CreatePropertyPayload
) => {
  try {
    const result = await createProperty(payload);

    return result;
  } catch (error) {
    console.error("CREATE PROPERTY ACTION ERROR:", error);

    return {
      success: false,
      message: "Failed to create property",
    };
  }
};