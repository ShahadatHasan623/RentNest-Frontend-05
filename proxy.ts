import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./services/refreshToken";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

const PUBLIC_ROUTES = [
  "/",
  "/properties",
  "/about",
  "/payment/success",
  "/payment/cancel",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;

  // =========================================
  // Refresh Access Token
  // =========================================

  let newAccessToken: string | null = null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      newAccessToken = result.data.accessToken;

      accessToken = result.data.accessToken;

      decodedAccessToken = jwtUtils.verifyToken(
        result.data.accessToken,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  // =========================================
  // Get User Role
  // =========================================

  let userRole: string | null = null;

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role as string;
  }

  // =========================================
  // Response
  // =========================================

  const response = NextResponse.next();

  // New access token browser cookie-তে পাঠাবে
  if (newAccessToken) {
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });
  }

  // =========================================
  // Invalid Token
  // =========================================

  if (accessToken && !decodedAccessToken?.success && !refreshToken) {
    response.cookies.delete("accessToken");
    accessToken = undefined;
  }

  // =========================================
  // Auth Routes
  // =========================================

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  if (isAuthRoute && userRole) {
    if (userRole === "TENANT") {
      return NextResponse.redirect(
        new URL("/dashboard/tenant", request.url)
      );
    }

    if (userRole === "LANDLORD") {
      return NextResponse.redirect(
        new URL("/dashboard/landlord", request.url)
      );
    }

    if (userRole === "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard/admin", request.url)
      );
    }
  }

  // =========================================
  // Public Route
  // =========================================

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  // =========================================
  // Not Logged In
  // =========================================

  if (!userRole && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL("/auth/login", request.url);

    redirectUrl.searchParams.set(
      "redirectTo",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(redirectUrl);
  }

  // =========================================
  // Role Protection
  // =========================================

  if (pathname.startsWith("/dashboard/tenant")) {
    if (userRole !== "TENANT") {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  if (pathname.startsWith("/dashboard/landlord")) {
    if (userRole !== "LANDLORD") {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};