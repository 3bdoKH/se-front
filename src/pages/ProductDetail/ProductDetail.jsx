import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Loader/Loader';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await productAPI.getById(id);
      setProduct(data.data);
      if (data.data.sizes && data.data.sizes.length > 0) {
        setSelectedSize(data.data.sizes[0]);
      }
      if (data.data.colors && data.data.colors.length > 0) {
        setSelectedColor(data.data.colors[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setMessage({ type: 'error', text: 'Failed to load product' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSize || !selectedColor) {
      setMessage({ type: 'error', text: 'Please select size and color' });
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      setMessage({ type: 'success', text: 'Added to cart successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add to cart',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <span className="stars">
              {'⭐'.repeat(Math.round(product.rating || 0))}
              {'☆'.repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span className="review-count">({product.numReviews} reviews)</span>
          </div>

          <div className="product-price">${product.price.toFixed(2)}</div>

          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          {product.stock > 0 && (
            <div className="product-options">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>
          )}

          {/* Product Meta */}
          <div className="product-meta">
            <div className="meta-item">
              <strong>Category:</strong> {product.category?.name || 'N/A'}
            </div>
            <div className="meta-item">
              <strong>SKU:</strong> {product._id?.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.name}</span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

