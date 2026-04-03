import type { Category } from "../types";
import { Home, Shirt, Armchair, Sparkles, ShoppingBag } from "lucide-react";
import "./FilterSidebar.css";

export type SortOption = "price_asc" | "price_desc" | "newest";

interface Props {
  categories: Category[];
  activeCategory: number | null;
  sort: SortOption;
  search: string;
  onCategoryChange: (id: number | null) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (q: string) => void;
  onClear: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest",     label: "Newest First" },
];

function FilterSidebar({
  categories, activeCategory, sort, search,
  onCategoryChange, onSortChange, onSearchChange, onClear,
}: Props) {
  return (
    <aside className="filter-sidebar">
      <input
        className="form-input sidebar-search"
        placeholder="Search products…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="filter-section">
        <h3 className="filter-heading">Category</h3>
        <label className={`filter-item ${!activeCategory ? "active" : ""}`}>
          <input type="radio" name="category" checked={!activeCategory} onChange={() => onCategoryChange(null)} />
          All Categories
        </label>
        {categories.map((c) => {
          const getIcon = (slug: string) => {
            switch (slug) {
              case "living-home": return <Home size={14} />;
              case "fashion": return <Shirt size={14} />;
              case "furniture": return <Armchair size={14} />;
              case "beauty": return <Sparkles size={14} />;
              default: return <ShoppingBag size={14} />;
            }
          };
          return (
            <label key={c.id} className={`filter-item ${activeCategory === c.id ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input type="radio" name="category" checked={activeCategory === c.id} onChange={() => onCategoryChange(c.id)} />
              {getIcon(c.slug)} <span style={{ marginTop: "1px" }}>{c.name}</span>
            </label>
          );
        })}
      </div>
      <hr className="filter-divider" />
      <div className="filter-section">
        <h3 className="filter-heading">Sort By</h3>
        {SORT_OPTIONS.map((opt) => (
          <label key={opt.value} className={`filter-item ${sort === opt.value ? "active" : ""}`}>
            <input type="radio" name="sort" checked={sort === opt.value} onChange={() => onSortChange(opt.value)} />
            {opt.label}
          </label>
        ))}
      </div>
      <hr className="filter-divider" />
      <button className="btn btn-ghost btn-sm filter-clear" onClick={onClear}>
        Clear all filters
      </button>
    </aside>
  );
}

export default FilterSidebar;
