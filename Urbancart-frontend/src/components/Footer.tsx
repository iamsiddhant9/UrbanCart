import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Urban<span>Cart</span></div>
          <p className="footer-tagline">Curated products for the urban life.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=1">Living & Home</Link>
            <Link to="/products?category=2">Fashion</Link>
            <Link to="/products?category=3">Furniture</Link>
            <Link to="/products?category=4">Beauty</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">My Bag</Link>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <a href="#">About Us</a>
            <a href="#">Shipping Policy</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 UrbanCart · College Mini Project · React + Django + MySQL</p>
        </div>
      </div>
    </footer>
  );
}
