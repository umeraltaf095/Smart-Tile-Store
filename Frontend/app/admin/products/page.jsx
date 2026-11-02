'use client';

import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';
import { initialProducts } from '../../../lib/data';

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState(null);

  // New Product Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Floor Tiles');
  const [newSize, setNewSize] = useState('60 x 120 cm');
  const [newCompany, setNewCompany] = useState('Master Ceramics');
  const [newPrice, setNewPrice] = useState('4.50');
  const [newUnit, setNewUnit] = useState('Sq.Ft');
  const [newStock, setNewStock] = useState('100');

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

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      code: newCode,
      name: newName,
      category: newCategory,
      size: newSize,
      company: newCompany,
      price: parseFloat(newPrice) || 0,
      unit: newUnit,
      stockWarehouseA: parseInt(newStock) || 0,
      stockOutlet1: 0,
      stockOutlet2: 0,
      coveragePerBox: 15.0,
    };

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    showToast(`Tile Product "${newCode}" (${newName}) added!`, 'success');

    // Reset Form
    setNewCode('');
    setNewName('');
    setNewPrice('4.50');
    setNewStock('100');
  };

  const openEditModal = (product) => {
    setCurrentEditProduct(product);
    setShowEditModal(true);
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    if (!currentEditProduct) return;

    setProducts(
      products.map((p) =>
        p.id === currentEditProduct.id ? { ...currentEditProduct } : p
      )
    );

    setShowEditModal(false);
    showToast(`Tile details for "${currentEditProduct.code}" updated!`, 'success');
  };

  const handleDeleteProduct = (product) => {
    if (confirm(`Are you sure you want to delete tile product "${product.name}"?`)) {
      setProducts(products.filter((p) => p.id !== product.id));
      showToast(`Product "${product.name}" deleted!`, 'error');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.size.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'All' || p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const totalMainStock = products.reduce((acc, p) => acc + (p.stockWarehouseA || 0), 0);

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
              Maintain tile product details including size, design, price, manufacturing company, and unit types.
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
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalMainStock}</span>
              <span className="stat-label">Boxes in Main Hub</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">2 Outlets</span>
              <span className="stat-label">Branches Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">Healthy</span>
              <span className="stat-label">Stock Status</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '28px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by code, product name, dimensions or company..."
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
              <option value="Floor Tiles">Floor Tiles</option>
              <option value="Washroom Tiles">Washroom Tiles</option>
              <option value="Front Elevation Tiles">Front Elevation Tiles</option>
            </select>
          </div>
        </div>

        {/* Tile Products Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Product Description</th>
                <th>Category</th>
                <th>Dimensions</th>
                <th>Manufacturer</th>
                <th>Price / Unit</th>
                <th>Unit Type</th>
                <th>Main Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((tile) => (
                <tr key={tile.id}>
                  <td><strong style={{ color: 'var(--primary)' }}>{tile.code}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{tile.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Design: Verified Polish</div>
                  </td>
                  <td>
                    <span
                      className={`badge-tag ${
                        tile.category.includes('Washroom')
                          ? 'badge-washroom'
                          : tile.category.includes('Elevation')
                          ? 'badge-elevation'
                          : 'badge-floor'
                      }`}
                    >
                      {tile.category}
                    </span>
                  </td>
                  <td>{tile.size}</td>
                  <td><strong style={{ color: 'var(--accent-cyan)' }}>{tile.company}</strong></td>
                  <td><strong style={{ color: '#10b981' }}>${tile.price.toFixed(2)}</strong></td>
                  <td><span className="badge-tag" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>{tile.unit}</span></td>
                  <td>{tile.stockWarehouseA} Boxes</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add New Tile Product</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. T-FL-205"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Floor Tiles">Floor Tiles</option>
                      <option value="Washroom Tiles">Washroom Tiles</option>
                      <option value="Front Elevation Tiles">Front Elevation Tiles</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name / Design</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nero Marquina Porcelain"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="60 x 120 cm"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manufacturing Company</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master Ceramics"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price per Unit ($)</label>
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
                    <label className="form-label">Unit Type</label>
                    <select
                      className="form-input"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                    >
                      <option value="Sq.Ft">Sq.Ft (Square Feet)</option>
                      <option value="Sq.M">Sq.M (Square Meter)</option>
                      <option value="Box">Box</option>
                      <option value="Piece">Piece</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock (Boxes in Main Warehouse)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Save Tile Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentEditProduct && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Edit Tile Product</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditProduct}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.code}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={currentEditProduct.category}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, category: e.target.value })}
                    >
                      <option value="Floor Tiles">Floor Tiles</option>
                      <option value="Washroom Tiles">Washroom Tiles</option>
                      <option value="Front Elevation Tiles">Front Elevation Tiles</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentEditProduct.name}
                    onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.size}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, size: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditProduct.company}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price</label>
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
                    <label className="form-label">Main Warehouse Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={currentEditProduct.stockWarehouseA}
                      onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, stockWarehouseA: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
