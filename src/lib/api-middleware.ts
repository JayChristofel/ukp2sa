import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ZodSchema } from "zod";
import { rateLimit } from "./rate-limit";

export interface SecureRouteOptions {
  permission?: string;
  role?: string;
  schema?: ZodSchema;
  limit?: number; // Custom rate limit
  windowMs?: number; // Custom window
}

export function secureRoute(
  handler: (req: Request, context: { session: any; body?: any }) => Promise<NextResponse>,
  options: SecureRouteOptions = {}
) {
  return async (req: Request) => {
    try {
      // 0. Rate Limiting (Prevent Brute force/DoS)
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
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

      // 1. Session check (NextAuth v5)
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      // 2. Role/Permission check (optional - to be implemented fully with RBAC logic)
      if (options.role && session.user.role !== options.role && session.user.role !== 'superadmin') {
        return NextResponse.json({ success: false, error: "Forbidden: Role mismatch" }, { status: 403 });
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
      return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
  };
}
