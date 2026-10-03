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
  };
}

export interface PropertyReviews {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export const createReview = async (
  payload: CreateReviewPayload
) => {
  try {
    const result = await authFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("CREATE REVIEW:", result);

    return result;
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return {
      success: false,
      message: "Failed to create review",
    };
  }
};

export const getPropertyReviews = async (
  propertyId: string
): Promise<PropertyReviews> => {
  try {
    const result = await authFetch(
      `/api/reviews/property/${propertyId}`
    );

    console.log("PROPERTY REVIEWS:", result);

    if (!result?.success) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };
    }

    return (
      result.data ?? {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      }
    );
  } catch (error) {
    console.error("GET PROPERTY REVIEWS ERROR:", error);

    return {
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
    };
  }
};