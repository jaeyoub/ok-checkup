import { useState, useEffect, useRef, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Trash2 } from "lucide-react";

interface ChecklistCardProps {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

const ChecklistCard = ({
  id,
  title,
  category,
  checked,
  memo,
  onToggle,
  onMemoChange,
  onDelete,
}: ChecklistCardProps) => {
  const [localMemo, setLocalMemo] = useState(memo);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalMemo(memo);
  }, [memo]);

  const debouncedSave = useCallback(
    (value: string) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onMemoChange(id, value), 500);
    },
    [id, onMemoChange]
  );

  const handleMemo = (value: string) => {
    setLocalMemo(value);
    debouncedSave(value);
  };

  return (
    <div
      className={`group rounded-lg border p-4 transition-all duration-300 ${
        checked
          ? "border-success/20 bg-success/5 opacity-60"
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
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                checked
                  ? "text-muted-foreground/60 bg-muted/30"
                  : "text-primary/80 bg-primary/10"
              }`}
            >
              {category}
            </span>
            {checked && (
              <CheckCircle2 className="h-4 w-4 text-success/60 shrink-0" />
            )}
            <button
              onClick={() => onDelete(id)}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p
            className={`font-medium transition-colors ${
              checked
                ? "text-muted-foreground/50 line-through"
                : "text-foreground"
            }`}
          >
            {title}
          </p>
          <Textarea
            placeholder="메모를 입력하세요..."
            value={localMemo}
            onChange={(e) => handleMemo(e.target.value)}
            className={`mt-3 min-h-[60px] resize-none border-border/50 bg-secondary/50 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 transition-opacity ${
              checked ? "opacity-50" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChecklistCard;
