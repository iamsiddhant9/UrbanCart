import { useEffect, useState } from "react";
import { productsAPI, ordersAPI } from "../api";
import type { Product, Order } from "../types";
import "./AdminPage.css";

const EMPTY_FORM = {
  name: "", brand: "", price: "", old_price: "", badge: "", stock: "", description: "", image_url: "",
  category_id: "1",
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [editing,  setEditing]  = useState<number | null>(null);
  const [message,  setMessage]  = useState("");

  const load = () => {
    productsAPI.getAll().then((r) => setProducts(r.data)).catch(() => {});
    ordersAPI.getAll().then((r) => setOrders(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const notify = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    try {
      if (editing) {
        await productsAPI.update(editing, fd);
        notify("Product updated ✓");
      } else {
        await productsAPI.create(fd);
        notify("Product created ✓");
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      load();
    } catch { notify("Error saving product"); }
  };

  const handleEdit = (p: Product) => {
    setEditing(p.id);
    setForm({
      name: p.name, brand: p.brand, price: String(p.price),
      old_price: String(p.old_price ?? ""), badge: p.badge ?? "",
      stock: String(p.stock), description: p.description, image_url: p.image_url ?? "",
      category_id: String(p.category_id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try { await productsAPI.delete(id); load(); } catch { notify("Error deleting product"); }
  };

  return (
    <div className="section">
      <div className="container admin-container">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-sub">Product Management</p>

        {message && <div className="admin-message">{message}</div>}

        {/* Form */}
        <div className="admin-form-card">
          <h2 className="admin-form-title">{editing ? "Edit Product" : "Add New Product"}</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input className="form-input" value={form.name} onChange={set("name")} />
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-input" value={form.brand} onChange={set("brand")} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" value={form.price} onChange={set("price")} />
            </div>
            <div className="form-group">
              <label className="form-label">Old Price (₹)</label>
              <input className="form-input" type="number" value={form.old_price} onChange={set("old_price")} placeholder="Optional" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category_id} onChange={set("category_id")}>
                <option value="1">Living & Home</option>
                <option value="2">Fashion</option>
                <option value="3">Furniture</option>
                <option value="4">Beauty</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Badge</label>
              <select className="form-input" value={form.badge} onChange={set("badge")}>
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
                <option value="Bestseller">Bestseller</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input className="form-input" type="number" value={form.stock} onChange={set("stock")} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" type="url" value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input admin-textarea" value={form.description} onChange={set("description")} rows={3} />
          </div>
          <div className="admin-form-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? "Update Product" : "Add Product"}
            </button>
            {editing && (
              <button className="btn btn-outline" onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Products table */}
        <h2 className="admin-table-title">All Products ({products.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Badge</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.badge && <span className={`badge badge-${p.badge.toLowerCase()}`}>{p.badge}</span>}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-sm admin-delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Orders table */}
        <h2 className="admin-table-title" style={{ marginTop: "3rem" }}>All Orders ({orders.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Date</th><th>Status</th><th>Total</th><th>Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.created_at}</td>
                  <td>
                    <span className={`badge badge-${o.status === 'delivered' ? 'sale' : 'new'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>₹{o.total_amount.toLocaleString()}</td>
                  <td style={{ maxWidth: 200, WebkitLineClamp: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{o.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
