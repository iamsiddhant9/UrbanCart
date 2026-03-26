import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/useToast";
import type { Product } from "../types";
import "./ProductCard.css";

interface Props {
  product: Product;
}

const BADGE_CLASS: Record<string, string> = {
  Sale: "badge badge-sale",
  New: "badge badge-new",
  Bestseller: "badge badge-best",
};

function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { show } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    show(`${product.name} added to bag`);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-img-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder">🛍</div>
        )}
        {product.badge && (
          <span className={BADGE_CLASS[product.badge] ?? "badge badge-best"}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="product-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-prices">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.old_price && (
            <span className="product-old-price">₹{product.old_price.toLocaleString()}</span>
          )}
        </div>
      </div>
      <div className="product-footer">
        <button
          className="btn btn-primary btn-full btn-sm"
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
