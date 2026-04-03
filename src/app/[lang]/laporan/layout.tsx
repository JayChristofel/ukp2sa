"use client";

import React from "react";
import { PortalSidebarLayout } from "@/components/layouts";

export default function LaporanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalSidebarLayout
      portalTitle="Pusat Laporan"
      portalSubtitle="Transparansi & Respons"
    >
      {children}
    </PortalSidebarLayout>
  );
}
