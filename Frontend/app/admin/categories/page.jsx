'use client';

import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';
import { initialCategories } from '../../../lib/data';

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);

  // New Category Form
  const [newCode, setNewCode] = useState('');
  const [newIcon, setNewIcon] = useState('✨');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

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

  const handleAddCategory = (e) => {
    e.preventDefault();
    const newCat = {
      id: Date.now(),
      code: newCode,
      icon: newIcon,
      name: newName,
      desc: newDesc,
      itemsCount: 0,
      status: 'Active',
    };

    setCategories([newCat, ...categories]);
    setShowAddModal(false);
    showToast(`Category "${newName}" (${newCode}) added successfully!`, 'success');
    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  const openEditModal = (cat) => {
    setCurrentEditCategory(cat);
    setShowEditModal(true);
  };

  const handleEditCategory = (e) => {
    e.preventDefault();
    if (!currentEditCategory) return;

    setCategories(
      categories.map((c) =>
        c.id === currentEditCategory.id ? { ...currentEditCategory } : c
      )
    );

    setShowEditModal(false);
    showToast(`Category "${currentEditCategory.name}" updated successfully!`, 'success');
  };

  const handleDeleteCategory = (cat) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== cat.id));
      showToast(`Category "${cat.name}" deleted!`, 'error');
    }
  };

  const totalCategorizedItems = categories.reduce((acc, c) => acc + (c.itemsCount || 0), 0);

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
              Create, update, and organize tile product classifications for store outlets & inventory.
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
              <span className="stat-label">Active Categories</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalCategorizedItems}</span>
              <span className="stat-label">Categorized Tile Items</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">100%</span>
              <span className="stat-label">Catalog Synced</span>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div style={{ marginTop: '28px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Code</th>
                <th>Classification Name</th>
                <th>Description</th>
                <th>Active Models</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td><strong style={{ color: 'var(--primary)' }}>{cat.code}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                      <span style={{ padding: '6px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.9rem' }}>
                        {cat.icon || '📁'}
                      </span>
                      {cat.name}
                    </div>
                  </td>
                  <td>{cat.desc}</td>
                  <td><span className="badge-tag badge-floor">{cat.itemsCount || 0} Items</span></td>
                  <td><span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>{cat.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-tbl" onClick={() => openEditModal(cat)} title="Edit Category">
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-tbl"
                        onClick={() => handleDeleteCategory(cat)}
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
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CAT-WS-06"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category Icon / Emoji</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 🚿"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Washroom Floor Tiles"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Utility</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Specify surface types, anti-skid characteristics, or recommended spaces..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Save Category</button>
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
                  <label className="form-label">Category Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentEditCategory.code}
                    onChange={(e) => setCurrentEditCategory({ ...currentEditCategory, code: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category Name</label>
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
                    value={currentEditCategory.desc}
                    onChange={(e) => setCurrentEditCategory({ ...currentEditCategory, desc: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
