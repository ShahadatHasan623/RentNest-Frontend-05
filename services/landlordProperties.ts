import { authFetch } from "@/lib/auth-fetch";
import type {
  Property,
  CreatePropertyPayload,
} from "@/types/property";

export const getMyProperties = async (): Promise<Property[]> => {
  try {
    const result = await authFetch("/api/properties");

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("GET MY PROPERTIES ERROR:", error);
    return [];
  }
};

export const createProperty = async (
  payload: CreatePropertyPayload
) => {
  try {
    const result = await authFetch("/api/properties", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    return {
      success: false,
      message: "Failed to create property",
    };
  }
};