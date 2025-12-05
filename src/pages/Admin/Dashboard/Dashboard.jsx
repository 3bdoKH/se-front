import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import './Dashboard.css';
import { CircleDollarSign, Shirt, User, PackageSearch, Layers } from 'lucide-react';
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!stats) {
    return <div className="dashboard-error">Failed to load dashboard</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your store performance</p>

        {/* Overview Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#667eea' }}>
              <CircleDollarSign />
            </div>
            <div className="stat-info">
              <h3>${stats.overview.totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#28a745' }}>
              <PackageSearch />
            </div>
            <div className="stat-info">
              <h3>{stats.overview.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ffc107' }}>
              <User />
            </div>
            <div className="stat-info">
              <h3>{stats.overview.totalUsers}</h3>
              <p>Total Customers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#17a2b8' }}>
              <Shirt />
            </div>
            <div className="stat-info">
              <h3>{stats.overview.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all">
                View All →
              </Link>
            </div>
            <div className="recent-orders">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <strong>#{order._id.substring(0, 8)}</strong>
                    <span>{order.user.name}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-status">{order.orderStatus}</span>
                    <span className="order-price">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Top Selling Products</h2>
              <Link to="/admin/products" className="view-all">
                View All →
              </Link>
            </div>
            <div className="top-products">
              {stats.topProducts.map((product) => (
                <div key={product._id} className="product-item">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/60'}
                    alt={product.name}
                  />
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <span>Sold: {product.sold} units</span>
                  </div>
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="alert-section">
            <h2>⚠️ Low Stock Alert</h2>
            <div className="low-stock-items">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="low-stock-item">
                  <span>{product.name}</span>
                  <span className="stock-count">
                    Only {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-btn">
              <Shirt /> Manage Products
            </Link>
            <Link to="/admin/categories" className="action-btn">
              <Layers /> Manage Categories
            </Link>
            <Link to="/admin/orders" className="action-btn">
              <PackageSearch /> Manage Orders
            </Link>
            <Link to="/admin/users" className="action-btn">
              <User /> Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

