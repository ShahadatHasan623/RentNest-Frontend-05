import { authFetch } from "@/lib/auth-fetch";

export interface RentalRequest {
  id: string;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  moveInDate: string;
  duration: number;
  status: string;

  property?: {
    id: string;
    title: string;
    rent?: number;
    location?: string;
    images?: string[];
  };

  payment?: unknown[];
}

export const getMyRentals = async (): Promise<RentalRequest[]> => {
  try {
    const result = await authFetch("/api/rentals");

    console.log("MY RENTALS:", result);

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error("GET MY RENTALS ERROR:", error);
    return [];
  }
};

export const getRentalById = async (
  id: string
): Promise<RentalRequest | null> => {
  try {
    const result = await authFetch(`/api/rentals/${id}`);

    console.log("RENTAL DETAILS:", result);

    if (!result?.success) {
      return null;
    }

    return result.data ?? null;
  } catch (error) {
    console.error("GET RENTAL DETAILS ERROR:", error);
    return null;
  }
};

export const getLandlordRequests = async (): Promise<
  RentalRequest[]
> => {
  try {
    const result = await authFetch(
      "/api/rentals/landlord/requests"
    );

    console.log("LANDLORD REQUESTS:", result);

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error(
      "GET LANDLORD REQUESTS ERROR:",
      error
    );

    return [];
  }
};

export const updateRentalStatus = async (
  id: string,
  status: string
) => {
  try {
    const result = await authFetch(
      `/api/rentals/landlord/requests/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    );

    console.log("UPDATE RENTAL STATUS:", result);

    return result;
  } catch (error) {
    console.error(
      "UPDATE RENTAL STATUS ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to update rental status",
    };
  }
};