import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, role, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate(role === 'admin' ? '/leads' : '/', { replace: true });
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const userRole = login(email);
    if (userRole) {
      navigate(userRole === 'admin' ? '/leads' : '/', { replace: true });
    } else {
      setError('Access denied. Only authorized emails can sign in.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🦷</span>
          <h1>Bright Smile Dental Clinic</h1>
          <p className="login-subtitle">Voice AI Appointment System</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="login-label">Email Address</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>
    </div>
  );
}
