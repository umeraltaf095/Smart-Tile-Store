'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../../../components/AdminHeader';
import Toast from '../../../components/Toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

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

  // 1. Fetch all orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.data || []);
      } else {
        showToast(data.message || 'Failed to load orders', 'error');
      }
    } catch (err) {
      showToast('Network error while loading orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      setUpdatingId(null);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to update order status', 'error');
        return;
      }

      showToast(`Order status updated to "${newStatus}"!`, 'success');
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setUpdatingId(null);
      showToast('Network error updating status', 'error');
    }
  };

  // Filters
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      (order.items && order.items.some((it) => it.productName.toLowerCase().includes(q) || it.itemId.toLowerCase().includes(q)));

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI counters
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

  return (
    <>
      <AdminHeader />

      <main className="section-container" style={{ paddingTop: '28px', minHeight: '80vh' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link href="/admin/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Admin Dashboard</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Manage Customer Orders & Quotations</span>
        </div>

        {/* Page Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <span className="section-tag">Order Fulfillment</span>
            <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
              Customer Orders & Quotations
            </h1>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              Review incoming tile purchase orders, process quotations, and update shipment delivery statuses in real-time.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>↻ Refresh Orders</span>
          </button>
        </div>

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
              📋
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
              Total Incoming Orders
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              From all registered customers
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
              Action Required (Pending)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Awaiting store confirmation
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
              Dispatched (Shipped)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              En route to customer site
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
              Delivered & Fulfilled
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Successful site deliveries
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Email, or Item ID..."
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
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="All">All Orders ({totalCount})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped ({shippedCount})</option>
              <option value="Delivered">Delivered ({deliveredCount})</option>
              <option value="Cancelled">Cancelled ({cancelledCount})</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              Loading orders from database...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              No orders found matching the filter.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order # & Date</th>
                  <th>Customer</th>
                  <th>Tile Items & Quantity</th>
                  <th>Total Amount</th>
                  <th>Type & Payment</th>
                  <th>Current Status</th>
                  <th>Change Status (Action)</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const badge = getStatusBadgeStyle(order.status);
                  const isUpdating = updatingId === order._id;
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order._id}>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                          {order.orderNumber}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {dateStr}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{order.customerEmail}</div>
                        {order.customerPhone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>📞 {order.customerPhone}</div>
                        )}
                      </td>

                      <td>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ marginBottom: idx > 0 ? '4px' : 0 }}>
                            <span style={{ fontWeight: 600 }}>{it.productName}</span>{' '}
                            <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>({it.itemId})</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                              {it.boxes} Box(es) • ${(Number(it.pricePerBox)).toFixed(2)}/box
                            </div>
                          </div>
                        ))}
                      </td>

                      <td>
                        <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>
                          ${Number(order.totalAmount).toFixed(2)}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {order.totalBoxes} total box(es)
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: order.orderType === 'Price Quotation' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                            color: order.orderType === 'Price Quotation' ? 'var(--accent-gold)' : 'var(--primary)',
                            display: 'inline-block',
                            marginBottom: '4px',
                          }}
                        >
                          {order.orderType}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {order.paymentMethod}
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }}></span>
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-light)',
                            background: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}

