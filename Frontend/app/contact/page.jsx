'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('Main Central Warehouse');
  const [contactMessage, setContactMessage] = useState('');

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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you, ${contactName}! Your inquiry has been routed to ${selectedOutlet}.`, 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Can I pick up tile orders directly from the warehouse or outlets?',
      a: 'Yes, once your order is confirmed and stock is verified in the inventory system, you can choose self-pickup from Central Warehouse A or any of our 2 city outlets.',
    },
    {
      q: 'How does the Tile Box Calculator calculate waste buffer?',
      a: 'The calculator adds a standard 5% to 15% allowance to the net square footage before rounding up to the nearest whole box, preventing shortages during tile cutting and fitting.',
    },
    {
      q: 'Are outlet stock levels synchronized in real-time?',
      a: 'Yes! Our Smart Tile Store inventory management tracks unique item IDs and automated stock transfers between warehouses and outlet branches instantaneously.',
    },
    {
      q: 'Do you provide delivery for bulk commercial tile orders?',
      a: 'Yes, bulk orders for commercial projects, plazas, or home builders can be arranged directly from Main Warehouse A with doorstep freight delivery.',
    },
  ];

  return (
    <>
      <Navbar />

      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">Static Contact Information</span>
          <h2 className="section-title">Store Locations & Outlets</h2>
          <p className="section-desc">
            Explore central warehouse pickup addresses, store outlet locations, direct phone lines, and operating hours.
          </p>
        </div>

        {/* 3-Column Static Location Cards */}
        <div className="category-grid" style={{ marginBottom: '40px' }}>
          {/* Card 1 */}
          <div className="outlet-card">
            <div className="outlet-header">
              <div className="outlet-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="outlet-title">Main Central Warehouse</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Stock Pickup & Bulk Orders</span>
              </div>
            </div>
            <ul className="outlet-details">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Plot 42, Industrial Zone, Warehouse Hub, Lahore
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +92 42 111 845 378 (Ext 101)
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                warehouse@smarttile.com
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="outlet-card">
            <div className="outlet-header">
              <div className="outlet-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <h3 className="outlet-title">Outlet Store #1 (Metro Plaza)</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Display Showroom & Retail</span>
              </div>
            </div>
            <ul className="outlet-details">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Shop 12-14, Ground Floor, Metro Plaza, Gulberg III, Lahore
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +92 42 357 890 12
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                gulberg@smarttile.com
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="outlet-card">
            <div className="outlet-header">
              <div className="outlet-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--accent-gold)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h3 className="outlet-title">Outlet Store #2 (DHA Phase 5)</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Luxury Architectural Gallery</span>
              </div>
            </div>
            <ul className="outlet-details">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Sector C, Commercial Area, DHA Phase 5, Lahore
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +92 42 371 456 89
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                dha@smarttile.com
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form & FAQ Grid */}
        <div className="contact-grid">
          {/* Quick Inquiry Form */}
          <div className="contact-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Send Direct Inquiry</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Request quotation assistance, bulk orders, or sample tiles for your project.
            </p>

            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="outlet">Select Preferred Outlet / Warehouse</label>
                <select
                  id="outlet"
                  className="form-input"
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                >
                  <option value="Main Central Warehouse">Main Central Warehouse (Plot 42)</option>
                  <option value="Outlet #1 (Metro Plaza)">Outlet Store #1 (Metro Plaza)</option>
                  <option value="Outlet #2 (DHA Phase 5)">Outlet Store #2 (DHA Phase 5)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message / Tile Requirements</label>
                <textarea
                  id="message"
                  className="form-input"
                  rows="4"
                  placeholder="Mention tile codes, required square footage, or outlet pickup date..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                <span>Submit Inquiry</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>

          {/* Interactive FAQ Section */}
          <div className="contact-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Frequently Asked Questions</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Common questions regarding our store operations and inventory management.
            </p>

            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`faq-item ${activeFaq === idx ? 'active' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <svg className="faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} />
    </>
  );
}
