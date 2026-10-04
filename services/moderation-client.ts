import { authFetch } from "@/lib/auth-fetch";

export const getPendingProperties = async () => {
  const result = await authFetch("/api/properties/admin/pending");

  if (!result?.success) {
    return [];
  }

  return result.data || [];
};
