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
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Fashion Store</h1>
          <p className="hero-subtitle">
            Discover the latest trends in fashion and style
          </p>
          <Link to="/products" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Free Shipping</h3>
            <p>On orders over $100</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💳</span>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⭐</span>
            <h3>Quality Products</h3>
            <p>Top quality guaranteed</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-link">
            View All →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/products?category=men" className="category-card">
            <div className="category-image men"></div>
            <h3>Men's Clothing</h3>
          </Link>
          <Link to="/products?category=women" className="category-card">
            <div className="category-image women"></div>
            <h3>Women's Clothing</h3>
          </Link>
          <Link to="/products?category=accessories" className="category-card">
            <div className="category-image accessories"></div>
            <h3>Accessories</h3>
          </Link>
          <Link to="/products?category=shoes" className="category-card">
            <div className="category-image shoes"></div>
            <h3>Shoes</h3>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and special offers!</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

