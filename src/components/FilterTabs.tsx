type FilterType = "all" | "completed" | "incomplete";

interface FilterTabsProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
  counts: { all: number; completed: number; incomplete: number };
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "completed", label: "완료" },
  { key: "incomplete", label: "미완료" },
];

const FilterTabs = ({ current, onChange, counts }: FilterTabsProps) => {
  return (
    <div className="flex gap-2">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            current === key
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
          <span className="ml-1.5 text-xs opacity-70">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
export type { FilterType };
