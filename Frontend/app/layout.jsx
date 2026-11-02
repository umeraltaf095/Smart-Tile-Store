import '../styles/main.css';
import '../styles/index.css';
import '../styles/admin.css';
import '../styles/login.css';
import '../styles/contact.css';
import '../styles/register.css';

export const metadata = {
  title: 'Smart Tile Store & Inventory Management System',
  description: 'A web-based platform designed to efficiently manage the operations of a tile retail business dealing with multiple tile types, customers, outlets, and warehouses.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-ambient">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
          <div className="glow-orb glow-orb-3"></div>
          <div className="tile-pattern"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
