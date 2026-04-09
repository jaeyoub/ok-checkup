import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface ChecklistCardProps {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
}

const ChecklistCard = ({
  id,
  title,
  category,
  checked,
  memo,
  onToggle,
  onMemoChange,
}: ChecklistCardProps) => {
  return (
    <div
      className={`group rounded-lg border p-4 transition-all duration-200 ${
        checked
          ? "border-success/30 bg-success/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle(id)}
          className="mt-0.5 h-5 w-5 border-muted-foreground data-[state=checked]:border-success data-[state=checked]:bg-success"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              {category}
            </span>
            {checked && (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            )}
          </div>
          <p
            className={`font-medium transition-colors ${
              checked ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {title}
          </p>
          <Textarea
            placeholder="메모를 입력하세요..."
            value={memo}
            onChange={(e) => onMemoChange(id, e.target.value)}
            className="mt-3 min-h-[60px] resize-none border-border/50 bg-secondary/50 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
          />
        </div>
      </div>
    </div>
  );
};

export default ChecklistCard;
