import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { RefreshToken } from "./app/types/tokens";
import { NextURL } from "next/dist/server/web/next-url";
import { API_URL } from "./lib/env";

export const runtime = 'experimental-edge'

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/verify-email/success",
];


function encodeCallbackUrl(url: NextURL) {
  let callbackUrl = url.pathname;
  if (url.search) {
    callbackUrl += url.search;
  }

  return encodeURIComponent(callbackUrl);
}

function redirectToLogin(url: NextURL) {
  const encodedCallbackUrl = encodeCallbackUrl(url);

  return Response.redirect(
    new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, url),
  );
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const { nextUrl } = req;
  const isLoggedIn = cookies().has("access_token");

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  if (!isLoggedIn) return redirectToLogin(nextUrl);

  const accessTokenCookie = req.cookies.get("access_token")?.value;
  const accessToken = accessTokenCookie && JSON.parse(accessTokenCookie);

  if (Date.now() / 1000 < accessToken.expiresIn) {
    return null;
  }

  const refreshTokenCookie = req.cookies.get("refresh_token")?.value;
  const refreshToken: RefreshToken =
    refreshTokenCookie && JSON.parse(refreshTokenCookie);

  if (Date.now() / 1000 > refreshToken.expiresIn) {
    const callbackUrl = encodeCallbackUrl(nextUrl);
    const response = NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl),
    );

    response.cookies.delete("user");
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }

  const tokensResponse = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Token-Id": String(refreshToken.tokenId),
      Authorization: `Bearer ${refreshToken.value}`,
    },
  });

  if (!tokensResponse.ok) {
    const callbackUrl = encodeCallbackUrl(nextUrl);
    const response = NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl),
    );

    response.cookies.delete("user");
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }

  const tokens = await tokensResponse.json();

  const response = NextResponse.next();

  response.cookies.set("access_token", JSON.stringify(tokens.accessToken), {
    httpOnly: true,
  });
  response.cookies.set("refresh_token", JSON.stringify(tokens.refreshToken), {
    httpOnly: true,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
