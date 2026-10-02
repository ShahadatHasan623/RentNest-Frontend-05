import axiosInstance from "../lib/axios";
import { Property } from "../types/property";

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  area?: string;
  rent: number;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  amenities: string[];
  images?: string[];
  categoryId: string;
  available: boolean;
}

export type UpdatePropertyPayload =
  Partial<CreatePropertyPayload>;

export const getMyProperties = async (): Promise<Property[]> => {
  const { data } = await axiosInstance.get("/properties");

  return data?.data?.data ?? data?.data ?? data;
};

export const getMyPropertyById = async (
  id: string
): Promise<Property> => {
  const { data } = await axiosInstance.get(
    `/properties/${id}`
  );

  return data?.data ?? data;
};

export const createProperty = async (
  payload: CreatePropertyPayload
) => {
  const { data } = await axiosInstance.post(
    "/properties",
    payload
  );

  return data;
};

export const updateProperty = async (
  id: string,
  payload: UpdatePropertyPayload
) => {
  const { data } = await axiosInstance.patch(
    `/properties/${id}`,
    payload
  );

  return data;
};

export const deleteProperty = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `/properties/${id}`
  );

  return data;
};

export const togglePropertyAvailability = async (
  id: string,
  available: boolean
) => {
  const { data } = await axiosInstance.patch(
    `/properties/${id}`,
    {
      available,
    }
  );

  return data;
};