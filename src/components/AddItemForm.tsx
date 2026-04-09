import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddItemFormProps {
  categories: string[];
  onAdd: (title: string, category: string) => void;
  isPending: boolean;
}

const AddItemForm = ({ categories, onAdd, isPending }: AddItemFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState("");
  const [useNew, setUseNew] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = useNew ? newCategory.trim() : category;
    if (!title.trim() || !cat) return;
    onAdd(title.trim(), cat);
    setTitle("");
    setNewCategory("");
    setUseNew(false);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        항목 추가
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-primary/30 bg-card p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">새 항목 추가</span>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <Input
        placeholder="항목명을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-secondary/50 border-border/50"
        autoFocus
      />

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { setCategory(cat); setUseNew(false); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              !useNew && category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUseNew(true)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            useNew
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          + 새 카테고리
        </button>
      </div>

      {useNew && (
        <Input
          placeholder="새 카테고리명"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="bg-secondary/50 border-border/50"
        />
      )}

      <Button
        type="submit"
        disabled={isPending || !title.trim() || (useNew ? !newCategory.trim() : !category)}
        className="w-full"
      >
        {isPending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
};

export default AddItemForm;
