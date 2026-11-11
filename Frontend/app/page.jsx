'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // Separate Search & Filter States for Catalog
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchDesign, setSearchDesign] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Toast Notification State
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

  // Fetch live products and categories from database API
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setDbError('');

        const [resProd, resCat] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        const prodData = await resProd.json();
        const catData = await resCat.json();

        if (prodData.success) {
          setProducts(prodData.data || []);
        } else {
          setProducts([]);
          if (prodData.message && prodData.message.includes('MongoDB')) {
            setDbError(prodData.message);
          }
        }

        if (catData.success) {
          setCategories(catData.data || []);
        } else {
          setCategories([]);
          if (catData.message && catData.message.includes('MongoDB')) {
            setDbError(catData.message);
          }
        }
      } catch (err) {
        console.error('Error loading storefront data:', err);
        setProducts([]);
        setCategories([]);
        setDbError('Unable to connect to database server. Please verify MongoDB Atlas connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Filter Active Categories & Products (Case-insensitive)
  const activeCategories = categories.filter(
    (c) => !c.status || c.status.toLowerCase() === 'active'
  );
  const activeProducts = products.filter(
    (p) => !p.status || p.status.toLowerCase() === 'active'
  );

  // Filtered Products for Catalog section (Multi-field separate search)
  const filteredProducts = activeProducts.filter((product) => {
    const matchesName =
      !searchName.trim() ||
      (product.name && product.name.toLowerCase().includes(searchName.trim().toLowerCase()));

    const matchesId =
      !searchId.trim() ||
      (product.itemId && product.itemId.toLowerCase().includes(searchId.trim().toLowerCase()));

    const matchesCompany =
      !searchCompany.trim() ||
      (product.company && product.company.toLowerCase().includes(searchCompany.trim().toLowerCase()));

    const matchesDesign =
      !searchDesign.trim() ||
      (product.design && product.design.toLowerCase().includes(searchDesign.trim().toLowerCase()));

    const catName = product.categoryId?.name || product.categoryName || '';
    const catId = product.categoryId?._id || product.categoryId || '';
    const matchesCategory =
      selectedCategory === 'All' ||
      catId === selectedCategory ||
      catName.toLowerCase() === selectedCategory.toLowerCase();

    return matchesName && matchesId && matchesCompany && matchesDesign && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* Atlas Connection Warning if DB is unreachable */}
      {dbError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 24px', textAlign: 'center', color: '#f87171', fontSize: '0.9rem' }}>
          <strong>Database Notice:</strong> {dbError} — Check MongoDB Atlas Network Access (Allow 0.0.0.0/0).
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <div className="section-tag">Smart Tile Retail & Inventory System</div>
          <h1 className="hero-title">
            Transform Your Space With <span>Architectural Tiles</span>
          </h1>
          <p className="hero-text">
            Explore premium tiles with live database stock availability, detailed technical specifications, and online quotation requests directly powered by MongoDB Atlas.
          </p>

          <div className="hero-actions">
            <a href="#featured" className="btn-submit" style={{ width: 'auto', padding: '14px 28px', textDecoration: 'none' }}>
              <span>Explore Catalog ({activeProducts.length} Items)</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a href="#categories" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <span>Browse Categories</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Card Showcase - Dynamic from Database */}
        <div className="hero-visual">
          <div className="tile-showcase-card">
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>POPULAR FINISHES</span>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>Live Database Sync</span>
            </div>

            {activeCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <p>No tile categories registered in database yet.</p>
                <Link href="/admin/categories" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  + Add Categories in Admin Panel
                </Link>
              </div>
            ) : (
              <div className="showcase-grid">
                {activeCategories.slice(0, 4).map((cat, idx) => {
                  const gradients = [
                    'linear-gradient(45deg, #1e293b, #334155)',
                    'linear-gradient(135deg, #0f172a, #1e293b)',
                    'linear-gradient(180deg, #1e1b4b, #311b92)',
                    'linear-gradient(135deg, #111827, #1f2937)',
                  ];
                  return (
                    <div
                      key={cat._id}
                      className="tile-preview-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        const featuredSection = document.getElementById('featured');
                        if (featuredSection) featuredSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <svg width="100%" height="100%" style={{ background: gradients[idx % gradients.length] }} viewBox="0 0 100 100">
                        <rect x="5" y="5" width="42" height="42" fill="#3b82f6" opacity="0.3" rx="4" />
                        <rect x="53" y="5" width="42" height="42" fill="#06b6d4" opacity="0.3" rx="4" />
                        <rect x="5" y="53" width="42" height="42" fill="#8b5cf6" opacity="0.3" rx="4" />
                        <rect x="53" y="53" width="42" height="42" fill="#3b82f6" opacity="0.5" rx="4" />
                      </svg>
                      <div className="tile-tag">{cat.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Tile Categories Section */}
      <section className="section-container" id="categories">
        <div className="section-header">
          <span className="section-tag">Tile Categories</span>
          <h2 className="section-title">Designed For Every Surface</h2>
          <p className="section-desc">
            Browse our live product classifications from MongoDB Atlas.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading categories from database...
          </div>
        ) : activeCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              No Categories Available
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              There are currently no tile categories in the database.
            </p>
            <Link href="/admin/categories" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              + Add Category in Admin Panel
            </Link>
          </div>
        ) : (
          <div className="category-grid">
            {activeCategories.map((cat, idx) => {
              const catProdCount = activeProducts.filter(
                (p) => (p.categoryId?._id || p.categoryId) === cat._id
              ).length;

              const colors = [
                { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', color: 'var(--primary)' },
                { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)' },
                { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', color: 'var(--accent-gold)' },
                { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', color: 'var(--accent-purple)' },
              ];
              const theme = colors[idx % colors.length];

              return (
                <div
                  key={cat._id}
                  className="category-card"
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    const featuredSection = document.getElementById('featured');
                    if (featuredSection) featuredSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div
                      className="category-icon-box"
                      style={{ background: theme.bg, borderColor: theme.border, color: theme.color }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                    </div>
                    <div className="category-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="category-name">{cat.name}</span>
                      <span style={{ fontSize: '0.75rem', color: theme.color, fontWeight: 700, background: theme.bg, padding: '3px 8px', borderRadius: '12px' }}>
                        {catProdCount} {catProdCount === 1 ? 'Tile' : 'Tiles'}
                      </span>
                    </div>
                    <p className="category-desc">
                      {cat.description || 'Explore our dynamic collection of tiles under this category.'}
                    </p>
                  </div>
                  <span className="category-link">
                    <span>Explore Collection</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Products Section with Live Dynamic Search & Filter */}
      <section className="section-container" id="featured">
        <div className="section-header">
          <span className="section-tag">Featured Products</span>
          <h2 className="section-title">Popular Tile Selection</h2>
          <p className="section-desc">
            Inspect live specifications, prices, manufacturer details, and box coverage dynamically from MongoDB Atlas.
          </p>
        </div>

        {/* Dynamic Multi-Field Search Toolbar in a Single Line with Titles */}
        <div
          style={{
            background: 'var(--bg-card)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-glass)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            {/* 1. Name Search */}
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tile Name
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
              />
            </div>

            {/* 2. Item ID Search */}
            <div style={{ flex: 1, minWidth: '130px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Item ID
              </label>
              <input
                type="text"
                placeholder="e.g. T-WS-101..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
              />
            </div>

            {/* 3. Company Search */}
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Company
              </label>
              <input
                type="text"
                placeholder="e.g. National..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
              />
            </div>

            {/* 4. Design Search */}
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Design
              </label>
              <input
                type="text"
                placeholder="e.g. Marble..."
                value={searchDesign}
                onChange={(e) => setSearchDesign(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
              />
            </div>

            {/* 5. Category Selection */}
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value="All">All Categories ({activeProducts.length})</option>
                {activeCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Reset Filters Button */}
            {(searchName || searchId || searchCompany || searchDesign || selectedCategory !== 'All') && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchName('');
                    setSearchId('');
                    setSearchCompany('');
                    setSearchDesign('');
                    setSelectedCategory('All');
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '9px 14px',
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    height: '38px',
                  }}
                  title="Clear all filters"
                >
                  ✕ Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="product-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading products from database...
            </div>
          ) : activeProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                No Data Available
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                There are currently no tile products available in the database.
              </p>
              <Link href="/admin/products" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', fontSize: '0.88rem' }}>
                + Add Product in Admin Panel
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              No tile models found matching your search.
            </div>
          ) : (
            filteredProducts.map((tile, idx) => {
              const catName = tile.categoryId?.name || tile.categoryName || 'General';
              const isWashroom = catName.toLowerCase().includes('washroom') || catName.toLowerCase().includes('bath');
              const isElevation = catName.toLowerCase().includes('elevation');

              return (
                <div key={tile._id || idx} className="product-card">
                  <Link
                    href={`/products/${tile._id}`}
                    className="product-thumb"
                    style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                    title={`View full details of ${tile.name}`}
                  >
                    <span
                      className="product-badge"
                      style={{
                        background: isWashroom
                          ? 'var(--accent-cyan)'
                          : isElevation
                          ? 'var(--accent-gold)'
                          : 'var(--primary)',
                      }}
                    >
                      {catName}
                    </span>
                    <span className="stock-badge">
                      {tile.boxCoverage ? `${tile.boxCoverage} Sq.Ft / Box` : '15 Sq.Ft / Box'}
                    </span>
                    <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ background: '#1e293b' }}>
                      <rect width="100%" height="100%" fill="#0f172a" />
                      <path d="M0,0 L200,200 M200,0 L0,200" stroke="#334155" strokeWidth="2" />
                      <rect x="40" y="40" width="120" height="120" fill="#3b82f6" opacity="0.2" rx="8" />
                    </svg>
                  </Link>
                  <div className="product-body">
                    <div>
                      <h3 className="product-title" style={{ margin: 0 }}>
                        <Link
                          href={`/products/${tile._id}`}
                          style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                          title={`View details for ${tile.name}`}
                        >
                          {tile.name}
                        </Link>
                      </h3>
                      <div className="product-meta">
                        <span>Size: {tile.size || 'Standard'}</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>ID: {tile.itemId}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px', fontWeight: 600 }}>
                        Brand: {tile.company}
                      </div>
                      {tile.design && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Design: {tile.design}
                        </div>
                      )}
                    </div>
                    <div className="product-price-row" style={{ marginTop: '12px' }}>
                      <div className="product-price">
                        ${Number(tile.price).toFixed(2)} <span>/ {tile.unitType || 'Sq.Ft'}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px' }}>
                      <Link
                        href={`/products/${tile._id}`}
                        className="btn-submit"
                        style={{
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          width: '100%',
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>View Specifications & Availability</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
