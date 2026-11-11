'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('smarttile_user');
    router.push('/login');
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <div className="brand-header">
            <div className="brand-icon" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}>
              <svg viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <div className="brand-name">
              SmartTile <span>Admin Panel</span>
            </div>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/admin/dashboard" className={`nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className={`nav-link ${pathname === '/admin/categories' ? 'active' : ''}`}>
                Manage Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className={`nav-link ${pathname === '/admin/products' ? 'active' : ''}`}>
                Manage Products
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className={`nav-link ${pathname === '/admin/orders' ? 'active' : ''}`}>
                Manage Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard#inventoryTable" className="nav-link">
                Inventory Tracking
              </Link>
            </li>
            <li>
              <Link href="/" target="_blank" className="nav-link" style={{ color: 'var(--accent-cyan)' }}>
                Preview Storefront ↗
              </Link>
            </li>
          </ul>
        </nav>

        {/* Admin Profile Badge */}
        <div className="user-profile-badge" style={{ borderColor: 'rgba(139, 92, 246, 0.4)' }}>
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}>
            A
          </div>
          <div className="user-info">
            <span className="user-name">Welcome, Admin</span>
            <span className="user-role-tag" style={{ color: 'var(--accent-gold)' }}>
              System Manager
            </span>
          </div>
          <button className="btn-logout" title="Log Out" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
