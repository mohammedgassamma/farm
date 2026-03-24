// middleware.js (in root directory)
import { NextResponse } from "next/server";
import { APP_ROUTES } from "./constants/appRoute";
import { authFirebase } from "./firebaseAuth";
import { isTokenExpired } from "./lib/utils";

export async function middleware(request: any) {
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  const isInvalidToken = isTokenExpired(token);

  const { pathname } = request.nextUrl;

  // Define your route types
  const isAuthRoute = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP].includes(pathname);

  if (isInvalidToken) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(APP_ROUTES.HOME_SCREEN, request.url)
      );
    }
    return NextResponse.next();
  }

  // If no token and trying to access protected route
  if (!token) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }

  // If has token and trying to access auth routes (login/signup)
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.HOME_SCREEN, request.url));
  }

  // Verify token for protected routes
  if (token) {
    try {
      // const isValid = await verifyFirebaseToken(token);
      const isValid = true; // Temporarily bypassing token verification

      if (!isValid) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

async function verifyFirebaseToken(token: string) {
  try {
    // Call your API route to verify token
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

// Configure which routes to run middleware on
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|manifest.json|site.webmanifest|manifest.webmanifest|icons|screenshots).*)",
  ],
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  // matcher: [],
};
