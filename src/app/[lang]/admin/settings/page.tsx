"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  Zap,
  Layout,
  Server,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

// Modular Components
import { SettingsHeader } from "./_components/SettingsHeader";
import { GeneralTab } from "./_components/GeneralTab";
import { LocalizationTab } from "./_components/LocalizationTab";
import { APISyncTab } from "./_components/APISyncTab";
import { SecurityTab } from "./_components/SecurityTab";
import { InfrastructureTab } from "./_components/InfrastructureTab";
import { AnalyticsTab } from "./_components/AnalyticsTab";

export default function AppSettingsPage() {
  const dict = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("branding");
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "SETTINGS_VIEW",
      "SYSTEM",
      "User accessed the global application settings and engine configuration.",
    );
  }, [logActivity]);

  const [endpoints, setEndpoints] = useState([
    {
      id: 1,
      label: "Banjir Sumatra API",
      url: "https://api.banjirsumatra.id/api/v1",
    },
    {
      id: 2,
      label: "Tilikan API",
      url: "https://superdashapi.tilikan.id/api/v1",
    },
  ]);

  const addEndpoint = () => {
    const newId =
      endpoints.length > 0 ? Math.max(...endpoints.map((e) => e.id)) + 1 : 1;
    setEndpoints([...endpoints, { id: newId, label: "", url: "" }]);
  };

  const removeEndpoint = (id: number) => {
    setEndpoints(endpoints.filter((e) => e.id !== id));
  };

  const updateEndpoint = (
    id: number,
    field: "label" | "url",
    value: string,
  ) => {
    setEndpoints(
      endpoints.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    logActivity(
      "SETTINGS_SAVED",
      "SYSTEM",
      "User updated global application settings.",
    );
    addNotification({
      title: "Konfigurasi Diperbarui",
      description:
        "Pengaturan sistem global telah berhasil disimpan dan diterapkan.",
      type: "system",
      priority: "medium",
    });
    setTimeout(() => setIsSaving(false), 1500);
  };

  const s = dict?.settings || {};

  if (!dict) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8">
      <SettingsHeader s={s} isSaving={isSaving} onSave={handleSave} />

      <Tabs
        defaultValue="branding"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="overflow-x-auto no-scrollbar pb-2">
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] mb-8 flex w-max gap-2 border dark:border-slate-800">
            {[
              { id: "branding", label: s.tab_general || "General", icon: Layout },
              { id: "localization", label: s.tab_localization || "Localization", icon: Clock },
              { id: "api", label: s.tab_api || "API & Sync", icon: Zap },
              { id: "security", label: s.tab_security || "Security", icon: Shield },
              { id: "infrastructure", label: s.tab_infra || "Infra", icon: Server },
              { id: "analytics", label: s.tab_analytics || "Analytics", icon: Search },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-2xl px-6 py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-xl font-black uppercase text-[10px] tracking-widest gap-2.5 min-w-[140px] transition-all"
              >
                <tab.icon size={16} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="outline-none"
          >
            <TabsContent value="branding" className="m-0 outline-none">
              <GeneralTab s={s} />
            </TabsContent>

            <TabsContent value="localization" className="m-0 outline-none">
              <LocalizationTab s={s} />
            </TabsContent>

            <TabsContent value="api" className="m-0 outline-none">
              <APISyncTab 
                s={s} endpoints={endpoints} 
                onAddEndpoint={addEndpoint} 
                onRemoveEndpoint={removeEndpoint} 
                onUpdateEndpoint={updateEndpoint} 
              />
            </TabsContent>

            <TabsContent value="security" className="m-0 outline-none">
              <SecurityTab s={s} />
            </TabsContent>

            <TabsContent value="infrastructure" className="m-0 outline-none">
              <InfrastructureTab s={s} />
            </TabsContent>

            <TabsContent value="analytics" className="m-0 outline-none">
              <AnalyticsTab s={s} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
