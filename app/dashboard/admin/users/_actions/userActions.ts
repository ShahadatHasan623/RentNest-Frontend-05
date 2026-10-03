"use server";

import { updateUserStatus } from "@/services/users";

export const updateUserStatusAction = async (
  id: string,
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"
) => {
  try {
    return await updateUserStatus(id, status);
  } catch (error) {
    console.error("UPDATE USER STATUS ACTION ERROR:", error);

    return {
      success: false,
      message: "Failed to update user status",
    };
  }
};