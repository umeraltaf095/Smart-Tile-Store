'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { initialProducts, initialCategories } from '../lib/data';

export default function HomePage() {
  // Calculator State
  const [calcLength, setCalcLength] = useState(15);
  const [calcWidth, setCalcWidth] = useState(12);
  const [wasteMargin, setWasteMargin] = useState(10);
  const [selectedTileKey, setSelectedTileKey] = useState('60x120');

  // Search & Filter State for Catalog
  const [searchQuery, setSearchQuery] = useState('');
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

  // Tile calculator options
  const tileOptions = {
    '60x120': { name: 'Carrara White Porcelain', coverage: 15.5, price: 4.50 },
    '30x60': { name: 'Rustic Slate 3D Stone', coverage: 12.0, price: 5.20 },
    '30x30': { name: 'Royal Blue Anti-Skid', coverage: 10.0, price: 3.80 },
    '80x80': { name: 'Travertine Gold Polished', coverage: 14.0, price: 6.10 },
  };

  const currentTileConfig = tileOptions[selectedTileKey] || tileOptions['60x120'];
  const netArea = (parseFloat(calcLength) || 0) * (parseFloat(calcWidth) || 0);
  const totalArea = netArea * (1 + (parseFloat(wasteMargin) || 0) / 100);
  const boxesNeeded = Math.ceil(totalArea / currentTileConfig.coverage) || 0;
  const estimatedPrice = totalArea * currentTileConfig.price;

  // Filtered Products
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.size.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <div className="section-tag">Smart Tile Retail & Inventory System</div>
          <h1 className="hero-title">
            Transform Your Space With <span>Architectural Tiles</span>
          </h1>
          <p className="hero-text">
            Explore premium Floor, Washroom, and Front Elevation tiles with real-time outlet stock availability, custom quotation requests, and automated tile box calculation.
          </p>

          <div className="hero-actions">
            <a href="#featured" className="btn-submit" style={{ width: 'auto', padding: '14px 28px', textDecoration: 'none' }}>
              <span>Explore Catalog</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a href="#calculator" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="16" y1="14" x2="16" y2="18"></line>
                <path d="M16 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M8 14h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M8 18h.01"></path>
              </svg>
              <span>Tile Box Calculator</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Card Showcase */}
        <div className="hero-visual">
          <div className="tile-showcase-card">
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>POPULAR FINISHES</span>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>Live Stock Sync</span>
            </div>
            <div className="showcase-grid">
              <div className="tile-preview-item">
                <svg width="100%" height="100%" style={{ background: 'linear-gradient(45deg, #1e293b, #334155)' }} viewBox="0 0 100 100">
                  <rect x="5" y="5" width="42" height="42" fill="#3b82f6" opacity="0.3" rx="4" />
                  <rect x="53" y="5" width="42" height="42" fill="#06b6d4" opacity="0.3" rx="4" />
                  <rect x="5" y="53" width="42" height="42" fill="#8b5cf6" opacity="0.3" rx="4" />
                  <rect x="53" y="53" width="42" height="42" fill="#3b82f6" opacity="0.5" rx="4" />
                </svg>
                <div className="tile-tag">Floor Tile (Polished)</div>
              </div>

              <div className="tile-preview-item">
                <svg width="100%" height="100%" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }} viewBox="0 0 100 100">
                  <pattern id="hex" width="20" height="20" patternUnits="userSpaceOnUse">
                    <polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="none" stroke="#64748b" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#hex)" />
                </svg>
                <div className="tile-tag">Washroom Anti-Skid</div>
              </div>

              <div className="tile-preview-item">
                <svg width="100%" height="100%" style={{ background: 'linear-gradient(180deg, #1e1b4b, #311b92)' }} viewBox="0 0 100 100">
                  <rect x="0" y="0" width="100" height="20" fill="#4338ca" opacity="0.4" />
                  <rect x="0" y="25" width="100" height="20" fill="#6366f1" opacity="0.4" />
                  <rect x="0" y="50" width="100" height="20" fill="#4338ca" opacity="0.4" />
                  <rect x="0" y="75" width="100" height="20" fill="#6366f1" opacity="0.4" />
                </svg>
                <div className="tile-tag">3D Front Elevation</div>
              </div>

              <div className="tile-preview-item">
                <svg width="100%" height="100%" style={{ background: 'linear-gradient(135deg, #111827, #1f2937)' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
                </svg>
                <div className="tile-tag">Royal Marble Pattern</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tile Categories Section */}
      <section className="section-container" id="categories">
        <div className="section-header">
          <span className="section-tag">Tile Categories</span>
          <h2 className="section-title">Designed For Every Surface</h2>
          <p className="section-desc">
            Browse our curated selection of high-grade porcelain, ceramic, and natural stone tiles categorized for optimal utility.
          </p>
        </div>

        <div className="category-grid">
          {/* Category 1: Floor Tiles */}
          <div className="category-card" onClick={() => setSelectedCategory('Floor Tiles')} style={{ cursor: 'pointer' }}>
            <div>
              <div className="category-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="12" y1="3" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="category-title">Floor Tiles</h3>
              <p className="category-desc">
                Heavy-duty porcelain and marble finish tiles crafted for living rooms, hallways, and high-traffic commercial spaces.
              </p>
            </div>
            <a href="#featured" className="category-link">
              <span>Explore Floor Collection</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Category 2: Washroom Tiles */}
          <div className="category-card" onClick={() => setSelectedCategory('Washroom Tiles')} style={{ cursor: 'pointer' }}>
            <div>
              <div className="category-icon-box" style={{ background: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3 className="category-title">Washroom Tiles</h3>
              <p className="category-desc">
                Waterproof, anti-skid floor tiles and glossy moisture-resistant wall tiles designed for modern bathrooms.
              </p>
            </div>
            <a href="#featured" className="category-link" style={{ color: 'var(--accent-cyan)' }}>
              <span>Explore Washroom Collection</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Category 3: Front Elevation Tiles */}
          <div className="category-card" onClick={() => setSelectedCategory('Front Elevation Tiles')} style={{ cursor: 'pointer' }}>
            <div>
              <div className="category-icon-box" style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--accent-gold)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 className="category-title">Front Elevation Tiles</h3>
              <p className="category-desc">
                Weather-proof textured 3D stone tiles and brick designs engineered for outdoor exterior walls and building fronts.
              </p>
            </div>
            <a href="#featured" className="category-link" style={{ color: 'var(--accent-gold)' }}>
              <span>Explore Elevation Collection</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section with Live Search & Filter */}
      <section className="section-container" id="featured">
        <div className="section-header">
          <span className="section-tag">Featured Products</span>
          <h2 className="section-title">Popular Tile Selection</h2>
          <p className="section-desc">
            Inspect exact specifications, prices per sq.ft, and live stock location availability across outlets.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search tiles by name, size, company or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="All">All Categories</option>
              <option value="Floor Tiles">Floor Tiles</option>
              <option value="Washroom Tiles">Washroom Tiles</option>
              <option value="Front Elevation Tiles">Front Elevation Tiles</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No tile models found matching your search criteria.
            </div>
          ) : (
            filteredProducts.map((tile) => (
              <div key={tile.id} className="product-card">
                <div className="product-thumb">
                  <span
                    className="product-badge"
                    style={{
                      background:
                        tile.category === 'Washroom Tiles'
                          ? 'var(--accent-cyan)'
                          : tile.category === 'Front Elevation Tiles'
                          ? 'var(--accent-gold)'
                          : 'var(--primary)',
                    }}
                  >
                    {tile.category}
                  </span>
                  <span className="stock-badge">{tile.stockWarehouseA} Boxes (Main Wh)</span>
                  <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ background: '#1e293b' }}>
                    <rect width="100%" height="100%" fill="#0f172a" />
                    <path d="M0,0 L200,200 M200,0 L0,200" stroke="#334155" strokeWidth="2" />
                    <rect x="40" y="40" width="120" height="120" fill="#3b82f6" opacity="0.2" rx="8" />
                  </svg>
                </div>
                <div className="product-body">
                  <div>
                    <h3 className="product-title">{tile.name}</h3>
                    <div className="product-meta">
                      <span>Size: {tile.size}</span>
                      <span>Code: {tile.code}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                      Brand: {tile.company}
                    </div>
                  </div>
                  <div className="product-price-row">
                    <div className="product-price">
                      ${tile.price.toFixed(2)} <span>/ {tile.unit}</span>
                    </div>
                    <button
                      className="btn-icon"
                      onClick={() => showToast(`Quotation requested for ${tile.name}`, 'success')}
                    >
                      <span>Order / Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Interactive Tile Box Calculator Section */}
      <section className="section-container" id="calculator">
        <div className="calculator-box">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <span className="section-tag">Interactive Sizing Tool</span>
            <h2 className="section-title">Automated Tile Box Calculator</h2>
            <p className="section-desc">
              Calculate exact square footage, recommended waste buffer, and number of boxes required for your room project.
            </p>
          </div>

          <div className="calc-grid">
            {/* Input Form */}
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="roomLength">Room Length (Feet)</label>
                  <input
                    type="number"
                    id="roomLength"
                    className="form-input"
                    value={calcLength}
                    min="1"
                    onChange={(e) => setCalcLength(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="roomWidth">Room Width (Feet)</label>
                  <input
                    type="number"
                    id="roomWidth"
                    className="form-input"
                    value={calcWidth}
                    min="1"
                    onChange={(e) => setCalcWidth(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tileSelect">Selected Tile Size</label>
                <select
                  id="tileSelect"
                  className="form-input"
                  value={selectedTileKey}
                  onChange={(e) => setSelectedTileKey(e.target.value)}
                >
                  <option value="60x120">Carrara White (60x120 cm - 15.5 sq.ft/box)</option>
                  <option value="30x60">Rustic Slate (30x60 cm - 12.0 sq.ft/box)</option>
                  <option value="30x30">Royal Blue (30x30 cm - 10.0 sq.ft/box)</option>
                  <option value="80x80">Travertine Gold (80x80 cm - 14.0 sq.ft/box)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wasteBuffer">Waste Buffer Margin (%)</label>
                <select
                  id="wasteBuffer"
                  className="form-input"
                  value={wasteMargin}
                  onChange={(e) => setWasteMargin(e.target.value)}
                >
                  <option value="5">5% Standard Cutting Margin</option>
                  <option value="10">10% Recommended (Diagonal/Pattern)</option>
                  <option value="15">15% High Waste Allowance</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Results */}
            <div className="calc-output-box">
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Estimation Result</span>
              </div>

              <div className="calc-stat-group">
                <span className="calc-stat-label">Net Surface Area:</span>
                <span className="calc-stat-value">{netArea.toFixed(1)} Sq.Ft</span>
              </div>

              <div className="calc-stat-group">
                <span className="calc-stat-label">Area + Waste Buffer:</span>
                <span className="calc-stat-value">{totalArea.toFixed(1)} Sq.Ft</span>
              </div>

              <div className="calc-stat-group">
                <span className="calc-stat-label">Tile Boxes Required:</span>
                <span className="calc-stat-value" style={{ color: 'var(--primary)' }}>
                  {boxesNeeded} Boxes
                </span>
              </div>

              <div className="calc-stat-group">
                <span className="calc-stat-label">Estimated Total Price:</span>
                <span className="calc-stat-value" style={{ color: 'var(--accent-gold)' }}>
                  ${estimatedPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
