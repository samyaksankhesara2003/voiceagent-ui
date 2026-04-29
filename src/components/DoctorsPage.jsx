import { useEffect, useState } from 'react';
import { fetchDoctors } from '../services/api';
import './DoctorsPage.css';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(() => setError('Failed to load doctors.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading doctors...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="doctors-page">
      <div className="page-header">
        <h2>Doctors</h2>
        <span className="page-count">{doctors.length} total</span>
      </div>

      {doctors.length === 0 ? (
        <div className="page-empty">No doctors found.</div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-avatar">
                {doc.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{doc.name}</h3>
                <span className="doctor-specialty">{doc.specialty}</span>
                {doc.bio && <p className="doctor-bio">{doc.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
