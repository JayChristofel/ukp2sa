import React from "react";
import { Maximize2, Minimize2, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapOverlayControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const MapOverlayControls: React.FC<MapOverlayControlsProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={onToggleFullscreen}
        className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-2xl shadow-2xl transition-all border-2 border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95"
        title={isFullscreen ? "Minimize" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      <button
        onClick={onToggleSidebar}
        className={cn(
          "p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl transition-all border-2 border-white dark:border-slate-800 hover:scale-105 active:scale-95",
          isSidebarOpen && "bg-rose-500 dark:bg-rose-500 text-white",
        )}
      >
        {isSidebarOpen ? <X size={18} /> : <Filter size={18} />}
      </button>
    </div>
  );
};
