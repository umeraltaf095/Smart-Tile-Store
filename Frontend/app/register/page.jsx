'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', color: 'var(--text-dim)', width: '0%', class: '' };
    if (password.length < 6) return { label: 'Weak', color: '#ef4444', width: '33%', class: 'strength-weak' };
    if (password.length < 10) return { label: 'Medium', color: '#f59e0b', width: '66%', class: 'strength-medium' };
    return { label: 'Strong', color: '#10b981', width: '100%', class: 'strength-strong' };
  };

  const strength = getPasswordStrength();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match! Please check again.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast('Account created successfully! Redirecting to login...', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1200);
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
            <h1 className="banner-title">Join Our Smart Tile Store Platform</h1>
            <p className="banner-desc">
              Register your customer account to browse premium tile categories, calculate exact box quantities, request custom quotations, and track order deliveries in real-time.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Instant Sizing & Square Feet Tile Box Calculations</span>
              </div>

              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Access Exclusive Catalog (Floor, Washroom, Elevation)</span>
              </div>

              <div className="feature-item">
                <div className="feature-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Live Order Status Tracking & Delivery Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Registration Form */}
        <div className="login-form-container">
          <div className="form-header">
            <h2 className="form-title">Create Customer Account</h2>
            <p className="form-subtitle">Fill in your details below to set up your new account</p>
          </div>

          <form onSubmit={handleRegisterSubmit}>
            {/* Row 1: Full Name & Phone */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="fullName"
                    className="form-input"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
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

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address">Delivery Address / City</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="address"
                  className="form-input"
                  placeholder="Street 14, Phase 5, Lahore"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 2: Passwords */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Toggle password visibility"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Password Strength:</span>
                <span style={{ fontWeight: 600, color: strength.color }}>{strength.label}</span>
              </div>
              <div style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: strength.width,
                    backgroundColor: strength.color,
                    transition: 'all 0.3s ease',
                  }}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Customer Account</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="register-prompt" style={{ marginTop: '16px' }}>
            Already have an account? <Link href="/login">Sign In</Link>
          </div>

          <div className="visitor-link" style={{ marginTop: '12px', textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-dim)', fontSize: '0.86rem', textDecoration: 'none' }}>
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
