import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAppointmentByCallId } from '../services/api';
import './AppointmentConfirmation.css';

export default function AppointmentConfirmation() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!callId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAppointment() {
      try {
        const data = await fetchAppointmentByCallId(callId);
        if (!cancelled) setAppointment(data);
      } catch {
        if (!cancelled) setError('Could not load appointment details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Small delay to let the backend process the booking
    const timer = setTimeout(loadAppointment, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [callId]);

  if (loading) {
    return (
      <div className="confirmation">
        <div className="confirmation-loading">Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="confirmation">
        <div className="confirmation-card">
          <h2>Call Completed</h2>
          <p>{error || 'No appointment was booked during this call.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Book an Appointment
          </button>
        </div>
      </div>
    );
  }

  const dateStr = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="confirmation">
      <div className="confirmation-card">
        <div className="confirmation-icon">&#10003;</div>
        <h2>Appointment Confirmed!</h2>
        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">Doctor</span>
            <span className="detail-value">{appointment.doctor?.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Specialty</span>
            <span className="detail-value">{appointment.doctor?.specialty}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value">{dateStr}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time</span>
            <span className="detail-value">{appointment.start_time} - {appointment.end_time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Patient</span>
            <span className="detail-value">{appointment.patient?.name}</span>
          </div>
          {appointment.patient?.phone && (
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{appointment.patient.phone}</span>
            </div>
          )}
          {appointment.patient?.email && (
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{appointment.patient.email}</span>
            </div>
          )}
          {appointment.intakeRecord && (
            <div className="detail-row">
              <span className="detail-label">Reason</span>
              <span className="detail-value">{appointment.intakeRecord.reason_for_visit}</span>
            </div>
          )}
          {appointment.intakeRecord?.symptoms && (
            <div className="detail-row">
              <span className="detail-label">Symptoms</span>
              <span className="detail-value">{appointment.intakeRecord.symptoms}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status-confirmed">{appointment.status}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Book Another Appointment
        </button>
      </div>
    </div>
  );
}
