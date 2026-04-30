import { useEffect, useState } from 'react';
import { fetchAppointments, deleteAppointment } from '../services/api';
import './AppointmentsListPage.css';

const STATUS_CLASS = {
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  pending: 'badge-pending',
};

export default function AppointmentsListPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this appointment? This will also remove the Google Calendar event and free the slot.')) {
      return;
    }
    setDeleting(id);
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert('Failed to delete appointment.');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <div className="page-loading">Loading appointments...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="appt-list-page">
      <div className="page-header">
        <h2>Appointments</h2>
        <span className="page-count">{appointments.length} total</span>
      </div>

      {appointments.length === 0 ? (
        <div className="page-empty">No appointments found.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="cell-primary">{appt.patient?.name || '—'}</td>
                  <td>{appt.doctor?.name || '—'}</td>
                  <td>{formatDate(appt.date)}</td>
                  <td>{appt.start_time} – {appt.end_time}</td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[appt.status] || ''}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(appt.id)}
                      disabled={deleting === appt.id}
                      title="Delete appointment"
                    >
                      {deleting === appt.id ? (
                        <span className="delete-spinner" />
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
