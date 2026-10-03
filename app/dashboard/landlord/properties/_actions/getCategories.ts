"use server";
import { getCategories } from "@/services/categories";
export const getCategoriesAction = async () => {
  try {
    return await getCategories();
  } catch (error) {
    console.error("GET CATEGORIES ACTION ERROR:", error);
    return [];
  }
};
