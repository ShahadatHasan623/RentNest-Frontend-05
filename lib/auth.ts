import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getAccessToken = async () => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // No token
  if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  // Check access token
  if (accessToken) {
    try {
      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      );

      return {
        success: true,
        accessToken,
      };
    } catch {
      // Access token expired/invalid
    }
  }

  // Check refresh token
  if (refreshToken) {
    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      );

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (result.success && typeof result.data?.accessToken === "string") {
        const newAccessToken = result.data.accessToken;
        accessToken = newAccessToken;

        cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        return {
          success: true,
          accessToken: newAccessToken,
        };
      }
    } catch {
      // Refresh token invalid
    }
  }

  return {
    success: false,
    message: "Session expired. Please login again.",
  };
};