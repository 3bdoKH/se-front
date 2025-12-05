import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const getStockStatus = () => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.images[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="product-image"
          />
          {product.featured && <span className="featured-badge">Featured</span>}
          <span className={`stock-badge ${getStockStatus()}`}>
            {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.substring(0, 80)}...
          </p>

          <div className="product-rating">
            <span className="stars">
              {'⭐'.repeat(Math.round(product.rating || 0))}
              {'☆'.repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span className="review-count">({product.numReviews} reviews)</span>
          </div>

          <div className="product-footer">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.stock > 0 && (
              <button className="quick-view-btn">View Details</button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

