"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import { Timer, Eye, Bell, Phone, Trash2 } from "lucide-react";
import { getCategoryIcon, getStatusColor, getProgressColor } from "./AssignmentHelpers";

interface TaskListRowProps {
  task: any;
  onPing: (assignee: string) => void;
  onDelete: (id: string, title: string) => void;
  onViewDetail: (task: any) => void;
}

export const TaskListRow = ({
  task,
  onPing,
  onDelete,
  onViewDetail,
}: TaskListRowProps) => {
  return (
    <Card
      className="p-4 border-none rounded-2xl shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all flex items-center gap-6 cursor-pointer"
      onClick={() => onViewDetail(task)}
    >
      <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
        {getCategoryIcon(task.category)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm text-navy dark:text-white uppercase truncate tracking-tight">
          {task.title}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
          {task.id} • {task.location}
        </p>
      </div>
      <div className="hidden md:flex flex-col items-end gap-1 px-4 border-x border-slate-100 dark:border-slate-800 min-w-[150px]">
        <Badge
          className={`rounded-md border-none font-black uppercase text-[7px] tracking-widest ${getStatusColor(
            task.status,
          )}`}
        >
          {task.status}
        </Badge>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Timer size={10} /> {task.updatedAt}
        </p>
      </div>
      <div className="hidden lg:flex flex-col w-32 gap-1.5 text-right px-4">
        <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
          Status Progres
        </p>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${getProgressColor(
              task.category,
            ).split(" ")[0]}`}
            style={{ width: `${task.progress || 10}%` }}
          />
        </div>
      </div>
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewDetail(task)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => onPing(task.assignee)}
          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
        >
          <Bell size={14} />
        </button>
        <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
          <Phone size={14} />
        </button>
        <button
          onClick={() => onDelete(task.id, task.title)}
          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  );
};
