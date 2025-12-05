import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Orders from './pages/Orders/Orders';
import Profile from './pages/Profile/Profile';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ManageProducts from './pages/Admin/ManageProducts/ManageProducts';
import ManageOrders from './pages/Admin/ManageOrders/ManageOrders';
import ManageUsers from './pages/Admin/ManageUsers/ManageUsers';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return isAdmin() ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetail />} />

                                {/* Protected Routes */}
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute>
                                            <Cart />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute>
                                            <Checkout />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <Orders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Admin Routes */}
                                <Route
                                    path="/admin"
                                    element={
                                        <AdminRoute>
                                            <Dashboard />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/admin/products"
                                    element={
                                        <AdminRoute>
                                            <ManageProducts />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/admin/orders"
                                    element={
                                        <AdminRoute>
                                            <ManageOrders />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/admin/users"
                                    element={
                                        <AdminRoute>
                                            <ManageUsers />
                                        </AdminRoute>
                                    }
                                />

                                {/* 404 Route */}
                                <Route path="*" element={<div className="not-found"><h1>404 - Page Not Found</h1></div>} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

