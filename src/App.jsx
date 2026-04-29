import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import BookingPage from './components/BookingPage';
import AppointmentConfirmation from './components/AppointmentConfirmation';
import CrmLeadsPage from './components/CrmLeadsPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout><BookingPage /></Layout></ProtectedRoute>} />
          <Route path="/confirmation/:callId" element={<ProtectedRoute><Layout><AppointmentConfirmation /></Layout></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Layout><CrmLeadsPage /></Layout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
