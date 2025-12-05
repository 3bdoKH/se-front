import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Fashion Store</h3>
          <p>Your one-stop shop for trendy fashion and accessories.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/products">Men's Clothing</Link></li>
            <li><Link to="/products">Women's Clothing</Link></li>
            <li><Link to="/products">Accessories</Link></li>
            <li><Link to="/products">Shoes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@fashionstore.com</p>
          <p>Phone: +1 (234) 567-8900</p>
          <div className="social-links">
            <span>📘</span>
            <span>📷</span>
            <span>🐦</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Fashion Store. All rights reserved. | SE Project</p>
      </div>
    </footer>
  );
};

export default Footer;

