import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getAccessToken = async () => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET as string;
  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

  let accessValid = false;

  if (accessToken) {
    try {
      jwt.verify(accessToken, accessSecret);
      accessValid = true;
    } catch {
      accessValid = false;
    }
  }

  if (accessValid) {
    return {
      success: true,
      accessToken,
    };
  }

  if (refreshToken) {
    try {
      jwt.verify(refreshToken, refreshSecret);

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
        const refreshedAccessToken = result.data.accessToken;

        cookieStore.set("accessToken", refreshedAccessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        accessToken = refreshedAccessToken;

        return {
          success: true,
          accessToken,
        };
      }
    } catch {
      return {
        success: false,
        message: "Session expired!",
      };
    }
  }

  return {
    success: false,
    message: "Authentication failed!",
  };
};