import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ProgressHeader from "@/components/ProgressHeader";
import FilterTabs, { type FilterType } from "@/components/FilterTabs";
import ChecklistCard from "@/components/ChecklistCard";

interface CheckItem {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
}

const initialItems: CheckItem[] = [
  { id: "1", title: "고객정보 접근권한 확인", category: "월간 점검", checked: false, memo: "" },
  { id: "2", title: "비밀번호 변경 여부", category: "월간 점검", checked: false, memo: "" },
  { id: "3", title: "문서 보관 상태", category: "월간 점검", checked: false, memo: "" },
  { id: "4", title: "시스템 로그 점검", category: "분기 점검", checked: false, memo: "" },
  { id: "5", title: "외부감사 자료 준비", category: "분기 점검", checked: false, memo: "" },
  { id: "6", title: "규정 변경사항 반영", category: "분기 점검", checked: false, memo: "" },
];

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<FilterType>("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleMemoChange = (id: string, memo: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, memo } : item))
    );
  };

  const completed = items.filter((i) => i.checked).length;

  const counts = useMemo(
    () => ({
      all: items.length,
      completed: items.filter((i) => i.checked).length,
      incomplete: items.filter((i) => !i.checked).length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    if (filter === "completed") return items.filter((i) => i.checked);
    if (filter === "incomplete") return items.filter((i) => !i.checked);
    return items;
  }, [items, filter]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CheckItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Category stats from all items (not filtered)
  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    items.forEach((item) => {
      const stat = map.get(item.category) || { total: 0, completed: 0 };
      stat.total++;
      if (item.checked) stat.completed++;
      map.set(item.category, stat);
    });
    return map;
  }, [items]);

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader completed={completed} total={items.length} />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <FilterTabs current={filter} onChange={setFilter} counts={counts} />
        </div>

        <div className="space-y-6">
          {grouped.map(([category, categoryItems]) => {
            const stats = categoryStats.get(category)!;
            const pct = Math.round((stats.completed / stats.total) * 100);
            const isCollapsed = collapsed.has(category);

            return (
              <section key={category}>
                <button
                  onClick={() => toggleCollapse(category)}
                  className="flex w-full items-center gap-2 mb-3 group/header"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                  )}
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover/header:text-foreground transition-colors">
                    {category}
                  </h2>
                  <div className="flex items-center gap-2 ml-auto">
                    <Progress
                      value={pct}
                      className="h-1.5 w-20 bg-secondary [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500"
                    />
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {categoryItems.map((item) => (
                      <ChecklistCard
                        key={item.id}
                        {...item}
                        onToggle={handleToggle}
                        onMemoChange={handleMemoChange}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {grouped.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              해당하는 항목이 없습니다.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
