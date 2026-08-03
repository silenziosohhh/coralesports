import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getClientIp } from "@/lib/edge/ip";
import { rateLimit, retryAfterSeconds } from "@/lib/edge/rate-limit";
import { PREVIEW_ADMIN_WITHOUT_LOGIN } from "@/lib/preview-mode";

const SIGNIN_PATH = "/auth/signin";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/tournaments/create" ||
    pathname === "/teams/create" ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications")
  );
}

function needsAdminRole(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
}

function isAdminPagePreview(pathname: string) {
  return PREVIEW_ADMIN_WITHOUT_LOGIN && pathname.startsWith("/admin") && !isApi(pathname);
}

function isApi(pathname: string) {
  return pathname.startsWith("/api/");
}

function isAuthApi(pathname: string) {
  return pathname.startsWith("/api/auth");
}

function sameOriginForUnsafeMethods(req: NextRequest) {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = req.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === req.nextUrl.host;
  } catch {
    return false;
  }
}

function isLikelyBotUserAgent(userAgent: string | null) {
  const ua = (userAgent || "").toLowerCase();
  if (!ua.trim()) return true;
  const bad = ["curl", "wget", "python", "httpclient", "aiohttp", "java", "go-http-client", "scrapy", "axios"];
  return bad.some((token) => ua.includes(token));
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent");
  const botLike = isLikelyBotUserAgent(ua);

  if (isApi(pathname) && !isAuthApi(pathname)) {
    const limit = botLike ? 60 : 240;
    const windowMs = 60_000;
    const bucket = rateLimit(`api:${ip}`, limit, windowMs);

    if (!bucket.ok) {
      const retryAfter = retryAfterSeconds(bucket.resetAt);
      return NextResponse.json(
        { error: "Too many requests", retryAfterSeconds: retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    if (pathname.startsWith("/api/admin")) {
      const token = await getToken({ req });
      const role = (token as any)?.role;
      const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
      if (!token || !isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!sameOriginForUnsafeMethods(req)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const adminBucket = rateLimit(`api:admin:${ip}`, botLike ? 15 : 60, 60_000);
      if (!adminBucket.ok) {
        const retryAfter = retryAfterSeconds(adminBucket.resetAt);
        return NextResponse.json(
          { error: "Too many requests", retryAfterSeconds: retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/store")) {
    const bucket = rateLimit(`store:${ip}`, botLike ? 80 : 240, 10 * 60_000);
    if (!bucket.ok) {
      const retryAfter = retryAfterSeconds(bucket.resetAt);
      return new NextResponse("Too many requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
  }

  if (isProtectedPath(pathname) && !isAdminPagePreview(pathname)) {
    const token = await getToken({ req });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = SIGNIN_PATH;
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (needsAdminRole(pathname)) {
      const role = (token as any)?.role;
      const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "same-origin");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
