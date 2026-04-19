import { Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layouts";

interface FinancialHeaderProps {
  title: string;
  partnerName: string;
  onNewInput: () => void;
  lang: string;
  inputLabel: string;
}

export const FinancialHeader = ({
  title,
  partnerName,
  onNewInput,
  inputLabel,
}: FinancialHeaderProps) => {
  return (
    <PageHeader 
      title={title}
      subtitle={
        <>
          <Activity size={18} className="text-primary" /> {partnerName}
        </>
      }
      actions={
        <Button
          onClick={onNewInput}
          className="w-full md:w-auto rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-glow-primary"
        >
          <Plus size={16} className="mr-2" /> {inputLabel}
        </Button>
      }
    />
  );
};
