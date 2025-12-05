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

  // 1. Not Logged In State
  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-icon-container">
            <span role="img" aria-label="lock">🔒</span>
          </div>
          <h2>Sign in to view your cart</h2>
          <p>You need to be logged in to see items in your shopping bag.</p>
          <Link to="/login" className="btn-primary glow">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loader-center"><Loader /></div>;

  // 2. Empty Cart State
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-icon-container">
            <span role="img" aria-label="bag">🛍️</span>
          </div>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary glow">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from your cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Calculations
  const shippingCost = cart.totalPrice > 100 ? 0 : 10;
  const taxCost = cart.totalPrice * 0.15;
  const finalTotal = cart.totalPrice + shippingCost + taxCost;

  return (
    <div className="cart-page">
      <div className="container">

        <div className="cart-header">
          <h1 className="page-title">Shopping Bag</h1>
          <span className="item-count-badge">
            {cart.items.length} items
          </span>
        </div>

        <div className="cart-layout">
          {/* LEFT: Cart Items List */}
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item-card animate-up">

                {/* Image */}
                <div className="item-img-wrapper animate-shine">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={item.product?.name}
                  />
                </div>

                {/* Details */}
                <div className="item-info">
                  <div className="info-top">
                    <div className="name-and-variants">
                      <Link to={`/products/${item.product._id}`} className="item-name">
                        {item.product?.name}
                      </Link>
                      <div className="item-variants-text">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="item-bottom">
                    <div className="qty-selector-pill">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product?.stock}
                      >+</button>
                    </div>

                    <div className="price-block">
                      <span className="unit-price">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="cart-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span className="label-with-icon">📦 Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span className="label-with-icon">🚚 Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-brand">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              <div className="summary-line">
                <span className="label-with-icon">📄 Tax (15%)</span>
                <span>${taxCost.toFixed(2)}</span>
              </div>

              <div className="divider"></div>

              <div className="summary-line total">
                <span>Estimated Total</span>
                <span className="total-amount">${finalTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn-checkout glow"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <div className="secure-badge">
                <span role="img" aria-label="shield">🛡️</span> Secure SSL Encryption
              </div>
            </div>

            <Link to="/products" className="continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;