import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
      <nav className="navbar">
        <div className="navbar-container">

          {/* LEFT — BRAND */}
          <Link to="/" className="navbar-logo">
            <div className="logo-box">L</div>
            <span className="brand-name">LUXE</span>
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className={`navbar-toggle ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>

          {/* RIGHT — MENU */}
          <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>

            <div className="nav-section">
              <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/products" className="navbar-link" onClick={() => setMenuOpen(false)}>Collection</Link>
            </div>

            <div className="nav-section">
              {user ? (
                <>
                  <Link to="/cart" className="navbar-link cart-link" onClick={() => setMenuOpen(false)}>
                    <span className="cart-icon">🛒</span> Cart
                    {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                  </Link>

                  <Link to="/orders" className="navbar-link">Orders</Link>
                  <Link to="/profile" className="navbar-link">Profile</Link>

                  {isAdmin() && (
                    <Link to="/admin" className="navbar-link admin-link">Admin</Link>
                  )}

                  <div className="navbar-user">
                    <span className="user-name">{user.name}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-link">Login</Link>
                  <Link to="/register" className="navbar-btn">Sign Up</Link>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

    );
};

export default Navbar;

