import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <span className="header-icon">🦷</span>
          <h1>Bright Smile Dental Clinic</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}>
            Book Appointment
          </Link>
          <Link to="/leads" className={`nav-link ${location.pathname === '/leads' ? 'nav-active' : ''}`}>
            CRM Leads
          </Link>
        </nav>
      </header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">
        <p>Bright Smile Dental Clinic &mdash; Voice AI Appointment System (POC)</p>
      </footer>
    </div>
  );
}
