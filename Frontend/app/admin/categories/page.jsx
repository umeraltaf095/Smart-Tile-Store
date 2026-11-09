'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New Category Form State (strictly matching the MongoDB schema: name, description, status)
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState('active');
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  };

  // 1. Fetch categories from Backend API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        showToast(data.message || 'Failed to fetch categories', 'error');
      }
    } catch (err) {
      showToast('Network error while loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Add New Category (POST API)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim(),
          status: newStatus,
        }),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to create category', 'error');
        return;
      }

      showToast(data.message || 'Category created successfully!', 'success');
      setShowAddModal(false);
      setNewName('');
      setNewDesc('');
      setNewStatus('active');
      fetchCategories();
    } catch (err) {
      setActionLoading(false);
      showToast('Network error creating category', 'error');
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (cat) => {
    setCurrentEditCategory({
      _id: cat._id,
      name: cat.name,
      description: cat.description || '',
      status: cat.status || 'active',
    });
    setShowEditModal(true);
  };

  // 4. Update Existing Category (PUT API)
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!currentEditCategory || !currentEditCategory.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/categories/${currentEditCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentEditCategory.name.trim(),
          description: currentEditCategory.description.trim(),
          status: currentEditCategory.status,
        }),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to update category', 'error');
        return;
      }

      showToast(data.message || 'Category updated successfully!', 'success');
      setShowEditModal(false);
      setCurrentEditCategory(null);
      fetchCategories();
    } catch (err) {
      setActionLoading(false);
      showToast('Network error updating category', 'error');
    }
  };

  // 5. Delete Category - Open Custom Confirmation Modal
  const confirmDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  // Execute Delete via API
  const executeDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setDeleteLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to delete category', 'error');
        return;
      }

      showToast(`Category "${categoryToDelete.name}" deleted successfully!`, 'success');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      setDeleteLoading(false);
      showToast('Network error deleting category', 'error');
    }
  };

  const activeCount = categories.filter((c) => c.status === 'active').length;
  const inactiveCount = categories.filter((c) => c.status === 'inactive').length;

  return (
    <>
      <AdminHeader />

      <section className="section-container">
        {/* Page Header & Action Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              Manage Tile Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Create, update, and manage tile classifications directly connected to the MongoDB backend.
            </p>
          </div>
          <button className="btn-admin-action" onClick={() => setShowAddModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Category
          </button>
        </div>

        {/* Quick Stats Summary */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Total Categories</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">Active Categories</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{inactiveCount}</span>
              <span className="stat-label">Inactive Categories</span>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div style={{ marginTop: '28px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading categories from API...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No categories found. Click "Add New Category" above to create your first tile classification.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat._id || idx}>
                    <td>
                      <strong style={{ color: 'var(--text-dim)' }}>{idx + 1}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.96rem' }}>
                        {cat.name}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: '350px' }}>
                      {cat.description || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No description</span>}
                    </td>
                    <td>
                      <span
                        className="badge-tag"
                        style={{
                          background: cat.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: cat.status === 'active' ? '#10b981' : '#ef4444',
                          textTransform: 'capitalize',
                          fontWeight: 600,
                        }}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-tbl" onClick={() => openEditModal(cat)} title="Edit Category">
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-tbl"
                          onClick={() => confirmDeleteCategory(cat)}
                          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                          title="Delete Category"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Create New Tile Category</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Floor Tiles, Washroom Tiles"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Brief description of the tile category and its utility..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Status <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className="form-input"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="active">Active (Visible in Storefront)</option>
                    <option value="inactive">Inactive (Hidden from Customers)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-action" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && currentEditCategory && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Edit Tile Category</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentEditCategory.name}
                    onChange={(e) => setCurrentEditCategory({ ...currentEditCategory, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={currentEditCategory.description}
                    onChange={(e) => setCurrentEditCategory({ ...currentEditCategory, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Status <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className="form-input"
                    value={currentEditCategory.status}
                    onChange={(e) => setCurrentEditCategory({ ...currentEditCategory, status: e.target.value })}
                    required
                  >
                    <option value="active">Active (Visible in Storefront)</option>
                    <option value="inactive">Inactive (Hidden from Customers)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowEditModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-action" disabled={actionLoading}>
                  {actionLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: '460px', textAlign: 'center', padding: '28px 24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Delete Category?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>"{categoryToDelete.name}"</strong>? This will remove this classification from your system.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-tbl"
                style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                onClick={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit"
                style={{
                  background: '#ef4444',
                  borderColor: '#ef4444',
                  width: 'auto',
                  padding: '10px 22px',
                  fontSize: '0.9rem'
                }}
                onClick={executeDeleteCategory}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
