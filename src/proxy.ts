import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from "next-auth/jwt";
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const { auth } = NextAuth(authConfig); // Pake Auth helper dari config yang EDGE-SAFE

const locales = ['id', 'en'];
const defaultLocale = 'id';

// Roles Access Definition
const ADMIN_ROLES = ['superadmin', 'admin', 'presiden', 'deputi', 'operator'];
const PORTAL_ROLES = ['partner', 'ngo', 'operator'];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

export const proxy = auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  
  // 🛡️ PRODUCTION DEBUG LOG (Check your cPanel Node.js logs)
  if (process.env.NODE_ENV === "production") {
    console.log(`[🛡️ PROXY] Attempting access to: ${pathname}`);
  }

  // 1. --- UNIFIED AUTH: Multi-Channel Session Detection ---
  // A. NextAuth v5 standard session (Cookies)
  let session = req.auth; 

  // B. Mobile Bearer Token Injection (Authorization: Bearer <token>)
  const authHeader = req.headers.get("authorization");
  if (!session && authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const isProd = process.env.NODE_ENV === "production";
      const sessionTokenName = isProd ? "__Secure-authjs.session-token" : "authjs.session-token";

      const decodedUser = await decode({
        token,
        secret: process.env.AUTH_SECRET as string,
        salt: sessionTokenName,
      });

      if (decodedUser) {
        if (isProd) console.log(`[📱 MOBILE AUTH] Validated user: ${decodedUser.email}`);
        session = { user: decodedUser } as any;
      }
    } catch {
      console.warn("Invalid or Expired Mobile Token Attempted.");
    }
  }

  // 1. --- i18n REDIRECTION ---
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, req.url)
    );
  }

  // 2. --- RBAC & AUTH AUTHORIZATION ---
  const segments = pathname.split('/').filter(Boolean);
  const lang = segments[0];
  const section = segments[1];

  const isAuthPage = section === 'auth';
  const isAdminPage = section === 'admin';
  const isPortalPage = section === 'portal';

  const isMobileRequest = !!req.headers.get("authorization")?.startsWith("Bearer ");

  // Utility buat handle "Tendangan" (Redirect buat Web, JSON buat Mobile)
  const kick = (targetUrl: string) => {
    if (isMobileRequest) {
      return NextResponse.json({ error: "Unauthorized or Forbidden", code: 401 }, { status: 401 });
    }
    const url = new URL(targetUrl, req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  };

  // Auth Protection Logic
  if ((isAdminPage || isPortalPage) && !session) {
    return kick(`/${lang}/auth/login`);
  }

  if (isAdminPage && session?.user?.role) {
    if (!ADMIN_ROLES.includes(session.user.role)) {
      return kick(`/${lang}`);
    }
  }

  if (isPortalPage && session?.user?.role) {
    if (!PORTAL_ROLES.includes(session.user.role)) {
      return kick(`/${lang}`);
    }

    // 🛡️ TENANT ISOLATION: User hanya bisa akses instansi miliknya sendiri
    const userRole = session.user.role;
    const userInstansiId = (session.user as any).instansiId;
    
    // User role partner/ngo WAJIB punya instansiId
    if (['partner', 'ngo'].includes(userRole) && !userInstansiId) {
      console.error(`[SECURITY] User ${session.user.email} with role ${userRole} is missing instansiId.`);
      return kick(`/${lang}/auth/login`);
    }

    // Cek apakah user lagi di /portal/partner/...
    if (segments[2] === 'partner') {
      const urlSegment = segments[3];
      
      // Kalo segment-nya bukan 'id', berarti ini link legacy/dynamic -> ALAHIN ke static 'id'
      if (urlSegment !== 'id') {
        const targetId = urlSegment || userInstansiId;
        return kick(`/${lang}/portal/partner/id?id=${targetId}`);
      }

      const urlInstansiId = req.nextUrl.searchParams.get("id");

      // Kalo instansiId di URL beda sama punya user → TENDANG ke instansi sendiri
      if (userInstansiId && urlInstansiId !== userInstansiId) {
        return kick(`/${lang}/portal/partner/id?id=${userInstansiId}`);
      }
    }
  }

  if (isAuthPage && session) {
    const userInstansiId = (session.user as any).instansiId;
    const redirectUrl = ADMIN_ROLES.includes(session.user.role) 
      ? `/${lang}/admin` 
      : userInstansiId 
        ? `/${lang}/portal/partner/id?id=${userInstansiId}`
        : `/${lang}`;
    
    // Lo gak butuh redirect kalo lo manggil api login dari mobile, lo butuh json response yg udh ada di route api
    if (!isMobileRequest) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)']
};
