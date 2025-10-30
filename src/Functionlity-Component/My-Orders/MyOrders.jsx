import React, { useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: '#ORD-7842',
      date: '2024-01-15',
      status: 'Delivered',
      total: 149.99,
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 99.99, image: '/api/placeholder/80/80' },
        { name: 'Phone Case', quantity: 2, price: 25.00, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: '#ORD-7821',
      date: '2024-01-10',
      status: 'Processing',
      total: 89.99,
      items: [
        { name: 'Smart Watch', quantity: 1, price: 89.99, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: '#ORD-7798',
      date: '2024-01-05',
      status: 'Cancelled',
      total: 199.99,
      items: [
        { name: 'Laptop Bag', quantity: 1, price: 79.99, image: '/api/placeholder/80/80' },
        { name: 'USB-C Cable', quantity: 3, price: 40.00, image: '/api/placeholder/80/80' }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#22c55e';
      case 'Processing': return '#3b82f6';
      case 'Cancelled': return '#ef4444';
      case 'Shipped': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1 className="page-title">My Orders</h1>
        <div className="header-actions">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <select className="filter-select">
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-id">{order.id}</h3>
                <span className="order-date">Ordered on {order.date}</span>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <div className="image-placeholder"></div>
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <div className="item-price">${item.price}</div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">${order.total}</span>
              </div>
              <div className="order-actions">
                <button className="btn btn-outline">View Details</button>
                <button className="btn btn-primary">Buy Again</button>
                {order.status === 'Delivered' && (
                  <button className="btn btn-outline">Rate Product</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you make a purchase</p>
          <button className="btn btn-primary">Start Shopping</button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;