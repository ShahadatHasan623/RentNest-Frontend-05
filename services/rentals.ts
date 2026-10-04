import { authFetch } from "@/lib/auth-fetch";
import { AdminRentalResponse } from "@/types/rental";

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

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data) ? result.data : [];
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

    // Pagination response
    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    // Normal array response
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
    const result = await authFetch(`/api/rentals/landlord/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return result;
  } catch (error) {
    console.error("UPDATE RENTAL STATUS ERROR:", error);
    return { success: false, message: "Failed to update rental status" };
  }
};
export const getAdminRentalRequests = async (): Promise<RentalRequest[]> => {
  try {
    const result = await authFetch("/api/admin/rentals");

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data?.data) ? result.data.data : [];
  } catch (error) {
    console.error("GET ADMIN RENTAL REQUESTS ERROR:", error);

    return [];
  }
};
