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
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">👕</span>
                    Fashion Store
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/products" className="navbar-link" onClick={() => setMenuOpen(false)}>
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link to="/cart" className="navbar-link cart-link" onClick={() => setMenuOpen(false)}>
                                <span className="cart-icon">🛒</span>
                                Cart
                                {getCartCount() > 0 && (
                                    <span className="cart-badge">{getCartCount()}</span>
                                )}
                            </Link>
                            <Link to="/orders" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                My Orders
                            </Link>
                            <Link to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                Profile
                            </Link>
                            {isAdmin() && (
                                <Link to="/admin" className="navbar-link admin-link" onClick={() => setMenuOpen(false)}>
                                    Admin Panel
                                </Link>
                            )}
                            <div className="navbar-user">
                                <span className="user-name">{user.name}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="navbar-btn" onClick={() => setMenuOpen(false)}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

