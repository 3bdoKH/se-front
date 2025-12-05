import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import './ManageOrders.css';
import { X } from 'lucide-react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const params = filter ? { status: filter } : {};
            const { data } = await orderAPI.getAll(params);
            setOrders(data.data);
        } catch (error) {
            alert('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = async (orderId, orderStatus, paymentStatus) => {
        try {
            await orderAPI.updateStatus(orderId, { orderStatus, paymentStatus });
            alert('Order status updated successfully!');
            loadOrders();
            handleCloseModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffc107',
            processing: '#17a2b8',
            shipped: '#007bff',
            delivered: '#28a745',
            cancelled: '#dc3545',
        };
        return colors[status] || '#6c757d';
    };

    if (loading) return <Loader />;

    return (
        <div className="manage-orders-page">
            <div className="manage-orders-container">
                <div className="page-header">
                    <h1>Manage Orders</h1>
                </div>

                <div className="filter-navigation">
                    <button
                        className={`filter-btn ${filter === '' ? 'active' : ''}`}
                        onClick={() => setFilter('')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
                        onClick={() => setFilter('processing')}
                    >
                        Processing
                    </button>
                    <button
                        className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
                        onClick={() => setFilter('shipped')}
                    >
                        Shipped
                    </button>
                    <button
                        className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setFilter('delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled
                    </button>
                </div>

                <div className="orders-stats">
                    <div className="stat-box">
                        <strong>{orders.length}</strong>
                        <span>Total Orders</span>
                    </div>
                    <div className="stat-box">
                        <strong>
                            ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                        </strong>
                        <span>Total Value</span>
                    </div>
                </div>

                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{order.items.length} items</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <span className={`payment-badge ${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{ background: getStatusColor(order.orderStatus) }}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Detail Modal */}
                {showModal && selectedOrder && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Order #{selectedOrder._id.substring(0, 8).toUpperCase()}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>
                                    <X />
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Customer Info */}
                                <div className="info-section">
                                    <h3>Customer Information</h3>
                                    <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                </div>

                                {/* Shipping Address */}
                                <div className="info-section">
                                    <h3>Shipping Address</h3>
                                    <p>
                                        {selectedOrder.shippingAddress.street}<br />
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                                        {selectedOrder.shippingAddress.zipCode}<br />
                                        {selectedOrder.shippingAddress.country}
                                    </p>
                                </div>

                                {/* Order Items */}
                                <div className="info-section">
                                    <h3>Order Items</h3>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img src={item.image} alt={item.name} />
                                            <div>
                                                <strong>{item.name}</strong>
                                                <p>
                                                    Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                                </p>
                                                <p>${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Update Status */}
                                <div className="info-section">
                                    <h3>Update Order Status</h3>
                                    <div className="status-buttons">
                                        <button
                                            className="status-update-btn pending"
                                            onClick={() =>
                                                handleUpdateStatus(selectedOrder._id, 'pending', selectedOrder.paymentStatus)
                                            }
                                        >
                                            Pending
                                        </button>
                                        <button
                                            className="status-update-btn processing"
                                            onClick={() =>
                                                handleUpdateStatus(selectedOrder._id, 'processing', selectedOrder.paymentStatus)
                                            }
                                        >
                                            Processing
                                        </button>
                                        <button
                                            className="status-update-btn shipped"
                                            onClick={() =>
                                                handleUpdateStatus(selectedOrder._id, 'shipped', 'paid')
                                            }
                                        >
                                            Shipped
                                        </button>
                                        <button
                                            className="status-update-btn delivered"
                                            onClick={() =>
                                                handleUpdateStatus(selectedOrder._id, 'delivered', 'paid')
                                            }
                                        >
                                            Delivered
                                        </button>
                                        <button
                                            className="status-update-btn cancelled"
                                            onClick={() =>
                                                handleUpdateStatus(selectedOrder._id, 'cancelled', selectedOrder.paymentStatus)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="info-section">
                                    <h3>Order Summary</h3>
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span>
                                            $
                                            {(
                                                selectedOrder.totalPrice -
                                                selectedOrder.shippingPrice -
                                                selectedOrder.taxPrice
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping:</span>
                                        <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Tax:</span>
                                        <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total:</span>
                                        <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;

