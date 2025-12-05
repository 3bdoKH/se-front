import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import { X } from 'lucide-react';
import './ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const { data } = await categoryAPI.getAll();
            setCategories(data.data);
            console.log(data.data);
        } catch (error) {
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                image: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await categoryAPI.update(editingCategory._id, formData);
                alert('Category updated successfully!');
            } else {
                await categoryAPI.create(formData);
                alert('Category created successfully!');
            }
            handleCloseModal();
            loadCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category!')) {
            try {
                await categoryAPI.delete(id);
                alert('Category deleted successfully!');
                loadCategories();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="manage-categories-page">
            <div className="manage-categories-container">
                <div className="page-header">
                    <h1>Manage Categories</h1>
                    <button className="add-btn" onClick={() => handleOpenModal()}>
                        + Add Category
                    </button>
                </div>

                <div className="categories-grid">
                    {categories.map((category) => (
                        <div key={category._id} className="category-card">
                            <div className="category-image">
                                <img
                                    src={category.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                                    alt={category.name}
                                />
                            </div>
                            <div className="category-info">
                                <h3>{category.name}</h3>
                                <p>{category.description || 'No description'}</p>

                            </div>
                            <div className="category-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleOpenModal(category)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(category._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="empty-state">
                        <p>No categories found. Create your first category!</p>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>
                                    <X />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="category-form">
                                <div className="form-group">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Men's Clothing, Women's Shoes"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Brief description of this category..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cover Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {formData.image && (
                                        <div className="image-preview">
                                            <img src={formData.image} alt="Preview" />
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        {editingCategory ? 'Update Category' : 'Create Category'}
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

export default ManageCategories;

