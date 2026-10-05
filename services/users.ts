import { authFetch } from "@/lib/auth-fetch";
import { User, UserQuery } from "@/types/user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  activeStatus: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface UsersResponse {
  users: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAllUsers = async (
  params?: UserQuery
): Promise<UsersResponse> => {
  const query = new URLSearchParams();

  query.set("page", String(params?.page || 1));
  query.set("limit", String(params?.limit || 10));

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  const result = await authFetch(
    `/api/auth?${query.toString()}`
  );

  if (!result?.success || !result?.data) {
    return {
      users: [],
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  return result.data;
};

export const getAllUsersForDashboard = async (): Promise<
  AdminUser[]
> => {
  const result = await authFetch(
    "/api/auth?limit=10000"
  );

  if (!result?.success || !result?.data) {
    return [];
  }

  return result.data.users || [];
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