"use client";

import React from "react";
import Header from "@/components/Header";
import { FooterSection } from "@/components/sections";
import { useTheme } from "@/app/[lang]/providers";
import MobileLayout from "@/components/layouts/MobileLayout";

// Flag build-time buat bedain Web vs Mobile App
const IS_MOBILE_APP =
  process.env.NEXT_PUBLIC_BUILD_MODE === "mobile" ||
  process.env.BUILD_MODE === "mobile";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark, toggleTheme } = useTheme();

  // 1. Build khusus Mobile App (APK/IPA) -> Pake MobileLayout with Bottom Nav
  if (IS_MOBILE_APP) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <MobileLayout>
          <div className="flex flex-col gap-12 px-2 py-6">{children}</div>
        </MobileLayout>
      </div>
    );
  }

  // 2. Web Portal (Browser) -> Pake Header (Hamburger di Mobile/Tablet)
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="relative flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 md:pt-32 pb-20 flex flex-col gap-16 md:gap-32">
        {children}
      </main>

      <FooterSection />
    </div>
  );
}
