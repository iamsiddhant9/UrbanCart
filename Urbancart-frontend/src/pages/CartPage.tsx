import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItemComponent from "../components/CartItem";
import "./CartPage.css";

export default function CartPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = total >= 999 ? 0 : 99;
  const gst      = Math.round(total * 0.18);
  const grandTotal = total + shipping + gst;

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🛍</div>
            <h2 className="empty-title">Your bag is empty</h2>
            <p className="empty-sub">Add some items to get started</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="page-title">Your Bag</h1>
        <p className="page-sub">{items.length} item{items.length !== 1 ? "s" : ""}</p>

        <div className="cart-layout">
          {/* Items list */}
          <div className="cart-items">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: "1rem", padding: 0, fontSize: "0.8rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
              onClick={clearCart}
            >
              Clear bag
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary-panel">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: "#3a7b4a" }}>Free</span> : `₹${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              {shipping > 0 && (
                <p className="free-ship-hint">
                  Add ₹{(999 - total).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <div className="summary-actions">
              {user ? (
                <button className="btn btn-primary btn-full" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                </button>
              ) : (
                <Link to="/login" className="btn btn-accent btn-full" style={{ display: "flex" }}>
                  Sign in to Checkout
                </Link>
              )}
              <button
                className="btn btn-outline btn-full btn-sm"
                onClick={() => navigate("/products")}
                style={{ marginTop: "0.5rem" }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
