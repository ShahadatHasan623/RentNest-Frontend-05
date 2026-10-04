import { authFetch } from "@/lib/auth-fetch";

export const getAllPropertiesForAdmin = async () => {
  const result = await authFetch(
    "/api/properties/admin/all"
  );

  return result?.data ?? [];
};

export const updatePropertyModeration = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  return await authFetch(
    `/api/properties/${id}/moderation`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );
};