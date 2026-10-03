import { authFetch } from "@/lib/auth-fetch";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  activeStatus: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
}

export const getAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const result = await authFetch("/api/auth");

    console.log("ALL USERS:", result);

    if (!result?.success) return [];

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    return [];
  }
};

export const updateUserStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"
) => {
  try {
    return await authFetch(`/api/auth/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    return {
      success: false,
      message: "Failed to update user status",
    };
  }
};