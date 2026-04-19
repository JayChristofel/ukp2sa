"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import { AlertTriangle, MapPin, Clock, Phone, Eye, Bell, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCategoryIcon, getStatusColor, getProgressColor, getProgressTextColor } from "./AssignmentHelpers";
import { useI18n } from "@/app/[lang]/providers";

interface TaskCardProps {
  task: any;
  onPing: (assignee: string) => void;
  onDelete: (id: string, title: string) => void;
  onViewDetail: (task: any) => void;
  isLarge?: boolean;
  locale: any;
}

export const TaskCard = ({
  task,
  onPing,
  onDelete,
  onViewDetail,
  isLarge = false,
  locale,
}: TaskCardProps) => {
  const taskDate = task.createdAt ? new Date(task.createdAt) : new Date();
  const validDate = isNaN(taskDate.getTime()) ? new Date() : taskDate;
  const d = useI18n().assignments;

  const timeLabel = formatDistanceToNow(validDate, {
    addSuffix: true,
    locale,
  });

  return (
    <Card
      className={`h-full border-none rounded-[2rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group transition-all hover:bg-white/60 dark:hover:bg-slate-900/60 p-6 flex flex-col cursor-pointer hover:ring-2 hover:ring-primary/20 ${
        isLarge ? "border-primary/20 border" : ""
      }`}
      onClick={() => onViewDetail(task)}
    >
      <div
        className="flex justify-between items-start mb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform">
            {getCategoryIcon(task.category)}
          </div>
          <div>
            <Badge
              className={`rounded-lg border-none font-black uppercase text-[8px] tracking-widest ${getStatusColor(
                task.status,
              )}`}
            >
              {task.status}
            </Badge>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">
              {task.id}
            </p>
          </div>
        </div>
        <div
          className={`px-2.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${
            task.priority === "Critical"
              ? "bg-rose-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
          }`}
        >
          <AlertTriangle size={10} /> {task.priority}
        </div>
      </div>

      <h4
        className={`font-black text-navy dark:text-white uppercase tracking-tighter mb-4 line-clamp-2 ${
          isLarge ? "text-2xl" : "text-lg"
        }`}
      >
        {task.title}
      </h4>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-rose-500" /> {task.location}
          </span>
          <span className="flex items-center gap-1.5 max-w-[120px] truncate">
            <Clock size={12} className="text-amber-500" /> {timeLabel}
          </span>
        </div>

        {isLarge && (
          <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex-1">
              <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                <span>{d.label_urgency || "Urgency"}</span>
                <span>{task.urgencyScore}%</span>
              </div>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${task.urgencyScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Progres Capaian</span>
            <span className={`font-black ${getProgressTextColor(task.category)}`}>
              {task.progress || 10}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getProgressColor(
                task.category,
              )}`}
              style={{ width: `${task.progress || 10}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex -space-x-2">
          <div
            className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black"
            title={task.assignee || "Unassigned"}
          >
            {(task.assignee || "U").charAt(0)}
          </div>
          <button
            className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 text-white flex items-center justify-center"
            title="Call Coordinator"
          >
            <Phone size={12} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail(task)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onPing(task.assignee)}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <Bell size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id, task.title)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};
