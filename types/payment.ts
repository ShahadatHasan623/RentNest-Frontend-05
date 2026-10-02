export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

export interface Payment {
  id: string;

  rentalId: string;

  tenantId: string;

  amount: number;

  status: PaymentStatus;

  transactionId?: string;

  paymentUrl?: string;

  createdAt?: string;
}