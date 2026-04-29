import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { userEmail, role, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-right">
        <header className="layout-header">
          <div className="header-left">
            <h2 className="header-title">Dashboard</h2>
          </div>
          <div className="header-right">
            <div className="header-user">
              <span className="header-role-badge">{role}</span>
              <span className="header-email">{userEmail}</span>
            </div>
            <button className="header-logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </header>
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
}
