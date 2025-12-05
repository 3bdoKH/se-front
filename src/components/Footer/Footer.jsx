import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section brand-section">
          <Link to="/" className="footer-logo">
            LUXE
          </Link>
          <p className="brand-desc">
            Redefining modern fashion with timeless essentials.
            Quality, sustainability, and style in every stitch.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="Twitter" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-section">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Collection</Link></li>
            <li><Link to="/cart">Shopping Bag</Link></li>
            <li><Link to="/orders">Order History</Link></li>
          </ul>
        </div>

        {/* Categories Section (Updated with IDs) */}
        <div className="footer-section">
          <h4>Collections</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=6932d55ad003bd8ca5bc7c7a&sort=newest">Men</Link></li>
            <li><Link to="/products?category=6932d55ad003bd8ca5bc7c7b&sort=newest">Women</Link></li>
            <li><Link to="/products?category=6932d55ad003bd8ca5bc7c7c&sort=newest">Accessories</Link></li>
            <li><Link to="/products?category=6932d55ad003bd8ca5bc7c7d&sort=newest">Footwear</Link></li>
          </ul>
        </div>

        {/* Contact/Newsletter Section */}
        <div className="footer-section">
          <h4>Customer Care</h4>
          <ul className="contact-list">
            <li>
              <span className="icon">✉️</span> support@luxe.com
            </li>
            <li>
              <span className="icon">📞</span> +1 (800) 123-4567
            </li>
            <li>
              <span className="icon">📍</span> New York, NY
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2025 LUXE Fashion. All rights reserved.</p>
          <div className="legal-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;