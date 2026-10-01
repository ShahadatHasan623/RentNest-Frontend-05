import axiosInstance from "../lib/axios";


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

export const loginUser = async (
  payload: LoginPayload
) => {
  const { data } = await axiosInstance.post(
    "/auth/login",
    payload
  );

  return data;
};

export const registerUser = async (
  payload: RegisterPayload
) => {
  const { data } = await axiosInstance.post(
    "/auth/register",
    payload
  );

  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get("/auth/me");

  return data?.data ?? data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post(
    "/auth/logout"
  );

  return data;
};