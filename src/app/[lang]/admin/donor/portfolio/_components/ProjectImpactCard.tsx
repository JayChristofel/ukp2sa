"use client";

import React from "react";
import { Card, Button, Badge } from "@/components/ui";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectImpactCardProps {
  project: any;
  common: any;
  onSelect: (project: any) => void;
}

export const ProjectImpactCard = ({
  project,
  common,
  onSelect,
}: ProjectImpactCardProps) => {
  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-6 overflow-hidden relative group font-display">
      <div className="w-full md:w-48 h-48 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-800">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name || ""}
            width={192}
            height={192}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <ImageIcon
            size={40}
            className="text-slate-300 dark:text-slate-600 opacity-50"
          />
        )}
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <Badge className="bg-primary/10 text-primary border-none rounded-lg font-black uppercase text-[11px] tracking-widest px-3 py-1">
            {project.location}
          </Badge>
          <span className="text-lg font-black text-primary">
            {project.progress}%
          </span>
        </div>
        <h4 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight">
          {project.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {project.description}
        </p>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>{common.progress || "Progress"}</span>
            <span className="text-[10px]">82% {common.of_milestone || "of Milestone"} 4</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSelect(project)}
        className="absolute top-4 right-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 hover:text-primary backdrop-blur-sm shadow-lg border-none"
      >
        <ArrowUpRight size={20} />
      </Button>
    </Card>
  );
};
