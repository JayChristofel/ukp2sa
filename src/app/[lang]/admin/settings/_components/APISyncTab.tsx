"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, Trash2, RefreshCw } from "lucide-react";
import { Card, Button, Input, Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";

interface APISyncTabProps {
  s: any;
  endpoints: any[];
  onAddEndpoint: () => void;
  onRemoveEndpoint: (id: number) => void;
  onUpdateEndpoint: (id: number, field: "label" | "url", value: string) => void;
}

export const APISyncTab = ({
  s,
  endpoints,
  onAddEndpoint,
  onRemoveEndpoint,
  onUpdateEndpoint,
}: APISyncTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-8 bg-white dark:bg-navy/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Zap size={20} className="text-amber-500" />{" "}
              {s.api_endpoints || "API Endpoints"}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddEndpoint}
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
                    onClick={() => onRemoveEndpoint(ep.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 pl-1">
                      {s.endpoint_name || "Endpoint Name"}
                    </Label>
                    <Input
                      placeholder="e.g. Satellite Feed API"
                      value={ep.label}
                      onChange={(e) =>
                        onUpdateEndpoint(ep.id, "label", e.target.value)
                      }
                      className="bg-white dark:bg-slate-900 border-none h-11 px-5 text-xs font-black rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 pl-1">
                      Base URL
                    </Label>
                    <Input
                      placeholder="https://api.example.com/v1"
                      value={ep.url}
                      onChange={(e) =>
                        onUpdateEndpoint(ep.id, "url", e.target.value)
                      }
                      className="bg-white dark:bg-slate-900 border-none h-11 px-5 text-xs font-mono rounded-xl"
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

        <Card className="p-10 border-none rounded-[2.5rem] shadow-xl space-y-6 bg-white dark:bg-navy/50">
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
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                {s.polling_interval || "Polling Interval (Detik)"}
              </Label>
              <Input
                type="number"
                defaultValue={30}
                className="h-12 bg-slate-50 dark:bg-slate-900 border-none px-6 font-black rounded-2xl"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
