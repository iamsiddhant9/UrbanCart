import { useNavigate } from "react-router-dom";
import { Home, Shirt, Armchair, Sparkles, ShoppingBag } from "lucide-react";
import type { Category } from "../types";
import "./CategoryCard.css";

interface Props {
  category: Category;
}

function CategoryCard({ category }: Props) {
  const navigate = useNavigate();
  const getIcon = (slug: string) => {
    switch (slug) {
      case "living-home": return <Home size={28} strokeWidth={1.5} />;
      case "fashion": return <Shirt size={28} strokeWidth={1.5} />;
      case "furniture": return <Armchair size={28} strokeWidth={1.5} />;
      case "beauty": return <Sparkles size={28} strokeWidth={1.5} />;
      default: return <ShoppingBag size={28} strokeWidth={1.5} />;
    }
  };

  return (
    <div
      className="cat-card"
      onClick={() => navigate(`/products?category=${category.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/products?category=${category.id}`)}
    >
      <div className="cat-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {getIcon(category.slug)}
      </div>
      <div className="cat-name">{category.name}</div>
    </div>
  );
}

export default CategoryCard;
