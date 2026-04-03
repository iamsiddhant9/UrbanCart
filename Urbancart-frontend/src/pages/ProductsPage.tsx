import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { productsAPI, categoriesAPI } from "../api";
import ProductCard from "../components/ProductCard";
import FilterSidebar, { type SortOption } from "../components/FilterSidebar";
import type { Product, Category } from "../types";
import { useToast } from "../hooks/useToast";
import "./ProductsPage.css";

/* Fallback mock data */
const MOCK_PRODUCTS: Product[] = [
  { id: 1,  category_id: 1, name: "Linen Throw Pillow",    brand: "Maison",       price: 1299, old_price: 1799, badge: "Sale",       stock: 12, image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 2,  category_id: 1, name: "Ceramic Pour-Over Set", brand: "Kiln & Co",    price: 2499, old_price: null, badge: "New",        stock: 8,  image_url: "/UrbanCart/images/ceramic_pourover.png", description: "" },
  { id: 3,  category_id: 2, name: "Oversized Wool Blazer", brand: "Atelier",      price: 5999, old_price: 8499, badge: "Sale",       stock: 5,  image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 4,  category_id: 2, name: "Canvas Tote Bag",       brand: "Everyday",     price: 899,  old_price: null, badge: "Bestseller", stock: 30, image_url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 5,  category_id: 3, name: "Wooden Desk Lamp",      brand: "Lumière",      price: 3499, old_price: 4200, badge: "Sale",       stock: 7,  image_url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 6,  category_id: 3, name: "Rattan Side Table",     brand: "Maison",       price: 4199, old_price: null, badge: "New",        stock: 4,  image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 7,  category_id: 4, name: "Cold Pressed Face Oil", brand: "Sève",         price: 1599, old_price: null, badge: null,         stock: 20, image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 8,  category_id: 4, name: "Natural Skincare Set",  brand: "Green Ritual", price: 749,  old_price: 999,  badge: "Sale",       stock: 15, image_url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 9,  category_id: 1, name: "Soy Wax Candle Set",   brand: "Lúme",         price: 1199, old_price: null, badge: null,         stock: 10, image_url: "/UrbanCart/images/soy_wax_candle.png", description: "" },
  { id: 10, category_id: 2, name: "Relaxed Linen Shirt",   brand: "Atelier",      price: 2199, old_price: null, badge: "New",        stock: 18, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 11, category_id: 3, name: "Sheepskin Floor Pouf",  brand: "Maison",       price: 3299, old_price: 4500, badge: "Sale",       stock: 6,  image_url: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=800&auto=format&fit=crop", description: "" },
  { id: 12, category_id: 4, name: "Rose Clay Mask",        brand: "Sève",         price: 899,  old_price: null, badge: null,         stock: 25, image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop", description: "" },
];
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Living & Home", slug: "living-home", emoji: "🏡" },
  { id: 2, name: "Fashion",       slug: "fashion",      emoji: "👗" },
  { id: 3, name: "Furniture",     slug: "furniture",    emoji: "🪑" },
  { id: 4, name: "Beauty",        slug: "beauty",       emoji: "✨" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ToastElement } = useToast();

  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories]   = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading]         = useState(false);

  const [search,   setSearch]   = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState<number | null>(
    searchParams.get("category") ? Number(searchParams.get("category")) : null
  );
  const [sort, setSort] = useState<SortOption>("price_asc");

  /* Fetch from backend */
  useEffect(() => {
    categoriesAPI.getAll().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    productsAPI
      .getAll({ category: category ?? undefined, search, sort })
      .then((r) => setAllProducts(r.data))
      .catch(() => {
        // Apply filters locally on mock data
        let filtered = [...MOCK_PRODUCTS];
        if (category) filtered = filtered.filter((p) => p.category_id === category);
        if (search)   filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
        );
        if (sort === "price_asc")  filtered.sort((a, b) => a.price - b.price);
        if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
        setAllProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  /* Sync URL params */
  useEffect(() => {
    const p: Record<string, string> = {};
    if (search)   p.search   = search;
    if (category) p.category = String(category);
    setSearchParams(p, { replace: true });
  }, [search, category, setSearchParams]);

  const handleClear = () => { setSearch(""); setCategory(null); setSort("price_asc"); };

  return (
    <div className="section products-page">
      <div className="container">
        <h1 className="page-title">All Products</h1>
        <p className="page-sub">{allProducts.length} product{allProducts.length !== 1 ? "s" : ""}</p>

        <div className="products-layout">
          <FilterSidebar
            categories={categories}
            activeCategory={category}
            sort={sort}
            search={search}
            onCategoryChange={setCategory}
            onSortChange={setSort}
            onSearchChange={setSearch}
            onClear={handleClear}
          />

          <div className="products-main">
            {loading ? (
              <div className="loading-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : allProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon" style={{ display: "flex", justifyContent: "center" }}><Search size={48} strokeWidth={1.5} /></div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-sub">Try adjusting your search or filters</p>
                <button className="btn btn-outline" onClick={handleClear}>Clear filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {allProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      {ToastElement}
    </div>
  );
}
