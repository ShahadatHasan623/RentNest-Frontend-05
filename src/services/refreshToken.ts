"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          result?.message || "Failed to refresh access token",
      };
    }

    return result;
  } catch (error) {
    console.error("Refresh token error:", error);

    return {
      success: false,
      message: "Failed to fetch refresh token API",
    };
  }
};