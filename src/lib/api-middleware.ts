import { NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { cookies } from "next/headers";
import { ZodSchema } from "zod";
import { rateLimit } from "./rate-limit";
import { AuditService } from "@/services/AuditService";

export interface SecureRouteOptions {
  permission?: string;
  role?: string; // Legacy support
  roles?: string[]; // New: support multiple roles
  schema?: ZodSchema;
  limit?: number; // Custom rate limit
  windowMs?: number; // Custom window
  isPublic?: boolean; // New: allow public access with rate limiting
}

export function secureRoute(
  handler: (req: Request, context: { session: { user: any }; body?: any }) => Promise<NextResponse>,
  options: SecureRouteOptions = {}
) {
  return async (req: Request) => {
    try {
      // 0. Rate Limiting + Securing IP (Prevent IP Spoofing)
      const xff = req.headers.get("x-forwarded-for");
      const cfIp = req.headers.get("cf-connecting-ip");
      
      // Terbaik: Percaya pada Cloudflare IP dulu, kalau ga ada, ambil IP PERTAMA (yang asli) dari XFF
      const ip = cfIp || (xff ? xff.split(",")[0].trim() : "127.0.0.1");

      const rlResult = await rateLimit(ip, options.limit || 100, options.windowMs);
      
      if (!rlResult.success) {
        return NextResponse.json({ 
          success: false, 
          error: "Too Many Requests",
          retryAfter: new Date(rlResult.reset).toISOString() 
        }, { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rlResult.limit.toString(),
            "X-RateLimit-Remaining": rlResult.remaining.toString(),
            "X-RateLimit-Reset": rlResult.reset.toString()
          }
        });
      }

      // 1. Session check (Custom JWT) — Single cookie read, cached verification
      let sessionUser = null;

      // Cek header Authorization (Mobile/Postman) dulu
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        sessionUser = verifyJWT(token); // Now cached in jwt.ts LRU
      }

      // Kalo gak ada lewat header, cek lewat cookie (Web Dashboard)
      if (!sessionUser) {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (token) {
          sessionUser = verifyJWT(token); // Now cached in jwt.ts LRU
        }
      }

      // PUBLIC BYPASS Logic
      if (!sessionUser && !options.isPublic) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      const session = sessionUser ? { user: sessionUser } : { user: null };

      // 2. Role check (Strict) - Only if NOT public
      if (!options.isPublic) {
        const allowedRoles = options.roles || (options.role ? [options.role] : []);
        if (allowedRoles.length > 0) {
          const hasRole = allowedRoles.includes(session.user?.role) || session.user?.role === 'superadmin';
          if (!hasRole) {
            return NextResponse.json({ 
              success: false, 
              error: "Forbidden: You don't have the required role to access this resource" 
            }, { status: 403 });
          }
        }
      }

      // 3. Schema Validation
      let body;
      if (options.schema && ["POST", "PATCH", "PUT"].includes(req.method)) {
        const rawBody = await req.json().catch(() => ({}));
        const validation = options.schema.safeParse(rawBody);
        
        if (!validation.success) {
          return NextResponse.json({ 
            success: false, 
            error: "Validation failed", 
            details: validation.error.flatten() 
          }, { status: 400 });
        }
        body = validation.data;
      }

      return await handler(req, { session, body });
    } catch (error: any) {
      console.error("[API ERROR]", error);
      
      // Auto-log failure to Audit (Technical SITREP)
      // AuditService sekarang static import — no dynamic import overhead
      try {
        await AuditService.log({
          action: "API_CRASH",
          module: "SYSTEM",
          details: `Endpoint ${req.method} ${req.url} failed: ${error.message}`,
          level: "error",
          meta: { stack: process.env.NODE_ENV === 'development' ? error.stack : undefined }
        });
      } catch (logErr) {
        console.error("Failed to log API crash:", logErr);
      }

      return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server." }, { status: 500 });
    }
  };
}
