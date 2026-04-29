import { useEffect, useState } from 'react';
import { fetchAppointments } from '../services/api';
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

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false));
  }, []);

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
