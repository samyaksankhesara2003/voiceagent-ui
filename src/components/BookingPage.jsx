import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../services/api';
import { useVapi } from '../hooks/useVapi';
import VoiceAgent from './VoiceAgent';
import './BookingPage.css';

export default function BookingPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { callStatus, transcript, isSpeaking, callId, selectedDoctor, startCall, endCall } = useVapi();

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch((err) => console.error('Failed to fetch doctors:', err));
  }, []);

  // Navigate to confirmation page when call ends
  useEffect(() => {
    if (callStatus === 'ended' && callId) {
      navigate(`/confirmation/${callId}`);
    }
  }, [callStatus, callId, navigate]);

  // Show voice agent when call is in progress
  if (callStatus !== 'idle' && callStatus !== 'ended') {
    return (
      <VoiceAgent
        callStatus={callStatus}
        transcript={transcript}
        isSpeaking={isSpeaking}
        onEndCall={endCall}
        doctor={selectedDoctor}
      />
    );
  }

  // Default: show doctor cards with booking buttons
  return (
    <div className="booking-page">
      <div className="page-header">
        <h2>Book an Appointment</h2>
        <p className="page-subtitle">Select a doctor to start booking via our AI voice assistant</p>
      </div>

      <div className="doctors-grid">
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-avatar">
              {doc.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="doctor-info">
              <h4>{doc.name}</h4>
              <span className="doctor-specialty">{doc.specialty}</span>
              {doc.bio && <p className="doctor-bio">{doc.bio}</p>}
            </div>
            <button className="doctor-book-btn" onClick={() => startCall(doc)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
