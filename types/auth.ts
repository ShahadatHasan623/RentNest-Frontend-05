export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface UserProfile {
  id: string;
  image?: string | null;
  bio?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;

  role: UserRole;

  activeStatus: "ACTIVE" | "INACTIVE";

  image?: string | null;

  profile?: UserProfile | null;

  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;

  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
  };
}