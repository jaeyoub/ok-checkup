import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";
import UserHeader from "@/components/UserHeader";

interface ProgressHeaderProps {
  completed: number;
  total: number;
}

const ProgressHeader = ({ completed, total }: ProgressHeaderProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                OK금융 업무 점검
              </h1>
              <p className="text-xs text-muted-foreground">업무 점검 체크리스트</p>
            </div>
          </div>
          <UserHeader />
        </div>
        <div className="flex items-center gap-3">
          <Progress
            value={percentage}
            className="h-2 flex-1 bg-secondary [&>div]:bg-red-500 [&>div]:transition-all [&>div]:duration-500"
          />
          <span className="text-sm font-semibold text-primary tabular-nums whitespace-nowrap">
            {completed}/{total}
          </span>
        </div>
      </div>
    </header>
  );
};

export default ProgressHeader;
