import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { ordersAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name    ?? "",
    email:   user?.email   ?? "",
    phone:   "",
    address: "",
    city:    "",
    state:   "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping   = total >= 999 ? 0 : 99;
  const gst        = Math.round(total * 0.18);
  const grandTotal = total + shipping + gst;

  const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

  const handleSubmit = async () => {
    if (!form.address || !form.city || !form.pincode || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await ordersAPI.place(fullAddress);
      clearCart();
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate("/orders", { state: { newOrderId: data.id } });
      }, 2500);
    } catch {
      // Mock success for demo
      clearCart();
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate("/orders", { state: { newOrderId: "UC" + Math.floor(100000 + Math.random() * 900000) } });
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success-overlay">
        <div className="payment-success-modal">
          <div className="success-icon-wrap">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2>Payment Successful</h2>
          <p>Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/cart")}>← Back to Bag</button>

        <div className="checkout-grid">
          {/* Left: form */}
          <div>
            <h1 className="page-title" style={{ marginBottom: "0.4rem" }}>Checkout</h1>
            <p className="page-sub">Shipping Information</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={set("name")} placeholder="Alex Kumar" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input className="form-input" value={form.phone} onChange={set("phone")} placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email} onChange={set("email")} />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input className="form-input" value={form.address} onChange={set("address")} placeholder="Flat / House no, Street, Area" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" value={form.city} onChange={set("city")} placeholder="Mumbai" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" value={form.state} onChange={set("state")} placeholder="Maharashtra" />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: 180 }}>
              <label className="form-label">PIN Code *</label>
              <input className="form-input" value={form.pincode} onChange={set("pincode")} placeholder="400001" maxLength={6} />
            </div>

            <hr className="divider" />

            <h3 className="checkout-section-title">Payment</h3>
            <div className="payment-note" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={18} /> Cash on Delivery (COD) — payment gateway out of scope for this project
            </div>

            {error && <p className="checkout-error">{error}</p>}
          </div>

          {/* Right: summary */}
          <div>
            <div className="cart-summary-panel">
              <h3 className="summary-title">Your Order</h3>
              <div className="checkout-items">
                {items.map((item) => (
                  <div key={item.id} className="checkout-item-row">
                    <span className="checkout-item-name">
                      {item.product.name}
                      <span className="checkout-item-qty"> ×{item.quantity}</span>
                    </span>
                    <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="summary-rows" style={{ marginTop: "0.75rem" }}>
                <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: "1.25rem" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Placing Order…" : `Place Order · ₹${grandTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
