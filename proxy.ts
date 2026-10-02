import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./src/services/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = ["/", "/properties", "/news", "/about"];

const ROLE_ROUTES = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
} as const;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // ----------------------------------------
  // 1. Verify Access Token
  // ----------------------------------------

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  // ----------------------------------------
  // 2. Verify Refresh Token
  // ----------------------------------------

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;

  // ----------------------------------------
  // 3. Generate New Access Token
  // ----------------------------------------

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      accessToken = newAccessToken;

      decodedAccessToken = jwtUtils.verifyToken(
        newAccessToken,
        process.env.JWT_ACCESS_SECRET as string
      );

      const response = NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      // Continue processing with this response
      return handleRoute(
        request,
        pathname,
        accessToken,
        decodedAccessToken,
        response
      );
    }
  }

  // ----------------------------------------
  // 4. Get User Role
  // ----------------------------------------

  let userRole: string | null = null;

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role as string | null;
  }

  // ----------------------------------------
  // 5. Invalid Access Token
  // ----------------------------------------

  if (accessToken && !decodedAccessToken?.success) {
    accessToken = undefined;
  }

  // ----------------------------------------
  // 6. Handle Routes
  // ----------------------------------------

  return handleRoute(
    request,
    pathname,
    accessToken,
    decodedAccessToken,
    NextResponse.next(),
    userRole
  );
}

function handleRoute(
  request: NextRequest,
  pathname: string,
  accessToken: string | undefined,
  decodedAccessToken: any,
  response: NextResponse,
  userRole?: string | null
) {
  // ----------------------------------------
  // Route Types
  // ----------------------------------------

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isTenantRoute = pathname.startsWith("/dashboard/tenant");

  const isLandlordRoute = pathname.startsWith("/dashboard/landlord");

  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  const isDashboardRoute = pathname.startsWith("/dashboard");

  // ----------------------------------------
  // 7. Authenticated User Visiting Login/Register
  // ----------------------------------------

  if (accessToken && isAuthRoute) {
    return redirectUserByRole(request, userRole);
  }

  // ----------------------------------------
  // 8. Protected Route Without Authentication
  // ----------------------------------------

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  // ----------------------------------------
  // 9. Dashboard Without Valid Token
  // ----------------------------------------

  if (isDashboardRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ----------------------------------------
  // 10. Tenant Route Protection
  // ----------------------------------------

  if (isTenantRoute && userRole !== "TENANT") {
    return redirectUserByRole(request, userRole);
  }

  // ----------------------------------------
  // 11. Landlord Route Protection
  // ----------------------------------------

  if (isLandlordRoute && userRole !== "LANDLORD") {
    return redirectUserByRole(request, userRole);
  }

  // ----------------------------------------
  // 12. Admin Route Protection
  // ----------------------------------------

  if (isAdminRoute && userRole !== "ADMIN") {
    return redirectUserByRole(request, userRole);
  }

  // ----------------------------------------
  // 13. Continue
  // ----------------------------------------

  return response;
}

function redirectUserByRole(request: NextRequest, role?: string | null) {
  if (role === "TENANT") {
    return NextResponse.redirect(new URL(ROLE_ROUTES.TENANT, request.url));
  }

  if (role === "LANDLORD") {
    return NextResponse.redirect(new URL(ROLE_ROUTES.LANDLORD, request.url));
  }

  if (role === "ADMIN") {
    return NextResponse.redirect(new URL(ROLE_ROUTES.ADMIN, request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
