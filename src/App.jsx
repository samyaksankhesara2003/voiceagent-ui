import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookingPage from './components/BookingPage';
import AppointmentConfirmation from './components/AppointmentConfirmation';
import CrmLeadsPage from './components/CrmLeadsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/confirmation/:callId" element={<AppointmentConfirmation />} />
          <Route path="/leads" element={<CrmLeadsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
