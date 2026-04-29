import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import BookingPage from './components/BookingPage';
import AppointmentConfirmation from './components/AppointmentConfirmation';
import AppointmentsListPage from './components/AppointmentsListPage';
import CrmLeadsPage from './components/CrmLeadsPage';
import DoctorsPage from './components/DoctorsPage';
import PatientsPage from './components/PatientsPage';
import './App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/leads' : '/'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={role === 'admin' ? '/leads' : '/'} replace />
          : <LoginPage />
      } />

      {/* User routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout><BookingPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/confirmation/:callId" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout><AppointmentConfirmation /></Layout>
        </ProtectedRoute>
      } />

      {/* Shared routes */}
      <Route path="/appointments" element={
        <ProtectedRoute allowedRoles={['user', 'admin']}>
          <Layout><AppointmentsListPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/leads" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><CrmLeadsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/doctors" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><DoctorsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><PatientsPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
