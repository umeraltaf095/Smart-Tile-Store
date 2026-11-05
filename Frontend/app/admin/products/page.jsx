'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState(null);

  // New Product Form State (Strictly matching updated MongoDB Schema)
  const [newItemId, setNewItemId] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSize, setNewSize] = useState('60 x 120 cm');
  const [newDesign, setNewDesign] = useState('');
  const [newPrice, setNewPrice] = useState('4.50');
  const [newUnitType, setNewUnitType] = useState('Sq.Ft');
  const [newBoxCoverage, setNewBoxCoverage] = useState('15.5');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('active');

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

  // 1. Fetch products & categories from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      if (dataProd.success) {
        setProducts(dataProd.data || []);
      } else {
        showToast(dataProd.message || 'Failed to fetch products', 'error');
      }

      if (dataCat.success) {
        setCategories(dataCat.data || []);
        if (dataCat.data?.length > 0 && !newCategoryId) {
          setNewCategoryId(dataCat.data[0]._id);
        }
      }
    } catch (err) {
      showToast('Network error while loading products or categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Add New Product (POST API)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newItemId.trim() || !newName.trim() || !newCategoryId || !newCompany.trim()) {
      showToast('Item ID, Name, Category, and Company are required', 'error');
      return;
    }

    if (isNaN(Number(newPrice)) || Number(newPrice) < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: newItemId.trim(),
          name: newName.trim(),
          categoryId: newCategoryId,
          company: newCompany.trim(),
          size: newSize.trim(),
          design: newDesign.trim(),
          price: Number(newPrice),
          unitType: newUnitType,
          boxCoverage: Number(newBoxCoverage) || 15.0,
          description: newDescription.trim(),
          status: newStatus,
        }),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to create product', 'error');
        return;
      }

      showToast(data.message || `Tile Product "${newItemId}" added!`, 'success');
      setShowAddModal(false);

      // Reset form
      setNewItemId('');
      setNewName('');
      setNewCompany('');
      setNewDesign('');
      setNewDescription('');
      setNewPrice('4.50');
      setNewBoxCoverage('15.5');
      setNewStatus('active');

      fetchData();
    } catch (err) {
      setActionLoading(false);
      showToast('Network error creating tile product', 'error');
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (product) => {
    const catId = product.categoryId?._id || product.categoryId || '';
    setCurrentEditProduct({
      _id: product._id,
      itemId: product.itemId,
      name: product.name,
      categoryId: catId,
      company: product.company,
      size: product.size || '',
      design: product.design || '',
      price: product.price,
      unitType: product.unitType || 'Sq.Ft',
      boxCoverage: product.boxCoverage || 15.0,
      description: product.description || '',
      status: product.status || 'active',
    });
    setShowEditModal(true);
  };

  // 4. Update Existing Product (PUT API)
  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!currentEditProduct || !currentEditProduct.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${currentEditProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEditProduct),
      });

      const data = await res.json();
      setActionLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to update product', 'error');
        return;
      }

      showToast(data.message || `Tile "${currentEditProduct.itemId}" updated!`, 'success');
      setShowEditModal(false);
      setCurrentEditProduct(null);
      fetchData();
    } catch (err) {
      setActionLoading(false);
      showToast('Network error updating tile product', 'error');
    }
  };

  // 5. Delete Product (DELETE API)
  const handleDeleteProduct = async (product) => {
    if (!confirm(`Are you sure you want to delete tile product "${product.name}" (${product.itemId})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to delete product', 'error');
        return;
      }

      showToast(`Product "${product.name}" deleted successfully!`, 'success');
      fetchData();
    } catch (err) {
      showToast('Network error deleting product', 'error');
    }
  };

  // Filter products by search query and category
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const catName = p.categoryId?.name || p.categoryName || '';
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.itemId && p.itemId.toLowerCase().includes(q)) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.design && p.design.toLowerCase().includes(q)) ||
      (p.size && p.size.toLowerCase().includes(q));

    const productCatId = p.categoryId?._id || p.categoryId;
    const matchesCategory =
      filterCategory === 'All' || productCatId === filterCategory || catName === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const activeCount = products.filter((p) => p.status === 'active').length;
  const inactiveCount = products.filter((p) => p.status === 'inactive').length;

  return (
    <>
      <AdminHeader />

      <section className="section-container">
        {/* Page Header & Action Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              Manage Tile Products Catalog
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Maintain tile product details including item ID, size, design, price, manufacturing company, and unit types.
            </p>
          </div>
          <button className="btn-admin-action" onClick={() => setShowAddModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Tile Product
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Total Tile Models</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">Active in Store</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{inactiveCount}</span>
              <span className="stat-label">Inactive Models</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Linked Categories</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '28px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by Item ID, product name, dimensions, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tile Products Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading tile catalog from API...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No tile models found. Click "Add New Tile Product" above to add products.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Product Name & Design</th>
                  <th>Category</th>
                  <th>Dimensions</th>
                  <th>Manufacturer</th>
                  <th>Price / Unit</th>
                  <th>Coverage / Box</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((tile) => {
                  const catName = tile.categoryId?.name || tile.categoryName || 'Unassigned';
                  return (
                    <tr key={tile._id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{tile.itemId}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tile.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          {tile.design || 'Standard Design'}
                        </div>
                      </td>
                      <td>
                        <span className="badge-tag badge-floor">
                          {catName}
                        </span>
                      </td>
                      <td>{tile.size || 'N/A'}</td>
                      <td><strong style={{ color: 'var(--accent-cyan)' }}>{tile.company}</strong></td>
                      <td>
                        <strong style={{ color: '#10b981' }}>
                          ${Number(tile.price).toFixed(2)}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                          / {tile.unitType || 'Sq.Ft'}
                        </span>
                      </td>
                      <td>{tile.boxCoverage ? `${tile.boxCoverage} Sq.Ft` : '15.0 Sq.Ft'}</td>
                      <td>
                        <span
                          className="badge-tag"
                          style={{
                            background: tile.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: tile.status === 'active' ? '#10b981' : '#ef4444',
                            textTransform: 'capitalize',
                            fontWeight: 600,
                          }}
                        >
                          {tile.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-tbl" onClick={() => openEditModal(tile)} title="Edit Tile">
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-tbl"
                            onClick={() => handleDeleteProduct(tile)}
                            style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            title="Delete Tile"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Add Product Modal (Schema-Matched) */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Tile Product</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body">
                {/* Row 1: Item ID & Product Name */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item ID <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. T-FL-101"
                      value={newItemId}
                      onChange={(e) => setNewItemId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Carrara White Porcelain"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Category & Company */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="form-input"
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select a Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} ({cat.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manufacturer / Company <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master Ceramics, National Tiles"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Dimensions & Design */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tile Dimensions (Size)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 60 x 120 cm"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Design / Surface Finish</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Polished Glazed Marble"
                      value={newDesign}
                      onChange={(e) => setNewDesign(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 4: Price, Unit Type & Box Coverage */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price ($) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="form-input"
                      value={newUnitType}
                      onChange={(e) => setNewUnitType(e.target.value)}
                      required
                    >
                      <option value="Sq.Ft">Sq.Ft (Square Feet)</option>
                      <option value="Sq.M">Sq.M (Square Meter)</option>
                      <option value="Box">Box</option>
                      <option value="Piece">Piece</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Box Coverage (Sq.Ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="15.5"
                      value={newBoxCoverage}
                      onChange={(e) => setNewBoxCoverage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 5: Description & Status */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    placeholder="Tile details, recommended areas, porcelain material..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
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
                    <option value="active">Active (Visible in Store Catalog)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-action" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Tile Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal (Schema-Matched) */}
      {showEditModal && currentEditProduct && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Tile Product</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditProduct}>
              <div className="modal-body">
                {/* Row 1: Item ID & Product Name */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item ID <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.itemId}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, itemId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.name}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Category & Company */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="form-input"
                      value={currentEditProduct.categoryId}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Select a Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} ({cat.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manufacturer / Company <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.company}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Dimensions & Design */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tile Dimensions (Size)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.size}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, size: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Design / Surface Finish</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.design}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, design: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 4: Price, Unit Type & Box Coverage */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price ($) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={currentEditProduct.price}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="form-input"
                      value={currentEditProduct.unitType}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, unitType: e.target.value })}
                      required
                    >
                      <option value="Sq.Ft">Sq.Ft (Square Feet)</option>
                      <option value="Sq.M">Sq.M (Square Meter)</option>
                      <option value="Box">Box</option>
                      <option value="Piece">Piece</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Box Coverage (Sq.Ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={currentEditProduct.boxCoverage}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, boxCoverage: parseFloat(e.target.value) || 15.0 })}
                    />
                  </div>
                </div>

                {/* Row 5: Description & Status */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={currentEditProduct.description}
                    onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Status <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className="form-input"
                    value={currentEditProduct.status}
                    onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, status: e.target.value })}
                    required
                  >
                    <option value="active">Active (Visible in Store Catalog)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowEditModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-action" disabled={actionLoading}>
                  {actionLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
