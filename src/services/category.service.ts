import axiosInstance from "../lib/axios";


export interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get("/categories");

  return data?.data ?? [];
};