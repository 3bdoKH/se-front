import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search removed from state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params[key] = newFilters[key];
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="products-container">
          <h1 className="page-title">The Collection</h1>
          <p className="page-subtitle">Timeless essentials for everyday living.</p>
        </div>
      </div>

      <div className="products-container products-layout">

        {/* MOBILE CONTROLS (Visible only on mobile) */}
        <div className="mobile-controls">
          <button
            className={`mobile-filter-btn ${isMobileFilterOpen ? 'active' : ''}`}
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <span className="icon">⚡</span> Filters
          </button>

          <div className="mobile-sort">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* SIDEBAR FILTER */}
        <aside className={`filters-sidebar-minimal ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Refine Selection</h3>
            {(filters.category || filters.minPrice || filters.maxPrice) && (
              <button onClick={clearFilters} className="clear-text-btn">
                Clear All
              </button>
            )}
          </div>

          <div className="filter-section">
            <h4 className="filter-title">Categories</h4>
            <div className="category-list">
              <button
                className={`cat-item ${filters.category === '' ? 'active' : ''}`}
                onClick={() => {
                  handleFilterChange('category', '');
                  setIsMobileFilterOpen(false);
                }}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`cat-item ${filters.category === cat._id ? 'active' : ''}`}
                  onClick={() => {
                    handleFilterChange('category', cat._id);
                    setIsMobileFilterOpen(false);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-range-group">
              <div className="price-input-box">
                <span>$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <span className="range-dash">—</span>
              <div className="price-input-box">
                <span>$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Close button for mobile inside the drawer */}
          <button
            className="mobile-close-filters"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Show {products.length} Results
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <div className="products-content">
          {/* Desktop Top Bar (Hidden on Mobile) */}
          <div className="products-topbar desktop-only">
            <span className="results-count">
              Showing <strong>{products.length}</strong> results
            </span>
            <div className="sort-wrapper">
              <span className="sort-label">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loader-container"><Loader /></div>
          ) : products.length === 0 ? (
            <div className="no-products-minimal">
              <h3>No products found</h3>
              <p>Try changing your category or price range.</p>
              <button onClick={clearFilters} className="reset-btn-link">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="product-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;