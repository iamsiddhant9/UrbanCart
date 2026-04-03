import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Frown, Home, Shirt, Armchair, Sparkles } from "lucide-react";
import { productsAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import type { Product } from "../types";
import "./ProductDetailPage.css";

const MOCK_PRODUCTS: Record<number, Product> = {
  1: { id: 1, category_id: 1, name: "Linen Throw Pillow",    brand: "Maison",       price: 1299, old_price: 1799, badge: "Sale", stock: 12, image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop", description: "Handwoven linen pillow with a natural texture that complements any living space. Available in a range of muted tones." },
  2: { id: 2, category_id: 1, name: "Ceramic Pour-Over Set", brand: "Kiln & Co",    price: 2499, old_price: null, badge: "New",  stock: 8,  image_url: "/UrbanCart/images/ceramic_pourover.png", description: "Handcrafted ceramic pour-over set. Each piece is unique, with subtle glaze variations. Includes dripper, carafe, and two mugs." },
  3: { id: 3, category_id: 2, name: "Oversized Wool Blazer", brand: "Atelier",      price: 5999, old_price: 8499, badge: "Sale", stock: 5,  image_url: null, description: "A timeless oversized blazer cut from premium Italian wool. Single-button closure, two patch pockets, fully lined." },
  4: { id: 4, category_id: 2, name: "Canvas Tote Bag",       brand: "Everyday",     price: 899,  old_price: null, badge: "Bestseller", stock: 30, image_url: null, description: "Sturdy 12oz canvas tote with interior zip pocket and key fob. Fits a 15\" laptop. Reinforced stitching." },
  5: { id: 5, category_id: 3, name: "Wooden Desk Lamp",      brand: "Lumière",      price: 3499, old_price: 4200, badge: "Sale", stock: 7,  image_url: null, description: "Warm-toned solid teak base with an adjustable steel arm and Edison-style bulb. Cord length 1.8m." },
  6: { id: 6, category_id: 3, name: "Rattan Side Table",     brand: "Maison",       price: 4199, old_price: null, badge: "New",  stock: 4,  image_url: null, description: "Lightweight rattan side table with a tempered glass top. Perfect for indoor or covered outdoor use." },
  7: { id: 7, category_id: 4, name: "Cold Pressed Face Oil", brand: "Sève",         price: 1599, old_price: null, badge: null,   stock: 20, image_url: null, description: "A restorative blend of rosehip, sea buckthorn and jojoba oils. 30ml amber glass dropper bottle." },
  8: { id: 8, category_id: 4, name: "Natural Skincare Set",      brand: "Green Ritual", price: 749,  old_price: 999,  badge: "Sale", stock: 15, image_url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop", description: "A pure, restorative skincare set featuring botanical extracts and organic ingredients for daily nourishment." },
};

const CATEGORY_SLUG: Record<number, string> = { 1: "living-home", 2: "fashion", 3: "furniture", 4: "beauty" };

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { show, ToastElement } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    productsAPI
      .getById(Number(id))
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(MOCK_PRODUCTS[Number(id)] ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    show(`Added ${qty} × ${product.name} to bag`);
  };

  const handleBuyNow = () => {
    handleAdd();
    setTimeout(() => navigate(user ? "/cart" : "/login", { state: { from: "/cart" } }), 300);
  };

  if (loading) return <div className="section container detail-loading">Loading…</div>;
  if (!product) return (
    <div className="section container empty-state">
      <div className="empty-icon" style={{ display: "flex", justifyContent: "center" }}><Frown size={48} strokeWidth={1.5} /></div>
      <h3 className="empty-title">Product not found</h3>
      <button className="btn btn-outline" onClick={() => navigate("/products")}>Back to Shop</button>
    </div>
  );

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null;

  return (
    <div className="section">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/products")}>
          ← Back to Shop
        </button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-img-wrap">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="detail-img" />
            ) : (
              <div className="detail-img-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mid)" }}>
                {(() => {
                  const slug = CATEGORY_SLUG[product.category_id];
                  switch (slug) {
                    case "living-home": return <Home size={48} strokeWidth={1.5} />;
                    case "fashion": return <Shirt size={48} strokeWidth={1.5} />;
                    case "furniture": return <Armchair size={48} strokeWidth={1.5} />;
                    case "beauty": return <Sparkles size={48} strokeWidth={1.5} />;
                    default: return <ShoppingBag size={48} strokeWidth={1.5} />;
                  }
                })()}
              </div>
            )}
            {discount && (
              <div className="detail-discount-badge">−{discount}%</div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-price-row">
              <span className="detail-price">₹{product.price.toLocaleString()}</span>
              {product.old_price && (
                <span className="detail-old-price">₹{product.old_price.toLocaleString()}</span>
              )}
            </div>

            {/* Qty */}
            <div className="qty-control" style={{ marginBottom: "1.25rem" }}>
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>

            {/* CTAs */}
            <div className="detail-ctas">
              <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock === 0 || added}>
                {product.stock === 0 ? "Out of Stock" : added ? "Added to Bag ✓" : "Add to Bag"}
              </button>
              <button className="btn btn-accent" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
            </div>

            {!user && (
              <p className="detail-auth-hint">
                <Link to="/login">Sign in</Link> to proceed to checkout
              </p>
            )}

            {/* Meta */}
            <div className="detail-meta">
              <div className="detail-meta-row">
                <span>Availability</span>
                <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
              </div>
              <div className="detail-meta-row">
                <span>Shipping</span>
                <span>Free over ₹999</span>
              </div>
              <div className="detail-meta-row">
                <span>Returns</span>
                <span>15-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ToastElement}
    </div>
  );
}
