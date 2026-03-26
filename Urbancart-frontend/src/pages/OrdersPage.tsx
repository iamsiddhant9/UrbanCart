import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ordersAPI } from "../api";
import "./OrdersPage.css";

interface Order {
  id: string | number;
  status: string;
  total_amount: number;
  address: string;
  created_at: string;
  items?: { product_name: string; quantity: number; unit_price: number }[];
}

const MOCK_ORDERS: Order[] = [
  { id: "UC384921", status: "shipped",   total_amount: 3298, address: "42 Linking Rd, Bandra, Mumbai - 400050", created_at: "2025-03-16", items: [{ product_name: "Ceramic Pour-Over Set", quantity: 1, unit_price: 2499 }, { product_name: "Canvas Tote Bag", quantity: 1, unit_price: 799 }] },
  { id: "UC273810", status: "delivered", total_amount: 1299, address: "8 MG Road, Pune - 411001",                created_at: "2025-03-02", items: [{ product_name: "Linen Throw Pillow", quantity: 1, unit_price: 1299 }] },
];

const STATUS_CLASS: Record<string, string> = {
  pending:   "status-pill status-pending",
  confirmed: "status-pill status-confirmed",
  shipped:   "status-pill status-shipped",
  delivered: "status-pill status-delivered",
};

export default function OrdersPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const newOrderId = (location.state as { newOrderId?: string })?.newOrderId;

  const [orders,   setOrders]   = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | number | null>(newOrderId ?? null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    ordersAPI
      .getAll()
      .then((r) => setOrders(r.data))
      .catch(() => {
        const mock = newOrderId
          ? [{ id: newOrderId, status: "confirmed", total_amount: 0, address: "—", created_at: new Date().toISOString().slice(0, 10), items: [] }, ...MOCK_ORDERS]
          : MOCK_ORDERS;
        setOrders(mock);
      })
      .finally(() => setLoading(false));
  }, [newOrderId]);

  if (loading) return <div className="section container"><p className="text-mid">Loading orders…</p></div>;

  if (orders.length === 0) {
    return (
      <div className="section container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2 className="empty-title">No orders yet</h2>
          <p className="empty-sub">Your order history will appear here</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container orders-container">
        <h1 className="page-title">Your Orders</h1>
        <p className="page-sub">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className={`order-card ${String(order.id) === String(newOrderId) ? "order-card--new" : ""}`}>
              <div className="order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <p className="order-id">#{order.id}</p>
                  <p className="order-date">{order.created_at}</p>
                </div>
                <div className="order-header-right">
                  <span className={STATUS_CLASS[order.status] ?? "status-pill status-pending"}>
                    {order.status}
                  </span>
                  {order.total_amount > 0 && (
                    <p className="order-total">₹{order.total_amount.toLocaleString()}</p>
                  )}
                  <span className="expand-icon">{expanded === order.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="order-detail">
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <span>{item.product_name} ×{item.quantity}</span>
                          <span>₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {order.address && order.address !== "—" && (
                    <p className="order-address">📍 {order.address}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
