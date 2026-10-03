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

export const updateProperty = async (
  id: string,
  payload: Partial<CreatePropertyPayload>
) => {
  try {
    return await authFetch(
      `/api/properties/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  } catch (error) {
    console.error(
      "UPDATE PROPERTY ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to update property",
    };
  }
};

export const deleteProperty = async (
  id: string
) => {
  try {
    return await authFetch(
      `/api/properties/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error(
      "DELETE PROPERTY ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to delete property",
    };
  }
};

export const togglePropertyAvailability =
  async (
    id: string,
    available: boolean
  ) => {
    try {
      return await authFetch(
        `/api/properties/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            available,
          }),
        }
      );
    } catch (error) {
      console.error(
        "TOGGLE AVAILABILITY ERROR:",
        error
      );

      return {
        success: false,
        message:
          "Failed to update availability",
      };
    }
  };