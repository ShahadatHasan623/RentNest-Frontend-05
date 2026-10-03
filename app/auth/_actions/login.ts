"use server";

import { cookies } from "next/headers";
import { loginUser } from "@/services/auth";
import { LoginPayload } from "@/services/auth";

export const loginAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const payload: LoginPayload = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  if (!payload.email || !payload.password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    const result = await loginUser(payload);

    if (!result.success || !result.data?.accessToken) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    if (result.data.refreshToken) {
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return {
      success: true,
      message: result.message || "Login successful",
      data: result.data.user,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong during login",
    };
  }
};