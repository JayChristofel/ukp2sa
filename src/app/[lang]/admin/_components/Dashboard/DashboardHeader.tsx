import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layouts";

interface DashboardHeaderProps {
  common: any;
  refreshData: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader = ({
  common,
  refreshData,
  isRefreshing,
}: DashboardHeaderProps) => {
  return (
    <PageHeader 
      title={
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="whitespace-nowrap">{common.dashboard}</span>
          <div className="flex items-center gap-1.5 md:gap-2 bg-primary/10 border border-primary/20 text-primary px-2.5 md:px-3 py-0.5 md:py-1 rounded-full">
            <span className="size-1.5 md:size-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
              {common.national_command}
            </span>
          </div>
        </div>
      }
      description={common.description}
      actions={
        <button
          onClick={refreshData}
          className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl font-bold hover:shadow-xl hover:shadow-primary-500/10 transition-all text-navy dark:text-white group"
        >
          <RefreshCw size={16} className={`${isRefreshing ? "animate-spin" : ""} md:size-[18px] group-hover:rotate-180 transition-transform duration-500`} />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest ">{common.sync}</span>
        </button>
      }
    />
  );
};
