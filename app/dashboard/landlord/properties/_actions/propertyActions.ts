/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
} from "@/services/landlordProperties";

export const updatePropertyAction = async (
  id: string,
  payload: any
) => {
  try {
    return await updateProperty(id, payload);
  } catch (error) {
    console.error("UPDATE PROPERTY ACTION ERROR:", error);

    return {
      success: false,
      message: "Failed to update property",
    };
  }
};

export const deletePropertyAction = async (id: string) => {
  try {
    return await deleteProperty(id);
  } catch (error) {
    console.error("DELETE PROPERTY ACTION ERROR:", error);

    return {
      success: false,
      message: "Failed to delete property",
    };
  }
};

export const togglePropertyAvailabilityAction = async (
  id: string,
  available: boolean
) => {
  try {
    return await togglePropertyAvailability(id, available);
  } catch (error) {
    console.error(
      "TOGGLE PROPERTY AVAILABILITY ACTION ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to update availability",
    };
  }
};