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

// My Reviews-এর জন্য
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

// Create Review
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

// Property Details → Customer Reviews
export const getPropertyReviews = async (
  propertyId: string
): Promise<PropertyReviews> => {
  try {
    if (!propertyId) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };
    }

    const result = await authFetch(`/api/reviews/property/${propertyId}`);


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

// Tenant Dashboard → My Reviews
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
