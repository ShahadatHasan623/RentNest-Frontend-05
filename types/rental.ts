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
  landlordId?: string;

  status: RentalRequestStatus;

  moveInDate?: string;
  duration?: number;
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

  landlord?: {
    id: string;
    name?: string;
    email?: string;
  };

  payment?: {
    id?: string;
    status?: string;
  };
}

export interface AdminRentalResponse {
  data: RentalRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}