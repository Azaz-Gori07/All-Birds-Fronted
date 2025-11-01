import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetails.css";
import ReserveItemModal from '../Reserved-Modal/Reserved.jsx';
import ShippingLabelDrawer from "../ShippingLabelDrawer/ShippingLabelDrawer.jsx";
import FulfillPage from "../Fulfill/Fulfill.jsx";
 
export default function OrderDetail({ orderId, onBack, onStatusChange }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [showShipping, setShowShipping] = useState(false);
  const [showFulfill, setShowFulfill] = useState(false);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();

        // Parse items JSON safely
        if (data.items) {
          try {
            data.items = JSON.parse(data.items);
          } catch (e) {
            console.error("Invalid items JSON", e);
            data.items = [];
          }
        }

        setOrder(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const saved = localStorage.getItem(`reservedItems_${orderId}`);
    if (saved) {
      const parsed = JSON.parse(saved);

      // expiry check (24h)
      if (Date.now() < parsed.expiryTime) {
        setReservation(parsed);
      } else {
        localStorage.removeItem(`reservedItems_${orderId}`);
      }
    }
  }, [orderId]);



  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(`reservedItems_${orderId}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (Date.now() > data.expiryTime) {
          localStorage.removeItem(`reservedItems_${orderId}`);
          setReservation(null);
        }
      }
    }, 5 * 60 * 1000); // check every 5 minutes
    return () => clearInterval(interval);
  }, [orderId]);



  useEffect(() => {
    if (!order) return;
    const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statusOrder.indexOf(order.status);
    const steps = document.querySelectorAll(".progress-step");
    steps.forEach((step, index) => {
      if (index <= currentIndex) step.classList.add("active");
      else step.classList.remove("active");
    });
  }, [order?.status]);

  const handleReserve = (data) => {
    setReservation(data);
    localStorage.setItem(`reservedItems_${orderId}`, JSON.stringify(data));
    setShowModal(false);

    setOrder((prev) => ({ ...prev }));
  };

  const handleFulfill = () => {
    if (order.status === "Shipped") {
      document.getElementsByClassName("fulfill")[0].disabled = true;
      alert("Order is already shipped");
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    if (onStatusChange) onStatusChange(id, newStatus);
  };


  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setOrder((prev) => ({ ...prev, status: "Cancelled" }));
      onStatusChange(orderId, "Cancelled");

      localStorage.removeItem(`reservedItems_${orderId}`);
      setReservation(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;



  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-header">
        <div className="order-header-left">
          <button className="nav-button" onClick={onBack}>←</button>
          <h1 className="order-title">Order-{order.id}</h1>
          <span className={`badge ${order.payment === "Paid" ? "badge-paid" : "badge-unpaid"}`}>
            {order.payment}
          </span>
          <span className={`badge ${order.status === "Delivered" ? "badge-fulfilled" : "badge-unfulfilled"}`}>
            {order.status}
          </span>
        </div>
        <div className="order-header-right">
          <button className="action-link">Report</button>
          <span className="separator">·</span>
          <button className="action-link">Duplicate</button>
          <span className="separator">·</span>
          <button className="action-link">Share Order</button>
        </div>
      </div>

      {/* Order Meta */}
      <div className="order-meta">
        <span>
          Order date <strong>{new Date(order.created_at).toDateString()}</strong>
        </span>
        <span className="separator">·</span>
        <span>
          Order from <strong className="link">{order.shipping_name}</strong>
        </span>
        <span className="separator">·</span>
        <span>
          Purchased via <strong>Online Store</strong>
        </span>
        <div className="order-count">Order #{order.id}</div>
      </div>

      {/* Main Content */}
      <div className="order-content">
        <div className="order-main">
          {/* Progress Tracker */}
          <div className="progress-tracker">
            <div className={`progress-step ${order.status === "Pending" ? "active" : ""}`}>
              <div className="step-icon">⚙️</div>
              <div className="step-line"></div>
              <span className="step-label">Review order</span>
            </div>
            <div className={`progress-step ${order.status === "Processing" ? "active" : ""}`}>
              <div className="step-icon">📦</div>
              <div className="step-line"></div>
              <span className="step-label">Preparing order</span>
            </div>
            <div className={`progress-step ${order.status === "Shipped" ? "active" : ""}`}>
              <div className="step-icon">🚚</div>
              <div className="step-line"></div>
              <span className="step-label">Shipping</span>
            </div>
            <div className={`progress-step ${order.status === "Delivered" ? "active" : ""}`}>
              <div className="step-icon">✓</div>
              <span className="step-label">Delivered</span>
            </div>
          </div>

          <div className="order-actions">
            <li className="cancel-button" onClick={handleCancelOrder}>Cancel order</li>

            {order.status === "Processing" ? (
              <button
                className="shipping-button fulfill"
                onClick={() => {
                  setShowFulfill(true);
                  handleFulfill();
                }}
              >
                Fulfill Items
              </button>
            ) : order.status === "Shipped" ? (
              <button className="shipping-button shipped" disabled >
                Shipped ✓
              </button>
            ) : (
              <button className="shipping-button" onClick={() => setShowShipping(true)}>
                Print Shipping Label
              </button>
            )}

          </div>

          {/* Product List */}
          <div className="products-section">
            <div className="section-header">
              <h2>Products</h2>
              <span className="unfulfilled-badge">{order.status}</span>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="product-item">
                <img
                  src={
                    item?.image
                      ? item.image.startsWith("http")
                        ? item.image
                        : `/${item.image}`
                      : "/fallback.jpg"
                  }
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-details">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-sku">SKU: {item.title}</p>
                  <p className="product-variant">{item.color} · Quantity - {item.quantity}</p>
                </div>
                <div className="product-price">${item.price}</div>
              </div>
            ))}
          </div>

          <div className="reserved">
            {reservation ? (
              <div className="flex items-center justify-between border border-orange-300 bg-orange-50 p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">
                  🕒 Your reserved item will be set until{" "}
                  <span className="font-semibold text-gray-800">
                    {new Date(reservation.until).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
                <button onClick={() => setShowModal(true)} className="text-orange-600 hover:underline font-medium ml-3">
                  Edit
                </button>
              </div>
            ) : (
              <li onClick={() => setShowModal(true)} className="reserved-link">Reserve Item</li>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-sidebar">
          <div className="sidebar-card">
            <h3 className="card-title">Customer</h3>
            <h4 className="customer-name">{order.shipping_name}</h4>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Shipping Address</h3>
            <p>{order.shipping_address}, {order.shipping_city} - {order.shipping_pincode}</p>
          </div>

          <div className="sidebar-card">
            <h3 className="card-title">Contact Information</h3>
            <button className="contact-button">{order.shipping_phone}</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReserveItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        items={order.items}
        onReserve={handleReserve}
        existingReserve={reservation}
        orderId={orderId}
      />

      <ShippingLabelDrawer
        isOpen={showShipping}
        onClose={() => setShowShipping(false)}
        order={{
          ...order,
          onStatusChange,
          items: reservation?.items ||
            JSON.parse(localStorage.getItem(`reservedItems_${orderId}`)) ||
            order.items
        }}
        onCreate={() => {
          setOrder((prev) => ({ ...prev, status: "Processing" }));
          onStatusChange(order.id, "Processing");
        }}

        onStatusChange={handleStatusChange}
      />

      <FulfillPage
        isOpen={showFulfill}
        onClose={() => setShowFulfill(false)}
        order={{
          ...order,
          onStatusChange
        }}
        onCreate={() => {
          setOrder((prev) => ({ ...prev, status: "Shipped" }));
          onStatusChange(order.id, "Shipped");
        }}
      />
    </div>
  );
}
