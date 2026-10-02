export type UserRole =
  | "TENANT"
  | "LANDLORD"
  | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "BANNED";

export interface User {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  status: UserStatus;

  profileImage?: string;

  createdAt?: string;
}