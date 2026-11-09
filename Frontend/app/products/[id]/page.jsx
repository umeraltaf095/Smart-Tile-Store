'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Toast from '../../../components/Toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Order quantity
  const [orderBoxes, setOrderBoxes] = useState(1);

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

  // Check user session
  useEffect(() => {
    const saved = localStorage.getItem('smarttile_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  // Fetch product specifications from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.data) {
          setProduct(data.data);
          setError('');
        } else {
          setError(data.message || 'Product not found');
        }
      } catch (err) {
        setError('Network error while loading product specifications');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProductDetails();
    }
  }, [params?.id]);

  // Pricing calculations
  const tilePrice = Number(product?.price) || 0;
  const coveragePerBox = Number(product?.boxCoverage) || 15.0;
  const unitType = (product?.unitType || 'Sq.Ft').trim();
  const isBoxUnit = unitType.toLowerCase() === 'box';

  // If unit is already 'Box', the entered price is per box ($50/box).
  // If unit is area-based (e.g. 'Sq.Ft' or 'Sq.M'), 1 box = tilePrice * coveragePerBox.
  const boxPrice = isBoxUnit ? tilePrice : tilePrice * coveragePerBox;
  const pricePerSqFt = isBoxUnit && coveragePerBox > 0 ? tilePrice / coveragePerBox : tilePrice;
  const quotationTotal = orderBoxes * boxPrice;

  // Handle Request Quotation / Order
  const handlePlaceOrderOrQuote = () => {
    if (!currentUser) {
      showToast('Please log in with a registered customer account to place an order', 'error');
      return;
    }

    showToast(
      `Quotation request submitted for ${orderBoxes} box(es) of "${product.name}" (${product.itemId})!`,
      'success'
    );
  };

  return (
    <>
      <Navbar />

      <main className="section-container" style={{ paddingTop: '28px', minHeight: '80vh' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/#featured" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Catalog</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product ? product.name : 'Tile Details'}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin" style={{ marginBottom: '12px', color: 'var(--primary)' }}>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            <div>Loading full tile specifications...</div>
          </div>
        ) : error || !product ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>
              Tile Not Found
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              {error || 'The requested tile specification could not be located.'}
            </p>
            <Link href="/" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto' }}>
              ← Return to Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', alignItems: 'start' }}>
            
            {/* Left Column: Visual Showcase & Key Highlights */}
            <div>
              {/* Product Visual Card */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-glass)' }}>
                <div style={{ position: 'relative', height: '340px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ background: '#1e293b' }}>
                    <rect width="100%" height="100%" fill="#0f172a" />
                    <line x1="0" y1="0" x2="400" y2="300" stroke="#334155" strokeWidth="2" />
                    <line x1="400" y1="0" x2="0" y2="300" stroke="#334155" strokeWidth="2" />
                    <circle cx="200" cy="150" r="90" fill="none" stroke="#2563eb" strokeWidth="3" opacity="0.4" />
                    <rect x="110" y="70" width="180" height="160" fill="#3b82f6" opacity="0.15" rx="10" stroke="#3b82f6" strokeWidth="1.5" />
                  </svg>

                  {/* Badges on Visual */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {product.categoryId?.name || product.categoryName || 'Tile'}
                  </span>

                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    ● Available in Stock
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ background: 'var(--bg-dark)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>BOX COVERAGE</div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{coveragePerBox} Sq.Ft / Box</strong>
                  </div>

                  <div style={{ background: 'var(--bg-dark)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DIMENSIONS</div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{product.size || 'Standard'}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-dark)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>MANUFACTURER</div>
                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{product.company}</strong>
                  </div>

                  <div style={{ background: 'var(--bg-dark)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>OUTLET STATUS</div>
                    <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>Ready for Pickup</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Full Specifications & Availability Details */}
            <div>
              {/* Product Header */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                    ITEM ID: {product.itemId}
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    Status: {product.status}
                  </span>
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '6px' }}>
                  {product.name}
                </h1>

                <div style={{ fontSize: '1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  Manufactured by: {product.company}
                </div>
              </div>

              {/* Price Banner */}
              <div style={{ background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isBoxUnit ? 'Price Per Box' : 'Unit Price'}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                    ${tilePrice.toFixed(2)}
                    <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 500 }}> / {unitType}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isBoxUnit ? 'Est. Price / Sq.Ft' : 'Price Per Box'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {isBoxUnit ? (
                      <>${pricePerSqFt.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400 }}>/ Sq.Ft</span></>
                    ) : (
                      <>${boxPrice.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400 }}>/ Box</span></>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Specifications Table */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '28px' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-dark)', fontWeight: 700, fontSize: '1rem' }}>
                  Tile Specifications & Availability
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)', width: '40%' }}>Unique Item ID</td>
                      <td style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--primary)' }}>{product.itemId}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Tile Classification</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{product.categoryId?.name || product.categoryName || 'General Category'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Tile Dimensions (Size)</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{product.size || 'Standard Size'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Design / Surface Finish</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{product.design || 'Natural Glazed'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Manufacturer Brand</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--accent-cyan)' }}>{product.company}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Unit Measurement</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{product.unitType || 'Sq.Ft'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Coverage Per Box</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{coveragePerBox} Sq.Ft / Box</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>Outlet Stock Availability</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600, color: '#10b981' }}>
                        ● Available for Immediate Pickup & Delivery
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Description Section */}
              {product.description && (
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Product Overview</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.94rem' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Order Placement / Quotation Section (Feature #6) */}
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Purchase or Request Quotation
                  </h4>
                  {currentUser ? (
                    <span style={{ fontSize: '0.78rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      ✓ Logged in as {currentUser.name || currentUser.email}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      ⚠️ Guest Visitor (Login Required)
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Boxes:
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={orderBoxes}
                      onChange={(e) => setOrderBoxes(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: '90px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </div>

                  {currentUser ? (
                    <button
                      type="button"
                      className="btn-submit"
                      style={{ flex: 1, minWidth: '220px' }}
                      onClick={handlePlaceOrderOrQuote}
                    >
                      <span>Request Quotation (${quotationTotal.toFixed(2)})</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  ) : (
                    <div style={{ flex: 1, minWidth: '240px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn-submit"
                        disabled
                        style={{
                          flex: 1,
                          opacity: 0.55,
                          cursor: 'not-allowed',
                          background: 'var(--border-light)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        title="You must be signed in as a registered customer to submit an order or request a quotation"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Login to Order (${quotationTotal.toFixed(2)})</span>
                      </button>

                      <Link
                        href="/login"
                        className="btn-secondary"
                        style={{
                          textDecoration: 'none',
                          padding: '12px 18px',
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>

                {!currentUser && (
                  <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#f59e0b' }}>ℹ️</span>
                    <span>
                      Visiting as a guest? Please{' '}
                      <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link> or{' '}
                      <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an Account</Link>{' '}
                      to place orders and track their delivery.
                    </span>
                  </div>
                )}
              </div>

              {/* Back to Home / Catalog */}
              <div style={{ marginTop: '20px' }}>
                <Link href="/#featured" style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ← Back to Tile Catalog
                </Link>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
