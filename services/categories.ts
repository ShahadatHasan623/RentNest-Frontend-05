import { authFetch } from "@/lib/auth-fetch";

export interface Category {
  id: string;
  name: string;
}
export const getCategories = async (): Promise<Category[]> => {
  try {
    const result = await authFetch("/api/categories");
    console.log("CATEGORIES:", result);
    if (!result?.success) {
      return [];
    }
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return [];
  }
};
