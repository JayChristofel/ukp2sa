import { z } from "zod";

// Audit Logs Validation
export const auditSchema = z.object({
  action: z.string().min(3).max(100),
  module: z.string().min(2).max(50),
  details: z.string().min(1),
  level: z.enum(["info", "warn", "error"]).optional(),
  user: z.string().optional(),
  ip: z.string().optional(),
  ua: z.string().optional(),
  diff: z.any().optional(),
});

// Notifications Validation
export const notificationSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(3),
  type: z.enum(["payment", "report", "system", "assignment"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  actionLabel: z.string().optional(),
  link: z.string().optional(),
  externalId: z.string().optional(),
});

// User Management (Admin Only)
export const userAdminSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
  password: z.string().min(8).optional(),
});

// Payment Webhook (Basic check)
export const paymentWebhookSchema = z.object({
  transaction_id: z.string(),
  status: z.string(),
  order_id: z.string(),
  gross_amount: z.string().or(z.number()),
  signature_key: z.string().optional(),
});
