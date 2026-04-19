/**
 * Audit Log Interfaces
 */

export interface AuditLog {
  id?: string;
  _id?: string;
  action: string;
  module: "SYSTEM" | "FINANCIAL" | "AUTH" | "REPORTS" | "SETTINGS" | string;
  details: string;
  status: "Success" | "Warning" | "Error";
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  userName: string;
  diff?: Record<string, any> | null;
}

export interface AuditLogResponse {
  data: AuditLog[];
  stats: {
    totalEvents: number;
    securityGaps: number;
    activeSessions: number;
    integrity: {
      totalScore: number;
      dimensions: {
        completeness: number;
        accuracy: number;
        consistency: number;
      };
    };
  };
}

export interface CreateAuditLogInput {
  action: string;
  module: string;
  details: string;
  level?: "info" | "warn" | "error";
  status?: "Success" | "Warning" | "Error";
  user?: string;
  diff?: any;
  ua?: string;
}
