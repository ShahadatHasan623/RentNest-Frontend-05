export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface RentalRequest {
  id: string;

  propertyId: string;
  tenantId: string;
  landlordId: string;

  startDate?: string;
  message?: string;

  status: RentalStatus;

  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
    images?: string[];
  };

  tenant?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  createdAt?: string;
}