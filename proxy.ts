import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { cookies } from "next/headers";
import { getNewAccessToken } from "./services/refreshToken";


const AUTH_ROUTES = ["/auth/login", "/auth/register"];

const PUBLIC_ROUTES = [
  "/",
  "/properties",
  "/about",
  "/payment/success",
  "/payment/cancel",
];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStroe = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Verify the access token
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

  // Refresh access token
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStroe.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  // Get user role
  let userRole = null;

  if (!decodedAccessToken?.success) {
    cookieStroe.delete("accessToken");
  }

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  // =========================================
  // Auth Routes
  // =========================================

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "TENANT") {
      return NextResponse.redirect(
        new URL("/dashboard/tenant", request.url)
      );
    } else if (userRole === "LANDLORD") {
      return NextResponse.redirect(
        new URL("/dashboard/landlord", request.url)
      );
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard/admin", request.url)
      );
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // =========================================
  // Public / Auth Route Check
  // =========================================

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  // Not logged in and trying to access protected route
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL("/auth/login", request.url);

    redirectUrl.searchParams.set(
      "redirectTo",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(redirectUrl);
  }

  // =========================================
  // Role Based Dashboard Protection
  // =========================================

  if (
    pathname.startsWith("/dashboard/tenant") &&
    userRole !== "TENANT"
  ) {
    return NextResponse.redirect(
      new URL("/not-found", request.url)
    );
  } else if (
    pathname.startsWith("/dashboard/landlord") &&
    userRole !== "LANDLORD"
  ) {
    return NextResponse.redirect(
      new URL("/not-found", request.url)
    );
  } else if (
    pathname.startsWith("/dashboard/admin") &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/not-found", request.url)
    );
  } else if (
    pathname.startsWith("/auth/login") &&
    accessToken
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  } else if (
    pathname.startsWith("/auth/register") &&
    accessToken
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  // =========================================
  // Continue
  // =========================================

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};