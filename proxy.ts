import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./services/refreshToken";


// ===============================
// ROUTES
// ===============================

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
];

const PUBLIC_ROUTES = [
  "/",
  "/properties",
  "/about",
  "/payment/success",
  "/payment/cancel",
];

const ROLE_ROUTES = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
} as const;

// ===============================
// PROXY
// ===============================

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();

  let accessToken =
    request.cookies.get("accessToken")?.value;

  const refreshToken =
    request.cookies.get("refreshToken")?.value;

  // ===============================
  // VERIFY ACCESS TOKEN
  // ===============================

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;

  // ===============================
  // VERIFY REFRESH TOKEN
  // ===============================

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;

  // ===============================
  // REFRESH ACCESS TOKEN
  // ===============================

  if (
    !decodedAccessToken?.success &&
    decodedRefreshToken?.success
  ) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken =
        result.data.accessToken;

      cookieStore.set(
        "accessToken",
        newAccessToken,
        {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          sameSite: "lax",
          secure:
            process.env.NODE_ENV ===
            "production",
          path: "/",
        }
      );

      accessToken = newAccessToken;

      decodedAccessToken =
        jwtUtils.verifyToken(
          accessToken as string,
          process.env.JWT_ACCESS_SECRET as string
        );
    }
  }

  // ===============================
  // USER ROLE
  // ===============================

  let userRole: string | null = null;

  if (
    decodedAccessToken?.success &&
    decodedAccessToken.data
  ) {
    userRole = (
      decodedAccessToken.data as JwtPayload
    ).role as string;
  }

  // ===============================
  // INVALID ACCESS TOKEN
  // ===============================

  if (
    accessToken &&
    !decodedAccessToken?.success
  ) {
    cookieStore.delete("accessToken");

    accessToken = undefined;
    userRole = null;
  }

  // ===============================
  // AUTH ROUTES
  // ===============================

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // ===============================
  // PUBLIC ROUTES
  // ===============================

  const isPublicRoute =
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

  // ===============================
  // LOGGED-IN USER + AUTH PAGE
  // ===============================

  if (accessToken && isAuthRoute) {
    if (
      userRole === "TENANT"
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/tenant",
          request.url
        )
      );
    }

    if (
      userRole === "LANDLORD"
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/landlord",
          request.url
        )
      );
    }

    if (
      userRole === "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/admin",
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  // ===============================
  // PROTECTED ROUTE
  // ===============================

  if (
    !accessToken &&
    !isPublicRoute &&
    !isAuthRoute
  ) {
    const redirectUrl =
      new URL(
        "/auth/login",
        request.url
      );

    redirectUrl.searchParams.set(
      "redirect",
      pathname +
        request.nextUrl.search
    );

    return NextResponse.redirect(
      redirectUrl
    );
  }

  // ===============================
  // TENANT ROUTE
  // ===============================

  if (
    pathname.startsWith(
      "/dashboard/tenant"
    )
  ) {
    if (userRole !== "TENANT") {
      return NextResponse.redirect(
        new URL(
          "/not-found",
          request.url
        )
      );
    }
  }

  // ===============================
  // LANDLORD ROUTE
  // ===============================

  if (
    pathname.startsWith(
      "/dashboard/landlord"
    )
  ) {
    if (userRole !== "LANDLORD") {
      return NextResponse.redirect(
        new URL(
          "/not-found",
          request.url
        )
      );
    }
  }

  // ===============================
  // ADMIN ROUTE
  // ===============================

  if (
    pathname.startsWith(
      "/dashboard/admin"
    )
  ) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(
          "/not-found",
          request.url
        )
      );
    }
  }

  // ===============================
  // FINAL RESPONSE
  // ===============================

  return NextResponse.next();
}

// ===============================
// MATCHER
// ===============================

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};