"use client";

import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PermissionGuard from "@/components/PermissionGuard";
import { useTheme } from "@/app/[lang]/providers";

export default function AdminRootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <AdminLayout isDark={isDark} toggleTheme={toggleTheme}>
      <PermissionGuard>{children}</PermissionGuard>
    </AdminLayout>
  );
}
