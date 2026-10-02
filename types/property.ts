export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  city?: string;
  area?: string;
  rent: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities: string[];
  images: string[];
  available: boolean;
  landlord?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    activeStatus?: boolean;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
