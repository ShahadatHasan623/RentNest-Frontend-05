export interface Review {
  id: string;

  propertyId: string;

  tenantId: string;

  rating: number;

  comment: string;

  tenant?: {
    id: string;
    name: string;
    profileImage?: string;
  };

  createdAt?: string;
}