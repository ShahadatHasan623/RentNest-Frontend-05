"use server";
import { cookies } from "next/headers";
export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "refresh token not found!",
    };
  }

  const url = `${process.env.BACKEND_API_URL}/api/auth/refresh-token`;

  const res = await fetch(url, {
   method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: "no-cache",
  });

  const result = await res.json();

  return result;
};
