"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

import dynamic from "next/dynamic";

const HeroSection = dynamic(() =>
  import("@/components/sections/HeroSection").then((m) => m.HeroSection),
);
const MissionSection = dynamic(() =>
  import("@/components/sections/MissionSection").then((m) => m.MissionSection),
);
const MapSection = dynamic(() =>
  import("@/components/sections/MapSection").then((m) => m.MapSection),
);
const ProgramSection = dynamic(() =>
  import("@/components/sections/ProgramSection").then((m) => m.ProgramSection),
);
const PartnersSection = dynamic(() =>
  import("@/components/sections/PartnersSection").then(
    (m) => m.PartnersSection,
  ),
);
const FAQSection = dynamic(() =>
  import("@/components/sections/FooterSection").then((m) => m.FAQSection),
);

import AnalysisCharts from "@/components/AnalysisCharts";
import ReportSection from "@/components/ReportSection";

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
  </div>
);

export default function HomePage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <HeroSection />
      <MissionSection />
      <MapSection />
      <AnalysisCharts />
      <ProgramSection />
      <PartnersSection />
      <ReportSection />
      <FAQSection />
    </Suspense>
  );
}
