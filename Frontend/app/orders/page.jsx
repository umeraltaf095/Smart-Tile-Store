'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

export default function TrackOrdersPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel Order Modal State
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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

  // 1. Check user authentication
  useEffect(() => {
    const saved = localStorage.getItem('smarttile_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
      } catch (e) {
        setCurrentUser(null);
      }
    }
    setAuthChecked(true);
  }, []);

  // 2. Fetch customer's orders
  const fetchOrders = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/orders?email=${encodeURIComponent(currentUser.email)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.data || []);
      } else {
        showToast(data.message || 'Failed to load order history', 'error');
      }
    } catch (err) {
      showToast('Network error while loading orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchOrders();
    } else if (authChecked) {
      setLoading(false);
    }
  }, [currentUser, authChecked]);

  // 3. Cancel Order (PATCH API)
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderToCancel._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Cancelled',
          notes: (orderToCancel.notes ? orderToCancel.notes + ' | ' : '') + 'Cancelled by customer',
        }),
      });

      const data = await res.json();
      setCancelling(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to cancel order', 'error');
        return;
      }

      showToast(`Order #${orderToCancel.orderNumber} has been cancelled successfully`, 'success');
      setOrderToCancel(null);
      fetchOrders(); // Refresh orders
    } catch (err) {
      setCancelling(false);
      showToast('Network error while cancelling order', 'error');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      (order.items && order.items.some((it) => it.productName.toLowerCase().includes(q) || it.itemId.toLowerCase().includes(q)));

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Counters
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Confirmed':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Processing':
        return { bg: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Shipped':
        return { bg: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', border: 'rgba(6, 182, 212, 0.3)' };
      case 'Delivered':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const getStepActiveIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return -1;
    }
  };

  return (
    <>
      <Navbar />

      <main className="section-container" style={{ paddingTop: '28px', minHeight: '80vh' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Track Orders & Quotations</span>
        </div>

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <span className="section-tag">Customer Portal</span>
            <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
              My Orders & Quotations
            </h1>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              Track real-time shipment status, review purchase history, and inspect quotations directly from MongoDB.
            </p>
          </div>

          <Link href="/#featured" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>+ Place New Tile Order</span>
          </Link>
        </div>

        {/* Not Logged In Visitor View */}
        {!currentUser && authChecked ? (
          <div style={{ textAlign: 'center', padding: '70px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', maxWidth: '640px', margin: '40px auto' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              Customer Sign-In Required
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Please sign in with your registered customer account to track order status, shipments, and quotation history.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link href="/login" className="btn-submit" style={{ textDecoration: 'none', width: 'auto', padding: '12px 28px' }}>
                Sign In to My Account
              </Link>
              <Link href="/register" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 24px' }}>
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Summary Cards - Same Row Square Boxes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              {/* Box 1: Total Orders */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  minHeight: '180px',
                  boxShadow: 'var(--shadow-glass)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.12)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '10px',
                  }}
                >
                  📦
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {totalCount}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  Total Orders
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  All time orders & quotes
                </div>
              </div>

              {/* Box 2: Pending Verification */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  minHeight: '180px',
                  boxShadow: 'var(--shadow-glass)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '10px',
                  }}
                >
                  ⏳
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1.1 }}>
                  {pendingCount}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  Pending Verification
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Awaiting confirmation
                </div>
              </div>

              {/* Box 3: In Transit / Shipped */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  minHeight: '180px',
                  boxShadow: 'var(--shadow-glass)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.12)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '10px',
                  }}
                >
                  🚚
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1.1 }}>
                  {shippedCount}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  In Transit / Shipped
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dispatched from warehouse
                </div>
              </div>

              {/* Box 4: Completed & Delivered */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  minHeight: '180px',
                  boxShadow: 'var(--shadow-glass)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '10px',
                  }}
                >
                  ✅
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981', lineHeight: 1.1 }}>
                  {deliveredCount}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  Completed & Delivered
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Delivered to site
                </div>
              </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by Order Number (e.g. ORD-1001), tile name or ID..."
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
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', padding: '8px 12px' }}
                >
                  <option value="All">All Statuses ({totalCount})</option>
                  <option value="Pending">Pending ({pendingCount})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped ({shippedCount})</option>
                  <option value="Delivered">Delivered ({deliveredCount})</option>
                  <option value="Cancelled">Cancelled ({cancelledCount})</option>
                </select>
              </div>
            </div>

            {/* Orders Feed */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin" style={{ marginBottom: '12px', color: 'var(--primary)' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
                <div>Loading your orders from database...</div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  No Orders Placed Yet
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
                  You haven't placed any tile purchases or quotation requests yet. Explore our live catalog to select your tiles!
                </p>
                <Link href="/#featured" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto' }}>
                  Browse Tile Catalog
                </Link>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                No orders found matching your search criteria.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredOrders.map((order) => {
                  const badge = getStatusBadgeStyle(order.status);
                  const activeStep = getStepActiveIndex(order.status);
                  const isCancelled = order.status === 'Cancelled';
                  const isPending = order.status === 'Pending';
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={order._id}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-glass)',
                      }}
                    >
                      {/* Order Card Header */}
                      <div
                        style={{
                          padding: '16px 24px',
                          background: 'var(--bg-dark)',
                          borderBottom: '1px solid var(--border-light)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                            {order.orderNumber}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Placed on {dateStr}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: order.orderType === 'Price Quotation' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                              color: order.orderType === 'Price Quotation' ? 'var(--accent-gold)' : 'var(--primary)',
                              fontWeight: 700,
                            }}
                          >
                            {order.orderType}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badge.color }}></span>
                            {order.status}
                          </span>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setOrderToCancel(order)}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#ef4444',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              title="Cancel this order"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visual Status Step Tracker (if not cancelled) */}
                      {!isCancelled ? (
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'rgba(15, 23, 42, 0.3)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }}>
                            {[
                              { label: 'Order Received', desc: 'Pending verification' },
                              { label: 'Confirmed', desc: 'Stock allocated' },
                              { label: 'Shipped', desc: 'Dispatched in transit' },
                              { label: 'Delivered', desc: 'Arrived at site' },
                            ].map((step, idx) => {
                              const isCompleted = activeStep >= idx;
                              const isCurrent = activeStep === idx;
                              return (
                                <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                                  <div
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      margin: '0 auto 8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.78rem',
                                      fontWeight: 800,
                                      background: isCompleted ? 'var(--primary)' : 'var(--bg-dark)',
                                      color: isCompleted ? '#ffffff' : 'var(--text-dim)',
                                      border: isCompleted ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                      boxShadow: isCurrent ? '0 0 12px rgba(37, 99, 235, 0.5)' : 'none',
                                    }}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <div style={{ fontSize: '0.82rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? 'var(--text-main)' : 'var(--text-dim)' }}>
                                    {step.label}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                    {step.desc}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '12px 24px', background: 'rgba(239, 68, 68, 0.08)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>⚠️</span>
                          <span><strong>This order was cancelled.</strong> No delivery or payment will be processed.</span>
                        </div>
                      )}

                      {/* Items Details */}
                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
                          ORDER ITEMS & SPECIFICATIONS
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {order.items.map((item, itIdx) => (
                            <div
                              key={itIdx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '12px',
                                padding: '12px 16px',
                                background: 'var(--bg-dark)',
                                borderRadius: '8px',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                  {item.productName}{' '}
                                  <span style={{ color: 'var(--primary)', fontSize: '0.82rem', marginLeft: '6px' }}>
                                    ({item.itemId})
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Brand: {item.company} | Size: {item.size} | Coverage: {item.boxCoverage} Sq.Ft/Box
                                </div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                  {item.boxes} Box(es)
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                                  ${Number(item.totalPrice).toFixed(2)} (${Number(item.pricePerBox).toFixed(2)}/box)
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Metadata Footer */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Delivery Address:</span>
                            <strong>{order.deliveryAddress}</strong>
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Contact Phone:</span>
                            <strong>{order.customerPhone || 'Not provided'}</strong>
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Payment Method:</span>
                            <strong>{order.paymentMethod}</strong>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Total Order Value:</span>
                            <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>
                              ${Number(order.totalAmount).toFixed(2)}
                            </strong>
                          </div>
                        </div>

                        {order.notes && (
                          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '4px' }}>
                            <strong>Site Notes:</strong> {order.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: '440px', textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Cancel Order #{orderToCancel.orderNumber}?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to cancel this order for{' '}
              <strong>{orderToCancel.items[0]?.productName}</strong> ({orderToCancel.totalBoxes} boxes)? This action cannot be reversed.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setOrderToCancel(null)}
                disabled={cancelling}
              >
                No, Keep Order
              </button>
              <button
                type="button"
                className="btn-submit"
                style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }}
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}

