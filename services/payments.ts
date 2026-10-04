import { authFetch } from "@/lib/auth-fetch";

export interface Payment {
  id: string;
  rentalRequestId: string;
  transactionId: string;
  amount: number;
  method: string;
  provider: string;
  status: string;
  paidAt?: string | null;
  createdAt?: string;

  rentalRequest?: {
    id: string;
    property?: {
      id: string;
      title: string;
      location?: string;
      rent?: number;
    };
  };
}

export const getMyPayments = async (): Promise<Payment[]> => {
  try {
    const result = await authFetch("/api/payments");
    if (!result?.success) return [];

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("GET MY PAYMENTS ERROR:", error);
    return [];
  }
};