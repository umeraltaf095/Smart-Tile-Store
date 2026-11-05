'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState('customer');
  const [email, setEmail] = useState('demo@email.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Toast State
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

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('admin@smarttile.com');
      setPassword('admin1234');
    } else {
      setEmail('customer@smarttile.com');
      setPassword('demo1234');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: activeRole,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        showToast(data.message || 'Authentication failed', 'error');
        return;
      }

      // Save user session in localStorage
      localStorage.setItem('smarttile_user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        showToast('Welcome Admin! Redirecting to Admin Dashboard...', 'success');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1200);
      } else {
        showToast('Login successful! Redirecting to Storefront...', 'success');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      }
    } catch (err) {
      setLoading(false);
      showToast('Network error connecting to login backend', 'error');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address first!', 'error');
    } else {
      showToast(`Password reset link sent to ${email}`, 'success');
    }
  };

  return (
    <>
      <div className="login-wrapper">
        {/* Left Side Hero Banner */}
        <div className="login-banner">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="brand-header">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </div>
              <div className="brand-name">
                SmartTile <span>Manager</span>
              </div>
            </div>
          </Link>

          <div className="banner-content">
            <h1 className="banner-title">Smart Tile Store & Inventory Portal</h1>
            <p className="banner-desc">
              Automated multi-outlet inventory tracking, tile catalog management, custom area calculations, and seamless customer order fulfillment.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Real-time Warehouse & Outlet Stock Transfers</span>
              </div>

              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Floor, Washroom & Elevation Tile Categorization</span>
              </div>

              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Automated Sales Reports & Quotation System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Authentication Form */}
        <div className="login-form-container">
          <div className="form-header">
            <h2 className="form-title">Sign In to Your Account</h2>
            <p className="form-subtitle">
              {activeRole === 'admin'
                ? 'Admin Authentication for Inventory & Store Management'
                : 'Customer Portal - Access catalog, track orders & requests'}
            </p>
          </div>

          {/* Role Selector Switcher */}
          <div className="role-tabs" role="tablist">
            <button
              type="button"
              className={`role-btn ${activeRole === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('customer')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Customer Login
            </button>

            <button
              type="button"
              className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('admin')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Admin Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="emailInput">Email or Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="emailInput"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="passwordInput">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passwordInput"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Toggle password visibility"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                Remember me
              </label>

              <a href="#" onClick={handleForgotPassword} className="forgot-link">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Customer Registration Prompt */}
          {activeRole === 'customer' && (
            <div className="register-prompt">
              Don't have a customer account? <Link href="/register">Register Account</Link>
            </div>
          )}

          <div className="visitor-link" style={{ marginTop: '14px', textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-dim)', fontSize: '0.86rem', textDecoration: 'none' }}>
              ← Continue as Visitor
            </Link>
          </div>
        </div>
      </div>

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
