import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
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
          <p>
            Complete Web-based Tile Store & Multi-Outlet Inventory Tracking System for floor, washroom, and elevation tiles.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Home Landing</Link></li>
            <li><Link href="/#categories">Tile Categories</Link></li>
            <li><Link href="/#featured">Featured Tiles</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Access</h4>
          <ul className="footer-links">
            <li><Link href="/login">Login Portal</Link></li>
            <li><Link href="/register">Register Customer</Link></li>
            <li><Link href="/admin/dashboard">Admin Dashboard</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact & Outlets</h4>
          <ul className="footer-links">
            <li>Main Warehouse A, Block 4</li>
            <li>Outlet Store 1, Metro Plaza</li>
            <li>Email: support@smarttile.com</li>
            <li>Phone: +92 42 111 845 378</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
