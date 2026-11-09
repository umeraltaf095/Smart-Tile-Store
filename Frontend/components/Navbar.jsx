'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('smarttile_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smarttile_user');
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
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

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/#categories" className="nav-link">
                Tile Categories
              </Link>
            </li>
            <li>
              <Link href="/#featured" className="nav-link">
                Featured Tiles
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {currentUser ? (
          <div className="user-profile-badge">
            <div className="user-avatar">{currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">Welcome, {currentUser.name || 'User'}</span>
              <span className="user-role-tag">{currentUser.role === 'admin' ? 'Admin Manager' : 'Online Buyer'}</span>
            </div>
            {currentUser.role === 'admin' && (
              <Link href="/admin/dashboard" className="btn-tbl" style={{ marginLeft: 8, fontSize: '0.78rem' }}>
                Admin Panel
              </Link>
            )}
            <button className="btn-logout" title="Log Out" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
              Sign In
            </Link>
            <Link href="/register" className="btn-submit" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
