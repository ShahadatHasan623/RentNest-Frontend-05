import axiosInstance from "../lib/axios";
import { User } from "../types/auth";


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);

  return data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);

  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get("/users/me");

  return data?.data ?? data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");

  return data;
};