export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "ROOM"
  | "OFFICE"
  | "SHOP";

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: PropertyType;

  bedrooms?: number;
  bathrooms?: number;

  amenities?: string[];

  images: string[];

  isAvailable: boolean;

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };

  createdAt?: string;
}