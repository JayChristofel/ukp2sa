import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  type: "payment" | "report" | "system" | "assignment";
  status: "unread" | "read";
  priority?: "low" | "medium" | "high";
  actionLabel?: string;
  link?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  lastSeenReportId: string | null;
  lastSeenPaymentId: string | null;
  addNotification: (notif: Omit<NotificationItem, "id" | "status" | "date" | "time">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setLastSeenReportId: (id: string) => void;
  setLastSeenPaymentId: (id: string) => void;
  clearAll: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  syncWithExternals: () => Promise<void>;
}


export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get): NotificationState => ({
      notifications: [],
      lastSeenReportId: null,
      lastSeenPaymentId: null,
      
      addNotification: async (notif) => {
        try {
          // Push to backend DB API
          const res = await fetch("/api/admin/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notif),
          });
          if (res.ok) {
            get().fetchNotifications();
          }
        } catch (error) {
          console.error("Local addNotification failed", error);
        }
      },

      markAsRead: async (id) => {
        // Optimistic UI update
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: "read" } : n
          ),
        }));

        // Send to backend
        try {
          await fetch("/api/admin/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "mark_read", notificationId: id })
          });
        } catch {
          console.error("markAsRead API error");
        }
      },

      markAllAsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, status: "read" })),
        }));

        // Send to backend
        try {
          await fetch("/api/admin/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "mark_all_read" })
          });
        } catch {
          console.error("markAllAsRead API error");
        }
      },

      deleteNotification: async (id) => {
        // Optimistic update
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));

        try {
          await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
        } catch {
          console.error("delete API error");
        }
      },

      setLastSeenReportId: (id) => set({ lastSeenReportId: id }),
      setLastSeenPaymentId: (id) => set({ lastSeenPaymentId: id }),

      clearAll: async () => {
        set({ notifications: [] });
        try {
          await fetch(`/api/admin/notifications?clearAll=true`, { method: "DELETE" });
        } catch {
          console.error("clearAll API error");
        }
      },

      fetchNotifications: async () => {
        try {
          const res = await fetch("/api/admin/notifications");
          if (!res.ok) return;
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            set({ notifications: json.data });
          }
        } catch (error) {
          console.error("fetchNotifications error", error);
        }
      },

      syncWithExternals: async () => {
        try {
          const res = await fetch("/api/admin/notifications/sync");
          if (res.ok) {
            get().fetchNotifications();
          }
        } catch (error) {
          console.error("syncWithExternals error", error);
        }
      },
    }),
    {
      name: "ukp2sa-notifications",
    }
  )
);
