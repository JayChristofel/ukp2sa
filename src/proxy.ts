import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const SESSION_COOKIE_NAME = "ukp2sa-session";
const locales = ["id", "en"];
const defaultLocale = "id";

const ADMIN_ROLES = ["superadmin", "admin", "presiden", "deputi", "operator"];
const PORTAL_ROLES = ["partner", "ngo", "operator"];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

/** Decode JWT payload tanpa verify (Edge-compatible). Verify dilakukan di API routes. */
function decodeJWTPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    // Cek expiry secara manual
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- SESSION DETECTION ---
  let session: any = null;

  // A. Web: Baca dari HTTP-Only Cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    const decoded = decodeJWTPayload(sessionToken);
    if (decoded) {
      session = { user: decoded };
    }
  }

  // B. Mobile: Baca dari Authorization header
  const authHeader = request.headers.get("authorization");
  if (!session && authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = decodeJWTPayload(token);
    if (decoded) {
      session = { user: decoded };
    }
  }

  // --- i18n REDIRECTION ---
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  // --- RBAC & AUTH ---
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0];
  const section = segments[1];

  const isAuthPage = section === "auth";
  const isAdminPage = section === "admin";
  const isPortalPage = section === "portal";
  const isMobileRequest = !!authHeader?.startsWith("Bearer ");

  const kick = (targetUrl: string) => {
    if (isMobileRequest) {
      return NextResponse.json({ error: "Unauthorized", code: 401 }, { status: 401 });
    }
    const url = new URL(targetUrl, request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  };

  // Protected routes — belum login
  if ((isAdminPage || isPortalPage) && !session) {
    return kick(`/${lang}/auth/login`);
  }

  // Admin RBAC
  if (isAdminPage && session?.user?.role) {
    if (!ADMIN_ROLES.includes(session.user.role)) {
      return kick(`/${lang}`);
    }
  }

  // Portal RBAC + Tenant Isolation
  if (isPortalPage && session?.user?.role) {
    if (!PORTAL_ROLES.includes(session.user.role)) {
      return kick(`/${lang}`);
    }

    const userRole = session.user.role;
    const userInstansiId = session.user.instansiId;

    if (["partner", "ngo"].includes(userRole) && !userInstansiId) {
      return kick(`/${lang}/auth/login`);
    }

    if (segments[2] === "partner") {
      const urlSegment = segments[3];
      if (urlSegment !== "id") {
        return kick(`/${lang}/portal/partner/id?id=${urlSegment || userInstansiId}`);
      }
      const urlInstansiId = request.nextUrl.searchParams.get("id");
      if (userInstansiId && urlInstansiId !== userInstansiId) {
        return kick(`/${lang}/portal/partner/id?id=${userInstansiId}`);
      }
    }
  }

  // Redirect kalo udah login tapi buka halaman auth
  if (isAuthPage && session) {
    const userInstansiId = session.user.instansiId;
    const redirectUrl = ADMIN_ROLES.includes(session.user.role)
      ? `/${lang}/admin`
      : userInstansiId
        ? `/${lang}/portal/partner/id?id=${userInstansiId}`
        : `/${lang}`;

    if (!isMobileRequest) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
