import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import './ManageProducts.css';
import { Star } from 'lucide-react';
const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        images: '',
        sizes: '',
        colors: '',
        stock: '',
        featured: false,
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productAPI.getAll({});
            setProducts(data.data);
        } catch (error) {
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.data);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category._id || product.category,
                images: product.images.join(', '),
                sizes: product.sizes.join(', '),
                colors: product.colors.join(', '),
                stock: product.stock,
                featured: product.featured,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                images: '',
                sizes: '',
                colors: '',
                stock: '',
                featured: false,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            images: formData.images.split(',').map((img) => img.trim()),
            sizes: formData.sizes.split(',').map((size) => size.trim()),
            colors: formData.colors.split(',').map((color) => color.trim()),
            stock: parseInt(formData.stock),
            featured: formData.featured,
        };

        try {
            if (editingProduct) {
                await productAPI.update(editingProduct._id, productData);
                alert('Product updated successfully!');
            } else {
                await productAPI.create(productData);
                alert('Product created successfully!');
            }
            handleCloseModal();
            loadProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productAPI.delete(id);
                alert('Product deleted successfully!');
                loadProducts();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="manage-products-page">
            <div className="manage-products-container">
                <div className="page-header">
                    <h1>Manage Products</h1>
                    <button className="add-btn" onClick={() => handleOpenModal()}>
                        + Add Product
                    </button>
                </div>

                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.images[0] || 'https://via.placeholder.com/60'}
                                            alt={product.name}
                                            className="product-thumbnail"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>
                                        <span className={product.stock < 10 ? 'low-stock' : ''}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>{product.featured ? <Star color="#cddb00" /> : '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleOpenModal(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Images (comma-separated URLs)</label>
                                    <input
                                        type="text"
                                        name="images"
                                        value={formData.images}
                                        onChange={handleChange}
                                        placeholder="https://image1.jpg, https://image2.jpg"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Sizes (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="sizes"
                                            value={formData.sizes}
                                            onChange={handleChange}
                                            placeholder="S, M, L, XL"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Colors (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="colors"
                                            value={formData.colors}
                                            onChange={handleChange}
                                            placeholder="Red, Blue, Green"
                                        />
                                    </div>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                        />
                                        Featured Product
                                    </label>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;

