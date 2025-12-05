import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        loadUsers();
    }, [searchTerm, roleFilter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (roleFilter) params.role = roleFilter;

            const { data } = await adminAPI.getUsers(params);
            setUsers(data.data);
        } catch (error) {
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        const action = currentStatus ? 'unblock' : 'block';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await adminAPI.blockUser(userId);
                alert(`User ${action}ed successfully!`);
                loadUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Operation failed');
            }
        }
    };

    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (window.confirm(`Change user role to ${newRole}?`)) {
            try {
                await adminAPI.updateUserRole(userId, { role: newRole });
                alert('User role updated successfully!');
                loadUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Operation failed');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone!')) {
            try {
                await adminAPI.deleteUser(userId);
                alert('User deleted successfully!');
                loadUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="manage-users-page">
            <div className="manage-users-container">
                <div className="page-header">
                    <h1>Manage Users</h1>
                    <div className="header-actions">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Roles</option>
                            <option value="customer">Customers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                <div className="users-stats">
                    <div className="stat-box">
                        <strong>{users.length}</strong>
                        <span>Total Users</span>
                    </div>
                    <div className="stat-box">
                        <strong>{users.filter((u) => u.role === 'customer').length}</strong>
                        <span>Customers</span>
                    </div>
                    <div className="stat-box">
                        <strong>{users.filter((u) => u.role === 'admin').length}</strong>
                        <span>Admins</span>
                    </div>
                    <div className="stat-box">
                        <strong>{users.filter((u) => u.isBlocked).length}</strong>
                        <span>Blocked</span>
                    </div>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className={user.isBlocked ? 'blocked-row' : ''}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {user.role !== 'admin' && (
                                                <>
                                                    <button
                                                        className={`block-btn ${user.isBlocked ? 'unblock' : ''}`}
                                                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                                    >
                                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="role-btn"
                                                onClick={() => handleUpdateRole(user._id, user.role)}
                                            >
                                                {user.role === 'admin' ? '→ Customer' : '→ Admin'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;

