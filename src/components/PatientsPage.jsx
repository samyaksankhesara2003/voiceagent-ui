import { useEffect, useState } from 'react';
import { fetchPatients } from '../services/api';
import './PatientsPage.css';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch(() => setError('Failed to load patients.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading patients...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="patients-page">
      <div className="page-header">
        <h2>Patients</h2>
        <span className="page-count">{patients.length} total</span>
      </div>

      {patients.length === 0 ? (
        <div className="page-empty">No patients found.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="cell-primary">{p.name}</td>
                  <td>{p.phone || '—'}</td>
                  <td>{p.email || '—'}</td>
                  <td>{formatDate(p.created_at)}</td>
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
