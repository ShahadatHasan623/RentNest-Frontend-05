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

// Create Review → Login Required
export const createReview = async (payload: CreateReviewPayload) => {
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

// Property Details → PUBLIC Reviews
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
      return emptyResult;
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/reviews/property/${propertyId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "GET PROPERTY REVIEWS FAILED:",
        response.status
      );

      return emptyResult;
    }

    const result = await response.json();

    if (!result?.success) {
      return emptyResult;
    }

    return result.data ?? emptyResult;
  } catch (error) {
    console.error("GET PROPERTY REVIEWS ERROR:", error);

    return emptyResult;
  }
};

// Tenant Dashboard → My Reviews → Login Required
export const getMyReviews = async (): Promise<MyReview[]> => {
  try {
    const result = await authFetch("/api/reviews/my-reviews");

    if (!result?.success) {
      return [];
    }

    return result.data ?? [];
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);

    return [];
  }
};