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

/** Hostname yang diizinkan — selain ini ditolak (Host Header Injection fix) */
const ALLOWED_HOSTS = new Set([
  'ukp2sa.id',
  'www.ukp2sa.id',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
]);

/** Cek apakah hostname itu internal/private (cPanel Passenger sering pake ini) */
function isInternalHost(host: string): boolean {
  return (
    host.startsWith('10.') ||
    host.startsWith('172.') ||
    host.startsWith('192.168.') ||
    host.startsWith('0.') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host) // Any raw IP (behind Cloudflare = trusted)
  );
}

/** Pattern open redirect suspicious via query params */
const REDIRECT_PARAM_PATTERN = /[?&](url|redirect|next|return|returnTo|goto|destination|redir|out)=(https?:|%2F%2F|\/\/)/i;

/** Pattern file sensitif yang harus diblokir (VULN-007/008) */
const BLOCKED_PATTERNS = [
  /^\/.git/,
  /^\/.env/,
  /^\/.htaccess/,
  /^\/.htpasswd/,
  /\.(zip|tar|gz|bz2|7z|rar|bak|sql|dump|old)$/i,
  /^\/wp-(admin|login|content)/,
  /\/phpmyadmin/i,
  /\/xmlrpc\.php/,
];

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // --- HOST HEADER INJECTION PROTECTION ---
  // Izinin: domain resmi, subdomain, internal IP (Passenger), atau dev mode
  const isHostAllowed =
    ALLOWED_HOSTS.has(hostname) ||
    hostname.endsWith('.ukp2sa.id') ||
    isInternalHost(hostname) ||
    process.env.NODE_ENV === 'development';

  if (!isHostAllowed) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // --- OPEN REDIRECT PROTECTION ---
  const fullUrl = request.nextUrl.toString();
  if (REDIRECT_PARAM_PATTERN.test(fullUrl)) {
    const safeUrl = request.nextUrl.clone();
    safeUrl.pathname = `/${defaultLocale}`;
    safeUrl.search = '';
    return NextResponse.redirect(safeUrl);
  }

  // --- VULN-007/008: Block sensitive file access ---
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

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
  // SKIP redirection if it's a static file (has extension) or in /assets/
  const isStaticFile = pathname.includes(".") || pathname.startsWith("/assets/");
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale && !isStaticFile) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  const cspValue = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://static.cloudflareinsights.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://*.arcgisonline.com https://*.dicebear.com https://fonts.gstatic.com https://www.google-analytics.com https://static.cloudflareinsights.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://*.tilikan.id https://*.banjirsumatra.id https://api.open-meteo.com https://www.google-analytics.com https://static.cloudflareinsights.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';";

  // --- RBAC & AUTH ---
  // Public static files don't need RBAC
  if (isStaticFile) {
    const response = NextResponse.next();
    // Inject headers here too just to be safe
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    response.headers.set("Content-Security-Policy", cspValue);
    return response;
  }

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

  const response = NextResponse.next();

  // --- VULN-009: Inject security headers di SEMUA response ---
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=(self), interest-cohort=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Content-Security-Policy", cspValue);

  // Strip tech disclosure headers (VULN-003 defense in depth)
  response.headers.delete("x-turbo-charged-by");
  response.headers.delete("X-Powered-By");

  return response;
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
