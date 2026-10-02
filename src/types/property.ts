export interface PropertyCategory {
  id: string;
  name: string;
}

export interface Property {
  id: string;

  title: string;
  description?: string;

  location?: string;
  address?: string;
  city?: string;
  area?: string;

  rent: number;

  categoryId: string;

  category?: PropertyCategory;

  bedrooms?: number;
  bathrooms?: number;

  size: number;

  amenities: string[];

  images?: string[];

  available: boolean;

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };

  createdAt?: string;
}