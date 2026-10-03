import { authFetch } from "@/lib/auth-fetch";
import { RentalRequest } from "@/types/rental";


export const getLandlordRequests = async (): Promise<
  RentalRequest[]
> => {
  try {
    const result = await authFetch(
      "/api/rentals/landlord/requests"
    );

    console.log(
      "LANDLORD REQUESTS:",
      result
    );

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