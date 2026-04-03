import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { useToast } from "../hooks/useToast";
import "./HomePage.css";

interface Product {
  id: number;
  category_id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  stock: number;
  image_url: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, category_id: 1, name: "Linen Throw Pillow",    brand: "Maison",    price: 1299, old_price: 1799, badge: "Sale", stock: 12, image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop", description: "Handwoven linen pillow with a natural texture." },
  { id: 2, category_id: 1, name: "Ceramic Pour-Over Set", brand: "Kiln & Co", price: 2499, old_price: null, badge: "New",  stock: 8,  image_url: "/UrbanCart/images/ceramic_pourover.png", description: "Handcrafted ceramic pour-over set." },
  { id: 3, category_id: 2, name: "Oversized Wool Blazer", brand: "Atelier",   price: 5999, old_price: 8499, badge: "Sale", stock: 5,  image_url: null, description: "Timeless oversized blazer in premium Italian wool." },
  { id: 4, category_id: 4, name: "Cold Pressed Face Oil", brand: "Sève",      price: 1599, old_price: null, badge: null,   stock: 20, image_url: null, description: "Rosehip, sea buckthorn and jojoba blend." },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Living & Home", slug: "living-home", emoji: "🏡" },
  { id: 2, name: "Fashion",       slug: "fashion",     emoji: "👗" },
  { id: 3, name: "Furniture",     slug: "furniture",   emoji: "🪑" },
  { id: 4, name: "Beauty",        slug: "beauty",      emoji: "✨" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { ToastElement } = useToast();
  const [products,   setProducts]   = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((r) => r.json())
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => {});

    fetch("http://localhost:8000/api/categories/")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-tag">New Season Collection</p>
            <h1>Curated for<br />the Urban<br />Life.</h1>
            <p className="hero-desc">
              Thoughtfully sourced products for your home, wardrobe, and everyday rituals.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-accent" onClick={() => navigate("/products")}>
                Shop All Products
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/products?category=1")}>
                New Arrivals
              </button>
            </div>
          </div>
          <div className="hero-deco" aria-hidden="true">UC</div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: "var(--warm-white)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <button className="section-more" onClick={() => navigate("/products")}>
              View all →
            </button>
          </div>
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="brand-strip">
        <div className="container brand-strip-inner">
          <h2>Made with Intention</h2>
          <p>
            Every product in our catalog is hand-selected for quality, sustainability, and design.
            We work directly with independent makers and artisan brands.
          </p>
          <button
            className="btn btn-outline"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            onClick={() => navigate("/products")}
          >
            Explore the Collection
          </button>
        </div>
      </section>

      {ToastElement}
    </>
  );
}