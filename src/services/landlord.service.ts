import axiosInstance from "../lib/axios";
import { Property } from "../types/property";


export interface CreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images: string[];
  isAvailable: boolean;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export const getMyProperties = async (): Promise<Property[]> => {
  const { data } = await axiosInstance.get("/landlord/properties");

  return data?.data?.result ?? data?.data ?? data;
};

export const getMyPropertyById = async (
  id: string
): Promise<Property> => {
  const { data } = await axiosInstance.get(`/landlord/properties/${id}`);

  return data?.data ?? data;
};

export const createProperty = async (
  payload: CreatePropertyPayload
) => {
  const { data } = await axiosInstance.post(
    "/landlord/properties",
    payload
  );

  return data;
};

export const updateProperty = async (
  id: string,
  payload: UpdatePropertyPayload
) => {
  const { data } = await axiosInstance.patch(
    `/landlord/properties/${id}`,
    payload
  );

  return data;
};

export const deleteProperty = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `/landlord/properties/${id}`
  );

  return data;
};

export const togglePropertyAvailability = async (
  id: string,
  isAvailable: boolean
) => {
  const { data } = await axiosInstance.patch(
    `/landlord/properties/${id}`,
    {
      isAvailable,
    }
  );

  return data;
};