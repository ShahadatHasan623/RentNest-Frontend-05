import { authFetch } from "@/lib/auth-fetch";

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;

  tenant?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface PropertyReviews {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface MyReview extends Review {
  property?: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    address?: string;
    rent?: number;
    images?: string[];
  };
}

/* =========================================
   CREATE REVIEW
   LOGIN REQUIRED
========================================= */

export const createReview = async (
  payload: CreateReviewPayload
) => {
  try {
    const result = await authFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return {
      success: false,
      message: "Failed to create review",
    };
  }
};

/* =========================================
   GET PROPERTY REVIEWS
   PUBLIC API
========================================= */

export const getPropertyReviews = async (
  propertyId: string
): Promise<PropertyReviews> => {
  const emptyResult: PropertyReviews = {
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
  };

  try {
    if (!propertyId) {
      console.error("PROPERTY REVIEW: Property ID missing");
      return emptyResult;
    }

    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      console.error("BACKEND_API_URL is not configured");
      return emptyResult;
    }

    const response = await fetch(
      `${baseUrl}/api/reviews/property/${propertyId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "GET PROPERTY REVIEWS FAILED:",
        response.status,
        response.statusText
      );

      return emptyResult;
    }

    const result = await response.json();


    if (!result?.success) {
      console.error(
        "PROPERTY REVIEWS API ERROR:",
        result?.message
      );

      return emptyResult;
    }

    const data = result.data;

    if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.reviews)
    ) {
      return {
        averageRating: Number(data.averageRating) || 0,
        totalReviews:
          Number(data.totalReviews) || data.reviews.length,
        reviews: data.reviews,
      };
    }

    if (
      data?.data &&
      typeof data.data === "object" &&
      Array.isArray(data.data.reviews)
    ) {
      return {
        averageRating: Number(data.data.averageRating) || 0,
        totalReviews:
          Number(data.data.totalReviews) ||
          data.data.reviews.length,
        reviews: data.data.reviews,
      };
    }

    console.error(
      "INVALID PROPERTY REVIEWS RESPONSE:",
      result
    );

    return emptyResult;
  } catch (error) {
    console.error(
      "GET PROPERTY REVIEWS ERROR:",
      error
    );

    return emptyResult;
  }
};

/* =========================================
   GET MY REVIEWS
   LOGIN REQUIRED
========================================= */

export const getMyReviews = async (): Promise<MyReview[]> => {
  try {
    const result = await authFetch("/api/reviews/my-reviews");

    if (!result?.success) {
      return [];
    }

    return Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);

    return [];
  }
};