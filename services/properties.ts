import { authFetch } from "@/lib/auth-fetch";
import axiosInstance from "@/lib/axios";
import { Property } from "@/types/property";

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
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.location) {
    searchParams.set("location", params.location);
  }

  if (params?.propertyType) {
    searchParams.set(
      "propertyType",
      params.propertyType
    );
  }

  if (params?.minPrice !== undefined) {
    searchParams.set(
      "minPrice",
      String(params.minPrice)
    );
  }

  if (params?.maxPrice !== undefined) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice)
    );
  }

  if (params?.amenities?.length) {
    searchParams.set(
      "amenities",
      params.amenities.join(",")
    );
  }

  const query = searchParams.toString();

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties${
      query ? `?${query}` : ""
    }`,
    {
      next: {
        revalidate: 60,
        tags: ["properties"],
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch properties"
    );
  }

  const result = await response.json();

  return result.data || [];
};

export const getPropertyById = async (
  id: string
): Promise<Property | null> => {
  try {
    const result = await authFetch(`/api/properties/${id}`);

    console.log("PROPERTY DETAILS:", result);

    if (!result?.success) {
      return null;
    }

    return result.data ?? null;
  } catch (error) {
    console.error("GET PROPERTY ERROR:", error);
    return null;
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data } = await axiosInstance.get("/api/properties");


    if (!data?.success) {
      return [];
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("GET ALL PROPERTIES ERROR:", error);
    return [];
  }
};