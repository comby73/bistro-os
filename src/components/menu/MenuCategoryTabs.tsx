import type { MenuCategory } from "@/features/menu/types";

export function MenuCategoryTabs({
  categories,
  activeCategoryId,
  onSelect
}: {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={
          activeCategoryId === ""
            ? "rounded-full border border-gold/40 bg-gold/12 px-4 py-2 text-sm text-gold"
            : "rounded-full border border-line bg-layer1/60 px-4 py-2 text-sm text-paper/65 transition hover:border-gold/30 hover:text-paper"
        }
      >
        Todas
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={
            activeCategoryId === category.id
              ? "rounded-full border border-gold/40 bg-gold/12 px-4 py-2 text-sm text-gold"
              : "rounded-full border border-line bg-layer1/60 px-4 py-2 text-sm text-paper/65 transition hover:border-gold/30 hover:text-paper"
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
