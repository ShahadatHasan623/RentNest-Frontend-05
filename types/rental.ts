export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface RentalRequest {
  id: string;

  propertyId: string;
  tenantId: string;

  status: RentalRequestStatus;

  message?: string;

  createdAt: string;

  property?: {
    id: string;
    title: string;
    location?: string;
    rent?: number;
    images?: string[];
  };

  tenant?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface AdminRentalResponse {
  data: RentalRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}