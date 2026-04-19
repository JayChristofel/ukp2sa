import { Target as TargetIcon } from "lucide-react";
import { PageHeader } from "@/components/layouts";

interface KPIHeaderProps {
  title: string;
  subtitle: string;
}

export const KPIHeader = ({ title, subtitle }: KPIHeaderProps) => {
  return (
    <PageHeader 
      title={title}
      subtitle={
        <>
          <TargetIcon size={14} className="text-primary" /> {subtitle}
        </>
      }
    />
  );
};
