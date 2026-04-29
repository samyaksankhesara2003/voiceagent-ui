import { createContext, useContext, useState } from 'react';

const ALLOWED_USERS = {
  'samyak@techuz.com': 'user',
  'admin@techuz.com': 'admin',
};

const STORAGE_KEY_EMAIL = 'voicepoc_auth_email';
const STORAGE_KEY_ROLE = 'voicepoc_auth_role';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(STORAGE_KEY_EMAIL));
  const [role, setRole] = useState(() => localStorage.getItem(STORAGE_KEY_ROLE));

  const isAuthenticated = !!userEmail;

  function login(email) {
    const normalized = email.trim().toLowerCase();
    const userRole = ALLOWED_USERS[normalized];
    if (!userRole) return null;

    localStorage.setItem(STORAGE_KEY_EMAIL, normalized);
    localStorage.setItem(STORAGE_KEY_ROLE, userRole);
    setUserEmail(normalized);
    setRole(userRole);
    return userRole;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY_EMAIL);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    setUserEmail(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
