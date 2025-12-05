import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data } = await productAPI.getFeatured();
      setFeaturedProducts(data.data);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center">
          <span className="hero-subtitle animate-up">New Arrivals 2025</span>
          <h1 className="hero-title animate-up delay-1">
            Define Your Appearance.
          </h1>
          <p className="hero-description animate-up delay-2">
            Curated fashion for those who demand style and substance. Explore the new collection today.
          </p>
          <div className="hero-btns animate-up delay-3">
            <Link to="/products" className="btn btn-primary glow">
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-box animate-fade">
              <div className="icon-wrapper">
                <span className="feature-icon">🚚</span>
              </div>
              <div className="feature-info">
                <h3>Fast Delivery</h3>
                <p>Free global shipping on orders over $100.</p>
              </div>
            </div>
            <div className="feature-box animate-fade delay-1">
              <div className="icon-wrapper">
                <span className="feature-icon">🛡️</span>
              </div>
              <div className="feature-info">
                <h3>Secure Checkout</h3>
                <p>256-bit SSL encryption for safe payments.</p>
              </div>
            </div>
            <div className="feature-box animate-fade delay-2">
              <div className="icon-wrapper">
                <span className="feature-icon">↩️</span>
              </div>
              <div className="feature-info">
                <h3>Easy Returns</h3>
                <p>Risk-free 30-day exchange policy.</p>
              </div>
            </div>
            <div className="feature-box animate-fade delay-3">
              <div className="icon-wrapper">
                <span className="feature-icon">✨</span>
              </div>
              <div className="feature-info">
                <h3>Finest Quality</h3>
                <p>Handpicked materials and craftsmanship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding categories-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline">Collections</span>
            <h2>Shop by Category</h2>
          </div>

          <div className="categories-modern-grid">
            <Link to="/products?category=6932d55ad003bd8ca5bc7c7a&sort=newest" className="cat-card large-card">
              <div className="cat-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800')"}}></div>
              <div className="cat-glass-panel">
                <div className="panel-content">
                  <h3>Men's Collection</h3>
                  <span className="panel-btn">Explore Now</span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=6932d55ad003bd8ca5bc7c7b&sort=newest" className="cat-card large-card">
              <div className="cat-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800')"}}></div>
              <div className="cat-glass-panel">
                <div className="panel-content">
                  <h3>Women's Collection</h3>
                  <span className="panel-btn">Explore Now</span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=6932d55ad003bd8ca5bc7c7c&sort=newest" className="cat-card">
              <div className="cat-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800')"}}></div>
              <div className="cat-glass-panel">
                <div className="panel-content">
                  <h3>Accessories</h3>
                  <span className="panel-btn">Shop Now</span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=6932d55ad003bd8ca5bc7c7d&sort=newest" className="cat-card">
              <div className="cat-img" style={{backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800')"}}></div>
              <div className="cat-glass-panel">
                <div className="panel-content">
                  <h3>Footwear</h3>
                  <span className="panel-btn">Shop Now</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section (UPDATED) */}
      <section className="section-padding featured-section">
        <div className="container">
          <div className="section-header flex-header">
            <div>
              <span className="section-tagline">Trending Now</span>
              <h2>Weekly Selection</h2>
            </div>
            <Link to="/products" className="view-all-outline-btn">
              View All Products
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                // Wrapped in a div to control hover effects from Home.css
                <div key={product._id} className="featured-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-float-section">
        <div className="container">
          <div className="newsletter-card-clean">
            <div className="newsletter-text">
              <h2>Unlock 15% Off Your First Order</h2>
              <p>Sign up for exclusive access to new drops and secret sales.</p>
            </div>
            <form className="newsletter-form-pill">
              <input
                type="email"
                placeholder="Your email address"
                className="pill-input"
              />
              <button type="submit" className="pill-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;