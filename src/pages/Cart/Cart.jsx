import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Loader/Loader';
import './Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="login-btn">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to remove item');
      }
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Start adding items to your cart!</p>
          <Link to="/products" className="shop-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="cart-count">{cart.items.length} items in your cart</p>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={item.product?.name}
                  className="item-image"
                />

                <div className="item-details">
                  <h3>{item.product?.name}</h3>
                  <p className="item-options">
                    Size: <strong>{item.size}</strong> | Color:{' '}
                    <strong>{item.color}</strong>
                  </p>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product?.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{cart.totalPrice > 100 ? 'FREE' : '$10.00'}</span>
            </div>

            <div className="summary-row">
              <span>Tax (15%)</span>
              <span>${(cart.totalPrice * 0.15).toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>
                $
                {(
                  cart.totalPrice +
                  (cart.totalPrice > 100 ? 0 : 10) +
                  cart.totalPrice * 0.15
                ).toFixed(2)}
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

