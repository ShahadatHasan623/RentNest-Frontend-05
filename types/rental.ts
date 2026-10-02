export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export interface Rental {
  id: string;

  propertyId: string;

  tenantId: string;

  landlordId?: string;

  message?: string;

  moveInDate?: string;

  status: RentalStatus;

  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };

  tenant?: {
    id: string;
    name: string;
    email: string;
  };

  createdAt?: string;

  updatedAt?: string;
}