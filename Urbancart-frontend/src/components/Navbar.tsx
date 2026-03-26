import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const active = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Urban<span>Cart</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${active("/") ? "active" : ""}`}>Home</Link>
        <Link to="/products" className={`nav-link ${active("/products") ? "active" : ""}`}>Shop</Link>
        {user?.is_admin && (
          <Link to="/admin" className={`nav-link ${active("/admin") ? "active" : ""}`}>Admin</Link>
        )}
        {user && (
          <Link to="/orders" className={`nav-link ${active("/orders") ? "active" : ""}`}>Orders</Link>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate("/"); }}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-outline btn-sm">Sign in</Link>
        )}

        <Link to="/cart" className="cart-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Bag
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
