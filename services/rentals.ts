import { authFetch } from "@/lib/auth-fetch";
import type { RentalRequest } from "@/types/rental";

export const getMyRentals = async (): Promise<RentalRequest[]> => {
  try {
    const result = await authFetch("/api/rentals");

    if (!result?.success) {
      return [];
    }

    // Direct array response
    if (Array.isArray(result.data)) {
      return result.data;
    }

    // Paginated/object response
    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    return [];
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

    if (!result?.success) {
      return null;
    }

    return result.data ?? null;
  } catch (error) {
    console.error("GET RENTAL DETAILS ERROR:", error);
    return null;
  }
};

export const getLandlordRequests = async (): Promise<RentalRequest[]> => {
  try {
    const result = await authFetch("/api/rentals/landlord/requests");

    if (!result?.success) {
      return [];
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error("GET LANDLORD REQUESTS ERROR:", error);
    return [];
  }
};

export const updateRentalStatus = async (
  id: string,
  status: "APPROVED" | "REJECTED" | "COMPLETED"
) => {
  try {
    return await authFetch(`/api/rentals/landlord/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error("UPDATE RENTAL STATUS ERROR:", error);

    return {
      success: false,
      message: "Failed to update rental status",
    };
  }
};

export const getAdminRentalRequests = async (): Promise<RentalRequest[]> => {
  try {
    const result = await authFetch("/api/admin/rentals");

    if (!result?.success) {
      return [];
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error("GET ADMIN RENTAL REQUESTS ERROR:", error);
    return [];
  }
};