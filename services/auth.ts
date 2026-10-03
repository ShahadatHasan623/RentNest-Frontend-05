import { AuthResponse, AuthUser } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL = process.env.BACKEND_API_URL;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  return response.json();
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  return response.json();
};


export const getMe = async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const response = await fetch(
      `${API_URL}/api/auth/me`,
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const result = await response.json();

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};