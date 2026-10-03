"use server";

import { getLandlordRequests } from "@/services/landlordRequests";

export const getLandlordRequestsAction =
  async () => {
    try {
      return await getLandlordRequests();
    } catch (error) {
      console.error(
        "GET LANDLORD REQUESTS ACTION ERROR:",
        error
      );

      return [];
    }
  };