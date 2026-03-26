import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../types";
import "./CartItem.css";

interface Props {
  item: CartItemType;
}

function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCart();
  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {item.product.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} />
        ) : (
          <span>🛍</span>
        )}
      </div>
      <div className="cart-item-info">
        <p className="cart-item-brand">{item.product.brand}</p>
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-unit">₹{item.product.price.toLocaleString()} each</p>
      </div>
      <div className="cart-item-actions">
        <p className="cart-item-subtotal">₹{(item.product.price * item.quantity).toLocaleString()}</p>
        <div className="qty-control">
          <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
          <span className="qty-val">{item.quantity}</span>
          <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
        </div>
        <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
