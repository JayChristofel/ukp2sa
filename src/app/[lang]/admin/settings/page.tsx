"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Globe,
  Save,
  RefreshCw,
  Zap,
  Monitor,
  Layout,
  Clock,
  Server,
  Cloud,
  Search,
  Cpu,
  MailWarning,
  Plus,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, Button, Input, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/app/[lang]/providers";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

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

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy dark:text-white tracking-tight mb-2 uppercase">
            {s.title_main || "Global App Settings"}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Cpu size={14} className="text-primary" />{" "}
            {s.subtitle || "Core System Engine & Configuration"}
          </p>
        </div>
        <Button
          onClick={handleSave}
          loading={isSaving}
          className="px-8 py-4 shadow-glow-primary hover:translate-y-[-2px] transition-all"
        >
          {!isSaving && <Save size={16} />} {s.save_all || "Save All Changes"}
        </Button>
      </div>

      <Tabs
        defaultValue="branding"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="overflow-x-auto no-scrollbar pb-2">
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 flex w-max gap-2">
            <TabsTrigger
              value="branding"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Layout size={14} /> {s.tab_general || "General"}
            </TabsTrigger>
            <TabsTrigger
              value="localization"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Clock size={14} /> {s.tab_localization || "Localization"}
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Zap size={14} /> {s.tab_api || "API & Sync"}
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Shield size={14} /> {s.tab_security || "Security"}
            </TabsTrigger>
            <TabsTrigger
              value="infrastructure"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Server size={14} /> {s.tab_infra || "Infra"}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest gap-2 min-w-[120px]"
            >
              <Search size={14} /> {s.tab_analytics || "Analytics"}
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* --- BRANDING TAB --- */}
            <TabsContent value="branding" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-10 border-none rounded-[2.5rem] shadow-xl space-y-8">
                  <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <Monitor size={20} className="text-primary" />{" "}
                    {s.visual_identity || "Visual Identity"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{s.app_name || "App Name"}</Label>
                      <Input defaultValue="UKP2SA Situation Room" />
                    </div>
                    <div className="space-y-2">
                      <Label>{s.app_slogan || "App Slogan"}</Label>
                      <Input defaultValue="Monitor, Tindak Lanjut, Pulihkan." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{s.metadata_desc || "Metadata Description"}</Label>
                      <Textarea
                        defaultValue="Pusat Kendali Pemulihan Nasional UKP2SA: Memantau hasil capaian, penyerapan anggaran, dan sentimen publik."
                        className="rounded-3xl px-5 py-4 min-h-[100px]"
                      />
                    </div>
                  </div>
                </Card>
                <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {s.logo_assets || "Logo & Assets"}
                  </h3>
                  <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary transition-all">
                    <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Layout size={32} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-primary transition-colors tracking-widest text-center">
                      {s.upload_logo || "Upload Logo"}
                      <br />
                      <span className="lowercase font-bold opacity-60">
                        PNG/SVG Max 2MB
                      </span>
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* --- LOCALIZATION TAB --- */}
            <TabsContent value="localization" className="space-y-8">
              <Card className="p-10 border-none rounded-[2.5rem] shadow-xl">
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                  <Globe size={20} className="text-primary" />{" "}
                  {s.regional_config || "Regional Configuration"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label>{s.default_timezone || "Default Timezone"}</Label>
                    <Select defaultValue="jkt">
                      <SelectTrigger className="w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 px-5 font-bold">
                        <SelectValue
                          placeholder={s.select_timezone || "Pilih Timezone"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jkt">
                          Asia/Jakarta (GMT+7)
                        </SelectItem>
                        <SelectItem value="mks">
                          Asia/Makassar (GMT+8)
                        </SelectItem>
                        <SelectItem value="jyp">
                          Asia/Jayapura (GMT+9)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{s.default_language || "Default Language"}</Label>
                    <Select defaultValue="id">
                      <SelectTrigger className="w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 px-5 font-bold">
                        <SelectValue
                          placeholder={s.select_language || "Pilih Bahasa"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{s.currency_format || "Currency Format"}</Label>
                    <Select defaultValue="idr">
                      <SelectTrigger className="w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 px-5 font-bold">
                        <SelectValue
                          placeholder={s.select_currency || "Pilih Mata Uang"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idr">IDR (Rp)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* --- API & SYNC TAB --- */}
            <TabsContent value="api" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                      <Zap size={20} className="text-amber-500" />{" "}
                      {s.api_endpoints || "API Endpoints"}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEndpoint}
                      className="rounded-xl h-10 px-4 border-primary/20 text-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-widest gap-2"
                    >
                      <Plus size={14} /> {s.add_api || "Add API"}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <AnimatePresence>
                      {endpoints.map((ep) => (
                        <motion.div
                          key={ep.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, x: -10 }}
                          className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group relative"
                        >
                          <button
                            onClick={() => removeEndpoint(ep.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                              {s.endpoint_name || "Endpoint Name"}
                            </Label>
                            <Input
                              placeholder="e.g. Satellite Feed API"
                              value={ep.label}
                              onChange={(e) =>
                                updateEndpoint(ep.id, "label", e.target.value)
                              }
                              className="bg-white dark:bg-slate-900 border-none h-10 px-4 text-xs font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                              Base URL
                            </Label>
                            <Input
                              placeholder="https://api.example.com/v1"
                              value={ep.url}
                              onChange={(e) =>
                                updateEndpoint(ep.id, "url", e.target.value)
                              }
                              className="bg-white dark:bg-slate-900 border-none h-10 px-4 text-xs font-mono"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {endpoints.length === 0 && (
                      <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          No API endpoints configured
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6">
                  <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <RefreshCw size={20} className="text-violet-500" />{" "}
                    {s.sync_policy || "Sync Policy"}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-black text-sm text-navy dark:text-white uppercase tracking-tight">
                          {s.real_time_polling || "Real-time Polling"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {s.polling_desc || "Auto update data dashboard"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {s.polling_interval || "Polling Interval (Detik)"}
                      </Label>
                      <Input type="number" defaultValue={30} />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* --- SECURITY TAB --- */}
            <TabsContent value="security" className="space-y-8">
              <Card className="p-10 border-none rounded-[2.5rem] shadow-xl">
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                  <Shield size={20} className="text-rose-500" />{" "}
                  {s.access_governance || "Access Governance"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-sm text-navy dark:text-white uppercase tracking-tight">
                          {s.maintenance_mode || "Maintenance Mode"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {s.maintenance_desc ||
                            "Hanya pengembang & pimpinan yang bisa login."}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-sm text-navy dark:text-white uppercase tracking-tight">
                          {s.public_auth || "Public Auth"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {s.public_auth_desc ||
                            "Izinkan pembuatan akun masyarakat umum."}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                    <Label className="text-[10px] uppercase tracking-widest mb-3">
                      {s.ip_whitelist || "IP Whitelist (Admin only)"}
                    </Label>
                    <Textarea
                      placeholder="Masukkan IP dipisahkan koma..."
                      rows={3}
                      className="bg-white dark:bg-slate-900 border-none font-mono text-xs opacity-50"
                      disabled
                    />
                    <p className="mt-3 text-[9px] font-medium text-slate-400 italic">
                      {s.ip_restricted_desc ||
                        "Fitur Restricted IP hanya tersedia dengan lisensi Enterprise."}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* --- INFRASTRUCTURE TAB --- */}
            <TabsContent value="infrastructure" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-10 border-none rounded-[2.5rem] shadow-xl space-y-8">
                  <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <MailWarning size={20} className="text-primary" />{" "}
                    {s.smtp_server || "SMTP Server (Mail)"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input defaultValue="smtp.ukp2sa.go.id" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SMTP Port</Label>
                        <Input type="number" defaultValue={587} />
                      </div>
                      <div className="space-y-2">
                        <Label>{s.encryption || "Encryption"}</Label>
                        <Select defaultValue="tls">
                          <SelectTrigger className="w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 px-5 font-bold">
                            <SelectValue
                              placeholder={s.encryption || "Encryption"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6">
                  <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <Cloud size={20} className="text-emerald-500" />{" "}
                    {s.storage || "Storage"}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Select defaultValue="local">
                        <SelectTrigger className="w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 px-5 font-bold">
                          <SelectValue
                            placeholder={s.select_storage || "Pilih Storage"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Storage</SelectItem>
                          <SelectItem value="s3">AWS S3 Bucket</SelectItem>
                          <SelectItem value="gcs">Google Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        {s.free_space || "Free Space"}: 78%
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[9px] font-black uppercase px-3"
                      >
                        Purge
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* --- ANALYTICS TAB --- */}
            <TabsContent value="analytics" className="space-y-8">
              <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-8">
                <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Search size={20} className="text-primary" />{" "}
                  {s.metrics_monitoring || "Metrics & Monitoring"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input defaultValue="G-XXXXXXXXXX" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sentry DSN (Error Tracking)</Label>
                    <Input
                      defaultValue="https://99999999@sentry.io/123456"
                      className="font-mono"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
