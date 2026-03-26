import { useNavigate } from "react-router-dom";
import type { Category } from "../types";
import "./CategoryCard.css";

interface Props {
  category: Category;
}

function CategoryCard({ category }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="cat-card"
      onClick={() => navigate(`/products?category=${category.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/products?category=${category.id}`)}
    >
      <div className="cat-icon">{category.emoji ?? "🛍"}</div>
      <div className="cat-name">{category.name}</div>
    </div>
  );
}

export default CategoryCard;
