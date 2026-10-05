import { Property } from "@/types/property";

export interface PropertyQuery {
  search?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
};

/* =========================================
   GET ALL PROPERTIES
   PUBLIC API
========================================= */

export const getProperties = async (
  params?: PropertyQuery
): Promise<Property[]> => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    if (params?.location) {
      searchParams.set("location", params.location);
    }

    if (params?.propertyType) {
      searchParams.set("propertyType", params.propertyType);
    }

    if (params?.minPrice !== undefined) {
      searchParams.set("minPrice", String(params.minPrice));
    }

    if (params?.maxPrice !== undefined) {
      searchParams.set("maxPrice", String(params.maxPrice));
    }

    if (params?.amenities?.length) {
      searchParams.set(
        "amenities",
        params.amenities.join(",")
      );
    }

    const query = searchParams.toString();

    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      console.error(
        "BACKEND_API_URL is not configured"
      );

      return [];
    }

    const response = await fetch(
      `${baseUrl}/api/properties${
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
      console.error(
        "GET PROPERTIES FAILED:",
        response.status,
        response.statusText
      );

      return [];
    }

    const result = await response.json();

    if (!result?.success) {
      console.error(
        "GET PROPERTIES API ERROR:",
        result?.message
      );

      return [];
    }

    // Support both:
    // { data: [...] }
    // { data: { data: [...] } }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    return [];
  } catch (error) {
    console.error(
      "GET PROPERTIES ERROR:",
      error
    );

    return [];
  }
};

/* =========================================
   GET PROPERTY BY ID
   PUBLIC API
========================================= */

export const getPropertyById = async (
  id: string
): Promise<Property | null> => {
  try {
    if (!id) {
      console.error(
        "GET PROPERTY: Property ID missing"
      );

      return null;
    }

    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      console.error(
        "BACKEND_API_URL is not configured"
      );

      return null;
    }

    const response = await fetch(
      `${baseUrl}/api/properties/${id}`,
      {
        next: {
          revalidate: 60,
          tags: [`property-${id}`],
        },
      }
    );

    if (!response.ok) {
      console.error(
        "GET PROPERTY BY ID FAILED:",
        response.status,
        response.statusText
      );

      return null;
    }

    const result = await response.json();

    if (!result?.success) {
      console.error(
        "GET PROPERTY BY ID API ERROR:",
        result?.message
      );

      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error(
      "GET PROPERTY DETAILS ERROR:",
      error
    );

    return null;
  }
};

/* =========================================
   GET ALL PROPERTIES
   ALTERNATIVE API
========================================= */

export const getAllProperties = async (): Promise<
  Property[]
> => {
  try {
    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      console.error(
        "BACKEND_API_URL is not configured"
      );

      return [];
    }

    const response = await fetch(
      `${baseUrl}/api/properties`,
      {
        next: {
          revalidate: 60,
          tags: ["properties"],
        },
      }
    );

    if (!response.ok) {
      console.error(
        "GET ALL PROPERTIES FAILED:",
        response.status,
        response.statusText
      );

      return [];
    }

    const result = await response.json();

    if (!result?.success) {
      return [];
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    return [];
  } catch (error) {
    console.error(
      "GET ALL PROPERTIES ERROR:",
      error
    );

    return [];
  }
};