import { useParams, Link } from "react-router-dom";
import "./InfoPage.css";

const CONTENT: Record<string, { title: string; body: React.ReactNode }> = {
  about: {
    title: "About Us",
    body: (
      <>
        <p><strong>UrbanCart</strong> is a minimal e-commerce experiment designed to solve the modern shopping crisis.</p>
        <p>Most online stores suffer from cluttered interfaces, overwhelming choices, and complicated checkout processes. We set out to build a platform that focuses entirely on curated, high-quality products and a breathtakingly fast, distraction-free user experience.</p>
        <p>Every item on UrbanCart is hand-picked. You won't find endless scrollable lists of generic items—only the best of the best.</p>
      </>
    ),
  },
  shipping: {
    title: "Shipping Policy",
    body: (
      <>
        <p>We believe in fast and transparent shipping. No hidden fees at checkout.</p>
        <ul>
          <li><strong>Standard Shipping:</strong> ₹99 on all orders below ₹999.</li>
          <li><strong>Free Shipping:</strong> Automatically applied to all orders ₹999 and above.</li>
          <li><strong>Delivery Time:</strong> Most orders arrive within 3-5 business days depending on your location.</li>
        </ul>
        <p>Once your order is shipped, you can track its status directly from your <Link to="/orders" style={{ textDecoration: "underline" }}>Orders page</Link>.</p>
      </>
    ),
  },
  returns: {
    title: "Returns & Exchanges",
    body: (
      <>
        <p>We stand by the quality of our curated products. If you are not entirely satisfied, we make returns easy.</p>
        <ul>
          <li>Items can be returned within <strong>14 days</strong> of delivery.</li>
          <li>Products must be unused and in their original packaging.</li>
          <li>Refunds will be processed to the original payment method within 5-7 business days after we receive the item.</li>
        </ul>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <>
        <p>Need help with your order? Our support team is here for you.</p>
        <p><strong>Email:</strong> support@urbancart.in <br />
           <strong>Phone:</strong> +91 1800 123 4567</p>
        <p>Our business hours are Monday – Friday, 9:00 AM to 6:00 PM IST.</p>
      </>
    ),
  },
};

export default function InfoPage() {
  const { page } = useParams<{ page: string }>();
  const content = CONTENT[page || ""] || { title: "Page Not Found", body: <p>The page you are looking for does not exist.</p> };

  return (
    <div className="section">
      <div className="container info-container">
        <h1 className="info-title">{content.title}</h1>
        <div className="info-body">{content.body}</div>
      </div>
    </div>
  );
}
