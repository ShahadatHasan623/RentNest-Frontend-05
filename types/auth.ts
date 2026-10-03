export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  profileImage?: string;
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