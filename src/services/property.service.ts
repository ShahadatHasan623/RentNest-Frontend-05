import axiosInstance from "../lib/axios";
import { Property } from "../types/property";


export interface PropertyQuery {
  search?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export const getProperties = async (
  params?: PropertyQuery
): Promise<Property[]> => {
  const { data } = await axiosInstance.get(
    "/properties",
    { params }
  );

  return data?.data?.result ?? data?.data ?? data;
};

export const getPropertyById = async (
  id: string
): Promise<Property> => {
  const { data } = await axiosInstance.get(
    `/properties/${id}`
  );

  return data?.data ?? data;
};