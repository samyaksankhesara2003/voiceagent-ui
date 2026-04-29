import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <span className="header-icon">🦷</span>
          <h1>Bright Smile Dental Clinic</h1>
        </div>
        <nav className="header-nav">
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}>
              Book Appointment
            </Link>
            <Link to="/leads" className={`nav-link ${location.pathname === '/leads' ? 'nav-active' : ''}`}>
              CRM Leads
            </Link>
          </div>
          <div className="nav-user">
            <span className="nav-email">{userEmail}</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">
        <p>Bright Smile Dental Clinic &mdash; Voice AI Appointment System (POC)</p>
      </footer>
    </div>
  );
}
