import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../services/api';
import './Checkout.css';

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'Credit Card', // Default
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Custom handler for the visual payment cards
  const selectPaymentMethod = (method) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      await orderAPI.create(orderData);
      // alert('Order placed successfully!'); // Optional: replaced by navigation
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty-state">
          <div className="empty-icon-container">
            <span role="img" aria-label="bag">🛍️</span>
          </div>
          <h2>Your cart is empty</h2>
          <Link to="/products" className="btn-shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculations
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="container">

        <div className="checkout-header">
          <h1 className="page-title">Checkout</h1>
          <div className="secure-badge-header">
            🔒 Secure SSL Connection
          </div>
        </div>

        <div className="checkout-layout">
          {/* LEFT COLUMN: FORM */}
          <div className="form-section">

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} id="checkout-form">

              {/* Shipping Details */}
              <div className="form-card">
                <div className="card-header">
                  <span className="step-icon">1</span>
                  <h3>Shipping Details</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 Main St, Apt 4B"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State / Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-card">
                <div className="card-header">
                  <span className="step-icon">2</span>
                  <h3>Payment Method</h3>
                </div>

                <div className="payment-grid">
                  <div
                    className={`payment-option ${formData.paymentMethod === 'Credit Card' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('Credit Card')}
                  >
                    <span className="radio-circle"></span>
                    <span className="pay-icon">💳</span>
                    <span>Credit Card</span>
                  </div>

                  <div
                    className={`payment-option ${formData.paymentMethod === 'PayPal' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('PayPal')}
                  >
                    <span className="radio-circle"></span>
                    <span className="pay-icon">🅿️</span>
                    <span>PayPal</span>
                  </div>

                  <div
                    className={`payment-option ${formData.paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('Cash on Delivery')}
                  >
                    <span className="radio-circle"></span>
                    <span className="pay-icon">💵</span>
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-products">
                {cart.items.map((item) => (
                  <div key={item._id} className="mini-item">
                    <div className="mini-img-wrapper">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                      />
                      <span className="mini-qty">{item.quantity}</span>
                    </div>
                    <div className="mini-info">
                      <h4>{item.product?.name}</h4>
                      <p>{item.size} / {item.color}</p>
                    </div>
                    <span className="mini-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="free-text">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (15%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span className="total-price">${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form" // Links button to the form
                className="btn-place-order"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>

              <p className="terms-text">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;