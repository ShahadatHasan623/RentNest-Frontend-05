export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  status?: UserStatus;

  activeStatus: "ACTIVE" | "INACTIVE" | "BLOCKED";

  profileImage?: string;
  createdAt?: string;
}
export interface UserQuery {
  search?: string;
  page?: number;
  limit?: number;
}
