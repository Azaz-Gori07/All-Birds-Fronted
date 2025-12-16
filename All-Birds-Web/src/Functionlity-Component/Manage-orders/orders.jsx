import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = ({ onSelectOrder }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/orders');

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filters = ['All', 'Unfulfilled', 'Unpaid', 'Open', 'Closed'];

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format currency function
    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    // Parse items from JSON string to count items
    const getItemsCount = (items) => {
        if (!items) return 0;
        try {
            const parsedItems = JSON.parse(items);
            if (Array.isArray(parsedItems)) {
                return parsedItems.length;
            }
            return 0;
        } catch (err) {
            // If items is not JSON, try to count as string
            if (typeof items === 'string') {
                return items.split(',').length;
            }
            return 0;
        }
    };

    // Get fulfilment status based on order status
    const getFulfilmentStatus = (status) => {
        switch (status) {
            case 'Delivered':
                return 'Fulfilled';
            case 'Shipped':
            case 'Processing':
                return 'Processing';
            case 'Pending':
            default:
                return 'Unfulfilled';
        }
    };

    // Filter orders based on active filter
    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Unfulfilled') return getFulfilmentStatus(order.status) === 'Unfulfilled';
        if (activeFilter === 'Unpaid') return order.payment === 'COD'; // COD means unpaid until delivered
        if (activeFilter === 'Open') return order.status === 'Pending' || order.status === 'Processing';
        if (activeFilter === 'Closed') return order.status === 'Delivered';
        return true;
    });

    // Calculate stats from actual orders data
    const totalOrders = orders.length;
    const totalItems = orders.reduce((total, order) => total + getItemsCount(order.items), 0);
    const fulfilledOrders = orders.filter(order => order.status === 'Delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;

    return (
        <div className="orders-management">
            {/* Header Section */}
            <div className="orders-header">
                <h1>Orders</h1>
                <div className="date-range">Jan 1 - Jan 30, 2024</div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-change positive">25.2% last week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalItems}</div>
                        <div className="stat-label">Total Items</div>
                        <div className="stat-change positive">18.2% last week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{pendingOrders}</div>
                        <div className="stat-label">Pending Orders</div>
                        <div className="stat-change negative">-12% last week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{fulfilledOrders}</div>
                        <div className="stat-label">Delivered Orders</div>
                        <div className="stat-change positive">12.2% last week</div>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                    <button className="add-btn">Add</button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-btn"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Orders Table */}
            {!isLoading && !error && (
                <div className="orders-table-container">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Payment</th>
                                    <th>Total</th>
                                    <th>City</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => {
                                    const itemsCount = getItemsCount(order.items);
                                    const fulfilmentStatus = getFulfilmentStatus(order.status);
                                    const sequentialNumber = index + 1;

                                    return (
                                        <tr key={order.id}>
                                            <td className="order-id">#{sequentialNumber}</td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>{order.shipping_name || 'N/A'}</td>
                                            <td>
                                                <span className={`status-badge payment-status ${order.payment?.toLowerCase() || 'cod'}`}>
                                                    {order.payment || 'COD'}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td>{order.shipping_city || 'N/A'}</td>
                                            <td>{itemsCount} items</td>
                                            <td>
                                                <span className={`status-badge fulfilment-status ${fulfilmentStatus.toLowerCase()}`}>
                                                    <span className="dropdown-arrow">▼</span>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-icons">
                                                    {/* <Link to={`/orders/${order.id}`}> */}
                                                    <button id='view' onClick={() => onSelectOrder(order.id)}>
                                                        <span className="icon view-icon" title="View Details">👁️</span>View</button>
                                                    {/* </Link> */}
                                                </div>
                                            </td>
                                        </tr>

                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;