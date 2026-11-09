'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';
import { initialProducts, initialCategories } from '../../../lib/data';

export default function AdminDashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProductForTransfer, setSelectedProductForTransfer] = useState(null);

  // Form states
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Floor Tiles');
  const [newProdSize, setNewProdSize] = useState('60 x 120 cm');
  const [newProdPrice, setNewProdPrice] = useState('4.50');
  const [newProdStock, setNewProdStock] = useState('100');

  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');

  // Stock Transfer Form State
  const [transferFrom, setTransferFrom] = useState('Warehouse A');
  const [transferTo, setTransferTo] = useState('Outlet #1');
  const [transferQuantity, setTransferQuantity] = useState(10);

  // Search Filter
  const [searchInventory, setSearchInventory] = useState('');

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

  const generateNextProdCode = (cat = newProdCat) => {
    let prefix = 'T-FL';
    const lower = (cat || '').toLowerCase();
    if (lower.includes('floor')) prefix = 'T-FL';
    else if (lower.includes('washroom') || lower.includes('bath')) prefix = 'T-WS';
    else if (lower.includes('elevation')) prefix = 'T-EL';
    else prefix = 'T-KT';

    let maxNum = 100;
    products.forEach((p) => {
      const code = p.code || p.itemId;
      if (code) {
        const matches = String(code).match(/\d+/g);
        if (matches && matches.length > 0) {
          const num = parseInt(matches[matches.length - 1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });

    return `${prefix}-${maxNum + 1}`;
  };

  const openAddProductModal = () => {
    setNewProdCode(generateNextProdCode());
    setNewProdName('');
    setShowAddProductModal(true);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      code: newProdCode,
      name: newProdName,
      category: newProdCat,
      size: newProdSize,
      company: 'Master Ceramics',
      price: parseFloat(newProdPrice) || 0,
      unit: 'Sq.Ft',
      stockWarehouseA: parseInt(newProdStock) || 0,
      stockOutlet1: 0,
      stockOutlet2: 0,
      coveragePerBox: 15.0,
    };

    setProducts([newProduct, ...products]);
    setShowAddProductModal(false);
    showToast(`Product ${newProdCode} (${newProdName}) added to inventory!`, 'success');
    setNewProdCode('');
    setNewProdName('');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const newCategory = {
      id: Date.now(),
      code: newCatCode || `CAT-${Date.now().toString().slice(-3)}`,
      name: newCatName,
      icon: '📁',
      desc: 'Custom tile product classification for store inventory.',
      itemsCount: 0,
      status: 'Active',
    };

    setCategories([...categories, newCategory]);
    setShowAddCategoryModal(false);
    showToast(`Category "${newCatName}" added successfully!`, 'success');
    setNewCatName('');
    setNewCatCode('');
  };

  const openTransferModal = (prod) => {
    setSelectedProductForTransfer(prod);
    setShowTransferModal(true);
  };

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    if (!selectedProductForTransfer) return;

    const qty = parseInt(transferQuantity) || 0;
    if (qty <= 0) {
      showToast('Please enter a valid transfer quantity', 'error');
      return;
    }

    setProducts(
      products.map((p) => {
        if (p.id === selectedProductForTransfer.id) {
          return {
            ...p,
            stockWarehouseA: Math.max(0, p.stockWarehouseA - qty),
            stockOutlet1: transferTo.includes('1') ? p.stockOutlet1 + qty : p.stockOutlet1,
            stockOutlet2: transferTo.includes('2') ? p.stockOutlet2 + qty : p.stockOutlet2,
          };
        }
        return p;
      })
    );

    setShowTransferModal(false);
    showToast(
      `Transferred ${qty} boxes of ${selectedProductForTransfer.name} from ${transferFrom} to ${transferTo}!`,
      'success'
    );
  };

  // Calculations for KPI Cards
  const totalStockBoxes = products.reduce(
    (acc, p) => acc + p.stockWarehouseA + p.stockOutlet1 + p.stockOutlet2,
    0
  );

  const filteredInventory = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchInventory.toLowerCase()) ||
      p.code.toLowerCase().includes(searchInventory.toLowerCase()) ||
      p.category.toLowerCase().includes(searchInventory.toLowerCase())
  );

  return (
    <>
      <AdminHeader />

      <section className="section-container">
        {/* Header Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
              System Overview & Stock Control
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Real-time inventory levels, multi-outlet stock tracking, and tile product management.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-admin-action" onClick={openAddProductModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Product
            </button>
            <button className="btn-secondary" onClick={() => setShowAddCategoryModal(true)} style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
              + Add Category
            </button>
          </div>
        </div>

        {/* KPI Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Total Tile Products</span>
              <span className="stat-trend trend-up">↑ Catalog Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalStockBoxes}</span>
              <span className="stat-label">Total Boxes In Stock</span>
              <span className="stat-trend trend-up">Across 3 Hubs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">Warehouses & Outlets</span>
              <span className="stat-trend trend-up">Online Sync</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Tile Categories</span>
              <span className="stat-trend trend-up">Floor, Washroom, Elevation</span>
            </div>
          </div>
        </div>

        {/* Inventory Control Table Section */}
        <div style={{ marginTop: '36px' }} id="inventoryTable">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Real-time Multi-Location Inventory</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track stock distribution across Central Warehouse and retail outlet stores.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search inventory table..."
                value={searchInventory}
                onChange={(e) => setSearchInventory(e.target.value)}
                className="form-input"
                style={{ width: '220px', padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button
                className="btn-tbl"
                onClick={() => showToast('Exporting stock report to CSV...', 'success')}
                style={{ padding: '8px 14px' }}
              >
                📥 Export Report
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Tile Product</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Price / Unit</th>
                  <th>Main Warehouse A</th>
                  <th>Outlet #1 (Metro)</th>
                  <th>Outlet #2 (DHA)</th>
                  <th>Stock Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td><strong style={{ color: 'var(--primary)' }}>{item.code}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Brand: {item.company}</div>
                    </td>
                    <td>
                      <span
                        className={`badge-tag ${
                          item.category.includes('Washroom')
                            ? 'badge-washroom'
                            : item.category.includes('Elevation')
                            ? 'badge-elevation'
                            : 'badge-floor'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>{item.size}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td><strong style={{ color: '#10b981' }}>{item.stockWarehouseA} Boxes</strong></td>
                    <td>{item.stockOutlet1} Boxes</td>
                    <td>{item.stockOutlet2} Boxes</td>
                    <td>
                      <button
                        className="btn-tbl"
                        onClick={() => openTransferModal(item)}
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                      >
                        ⇄ Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add New Tile Product</h3>
              <button className="modal-close" onClick={() => setShowAddProductModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Item Code</label>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        ● Auto-Assigned
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ background: 'var(--bg-dark)', cursor: 'not-allowed', fontWeight: 600, color: 'var(--primary)' }}
                      value={newProdCode}
                      readOnly
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={newProdCat}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setNewProdCat(cat);
                        setNewProdCode(generateNextProdCode(cat));
                      }}
                    >
                      <option value="Floor Tiles">Floor Tiles</option>
                      <option value="Washroom Tiles">Washroom Tiles</option>
                      <option value="Front Elevation Tiles">Front Elevation Tiles</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tile Name & Finish</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nero Marquina Porcelain"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tile Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="60 x 120 cm"
                      value={newProdSize}
                      onChange={(e) => setNewProdSize(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price per Sq.Ft ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="4.50"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Warehouse Stock (Boxes)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="100"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Save Tile Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add Tile Category</h3>
              <button className="modal-close" onClick={() => setShowAddCategoryModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CAT-OD-06"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Swimming Pool Tiles"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowAddCategoryModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal */}
      {showTransferModal && selectedProductForTransfer && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Transfer Stock Between Locations</h3>
              <button className="modal-close" onClick={() => setShowTransferModal(false)}>×</button>
            </div>
            <form onSubmit={handleExecuteTransfer}>
              <div className="modal-body">
                <div style={{ background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600 }}>{selectedProductForTransfer.name} ({selectedProductForTransfer.code})</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Current Warehouse A Stock: <strong>{selectedProductForTransfer.stockWarehouseA} Boxes</strong>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Source Location</label>
                    <select
                      className="form-input"
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                    >
                      <option value="Main Warehouse A">Main Central Warehouse A</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Destination Outlet</label>
                    <select
                      className="form-input"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                    >
                      <option value="Outlet Store #1 (Metro Plaza)">Outlet Store #1 (Metro Plaza)</option>
                      <option value="Outlet Store #2 (DHA Phase 5)">Outlet Store #2 (DHA Phase 5)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Transfer Quantity (Boxes)</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProductForTransfer.stockWarehouseA}
                    className="form-input"
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tbl" onClick={() => setShowTransferModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action">Confirm Stock Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
