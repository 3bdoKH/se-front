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
        alert('Order cancelled successfully');
        loadOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order');
      }
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

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h2>Please login to view your orders</h2>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <span className="empty-icon">📦</span>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <button onClick={() => navigate('/products')} className="shop-btn">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        <p className="orders-count">{orders.length} orders found</p>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status-section">
                  <span
                    className="order-status"
                    style={{ background: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>
                        Size: {item.size} | Color: {item.color} | Qty:{' '}
                        {item.quantity}
                      </p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-summary">
                  <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {(
                        order.totalPrice -
                        order.shippingPrice -
                        order.taxPrice
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Shipping:</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Tax:</span>
                    <span>${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  {(order.orderStatus === 'pending' ||
                    order.orderStatus === 'processing') && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="shipping-info">
                <h4>Shipping Address:</h4>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  , {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

