"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PortalSidebarLayout } from "@/components/layouts";
import { useI18n, useTheme } from "@/app/[lang]/providers";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = useI18n();
  const { isDark, toggleTheme } = useTheme();

  const d = dict?.portal || {};
  const pathname = usePathname();
  const isPartner = pathname.includes("/partner/");
  const title = isPartner
    ? d.portal_partner || "Portal Mitra"
    : d.portal_program || "Portal Program";
  const subtitle = isPartner
    ? d.monitoring_budget || "Pemantauan & Anggaran"
    : d.monitoring_outcome || "Pemantauan Hasil";

  return (
    <PortalSidebarLayout
      portalTitle={title}
      portalSubtitle={subtitle}
      isDark={isDark}
      toggleTheme={toggleTheme}
    >
      {children}
    </PortalSidebarLayout>
  );
}
