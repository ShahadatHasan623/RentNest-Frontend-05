export interface Property {
  id: string;
  title: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  area?: string;
  rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  amenities: string[];
  images: string[];
  available: boolean;
  landlordId: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  area?: string;
  rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  amenities: string[];
  images: string[];
  available: boolean;
  categoryId: string;
}