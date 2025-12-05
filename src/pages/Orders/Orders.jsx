import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancel(orderId);
        loadOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      case 'processing': return 'status-processing';
      default: return 'status-pending';
    }
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-empty-state">
          <div className="empty-icon-container">🔒</div>
          <h2>Sign in to view orders</h2>
          <p>Track your purchases and view order history.</p>
          <button onClick={() => navigate('/login')} className="btn-primary-orders glow">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loader-center"><Loader /></div>;

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty-state">
          <div className="empty-icon-container">🛍️</div>
          <h2>No orders yet</h2>
          <p>It looks like you haven't placed an order yet.</p>
          <button onClick={() => navigate('/products')} className="btn-primary-orders glow">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        <div className="orders-header-section">
          <div>
            <h1 className="page-title">Order History</h1>
            <p className="page-subtitle">Track and manage your recent purchases</p>
          </div>
          <div className="orders-count-badge">
            {orders.length} Total
          </div>
        </div>

        <div className="orders-stack">
          {orders.map((order) => (
            <div key={order._id} className="order-card-premium">

              {/* Header */}
              <div className="card-top-bar">
                <div className="order-id-group">
                  <span className="label">Order ID</span>
                  <span className="value">#{order._id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="order-date-group">
                  <span className="label">Date Placed</span>
                  <span className="value">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className={`status-badge-premium ${getStatusStyle(order.orderStatus)}`}>
                  <span className="status-dot"></span>
                  {order.orderStatus}
                </div>
              </div>

              {/* Body: Items & Address */}
              <div className="card-body">
                <div className="items-column">
                  {order.items.map((item, index) => (
                    <div key={index} className="premium-item-row">
                      <div className="item-thumb-premium">
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                        />
                        <span className="item-qty-badge">{item.quantity}</span>
                      </div>
                      <div className="item-info-premium">
                        <h4>{item.name}</h4>
                        <div className="item-specs">
                          {item.size && <span>{item.size}</span>}
                          {item.color && <span className="spec-dot">• {item.color}</span>}
                        </div>
                        <div className="item-price-premium">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="info-column">
                  <div className="shipping-box">
                    <h5>Shipping Address</h5>
                    <p>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer: Totals & Actions */}
              <div className="card-footer-premium">
                <div className="actions-wrapper">
                  {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                    <button
                      className="btn-cancel-premium"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                <div className="receipt-box">
                  <div className="receipt-row">
                    <span>Subtotal</span>
                    <span>${(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Shipping</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="receipt-divider"></div>
                  <div className="receipt-row total">
                    <span>Total Paid</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;