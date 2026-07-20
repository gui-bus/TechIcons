import { CATEGORIES, CategoryType } from "../utils/categories";

interface CategoryFiltersProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export default function CategoryFilters({
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-all border ${
            selectedCategory === cat.value
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
          }`}
          onClick={() => onSelectCategory(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
