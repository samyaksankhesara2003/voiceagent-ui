import { createContext, useContext, useState } from 'react';

const ALLOWED_EMAIL = 'samyak@techuz.com';
const STORAGE_KEY = 'voicepoc_auth_email';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(STORAGE_KEY));

  const isAuthenticated = !!userEmail;

  function login(email) {
    if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
      return false;
    }
    const normalized = email.trim().toLowerCase();
    localStorage.setItem(STORAGE_KEY, normalized);
    setUserEmail(normalized);
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUserEmail(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
