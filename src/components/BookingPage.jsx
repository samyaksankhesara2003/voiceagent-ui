import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../services/api';
import { useVapi } from '../hooks/useVapi';
import VoiceAgent from './VoiceAgent';
import './BookingPage.css';

export default function BookingPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { callStatus, transcript, isSpeaking, callId, startCall, endCall } = useVapi();

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
      />
    );
  }

  // Default: show booking landing page
  return (
    <div className="booking-page">
      <section className="hero">
        <h2>Book Your Dental Appointment</h2>
        <p>
          Our AI voice assistant will help you find the right doctor, check
          availability, and book your appointment — all through a simple
          conversation.
        </p>
        <button className="btn btn-primary btn-lg" onClick={startCall}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          Book Appointment
        </button>
      </section>

      <section className="doctors-section">
        <h3>Our Dental Team</h3>
        <div className="doctors-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-avatar">
                {doc.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h4>{doc.name}</h4>
              <p className="doctor-specialty">{doc.specialty}</p>
              {doc.bio && <p className="doctor-bio">{doc.bio}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
