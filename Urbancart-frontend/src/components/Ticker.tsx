import "./Ticker.css";

const MESSAGE =
  "  FREE SHIPPING ON ORDERS OVER ₹999  •  NEW ARRIVALS EVERY WEEK  •  EASY 15-DAY RETURNS  •  HANDPICKED BRANDS  •  CURATED COLLECTIONS  •  ";

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>{MESSAGE.repeat(3)}</span>
      </div>
    </div>
  );
}
