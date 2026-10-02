import { Property } from "@/types/property";

export interface PropertyQuery {
  search?: string;
  location?: string;
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

 
  if (params?.minPrice !== undefined) {
    searchParams.set("minPrice", String(params.minPrice));
  }

  if (params?.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }

  if (params?.amenities?.length) {
    searchParams.set("amenities", params.amenities.join(","));
  }

  const query = searchParams.toString();

  const res = await fetch(
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

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  const result = await res.json();

  return result.data || [];
};