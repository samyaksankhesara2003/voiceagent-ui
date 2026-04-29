import { useEffect, useState } from 'react';
import { fetchCrmLeads, fetchCallDetails } from '../services/api';
import './CrmLeadsPage.css';

const STATUS_STYLES = {
  new: 'status-new',
  contacted: 'status-contacted',
  converted: 'status-converted',
};

function parseTranscript(transcript) {
  if (!transcript) return [];
  if (Array.isArray(transcript)) {
    return transcript.map((msg) => ({
      role: msg.role === 'assistant' || msg.role === 'bot' ? 'AI' : 'User',
      text: msg.message || msg.content || '',
    }));
  }
  // Parse string like "AI: ... User: ... AI: ..."
  const parts = [];
  const regex = /(AI|User|Assistant|Bot):\s*/gi;
  let lastIndex = 0;
  let lastRole = null;
  let match;
  while ((match = regex.exec(transcript)) !== null) {
    if (lastRole !== null) {
      parts.push({ role: lastRole, text: transcript.slice(lastIndex, match.index).trim() });
    }
    const r = match[1].toLowerCase();
    lastRole = (r === 'ai' || r === 'assistant' || r === 'bot') ? 'AI' : 'User';
    lastIndex = regex.lastIndex;
  }
  if (lastRole !== null) {
    parts.push({ role: lastRole, text: transcript.slice(lastIndex).trim() });
  }
  if (parts.length === 0 && transcript.trim()) {
    parts.push({ role: 'AI', text: transcript.trim() });
  }
  return parts;
}

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [callData, setCallData] = useState({});
  const [callLoading, setCallLoading] = useState(null);

  useEffect(() => {
    fetchCrmLeads()
      .then(setLeads)
      .catch(() => setError('Failed to load CRM leads.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleRowClick(lead) {
    if (expandedId === lead.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(lead.id);

    if (!lead.vapi_call_id) return;
    if (callData[lead.vapi_call_id]) return;

    setCallLoading(lead.id);
    try {
      const data = await fetchCallDetails(lead.vapi_call_id);
      setCallData((prev) => ({ ...prev, [lead.vapi_call_id]: data }));
    } catch {
      setCallData((prev) => ({ ...prev, [lead.vapi_call_id]: { error: true } }));
    } finally {
      setCallLoading(null);
    }
  }

  if (loading) {
    return <div className="leads-page"><div className="leads-loading">Loading CRM leads...</div></div>;
  }

  if (error) {
    return <div className="leads-page"><div className="leads-error">{error}</div></div>;
  }

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>CRM Leads</h2>
        <span className="leads-count">{leads.length} lead{leads.length !== 1 ? 's' : ''}</span>
      </div>

      {leads.length === 0 ? (
        <div className="leads-empty">
          <p>No CRM leads yet. Book an appointment via the voice agent to create a lead.</p>
        </div>
      ) : (
        <div className="leads-table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Source</th>
                <th>Status</th>
                <th>Summary</th>
                <th>Date</th>
                <th>Call Record</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const isExpanded = expandedId === lead.id;
                const details = lead.vapi_call_id ? callData[lead.vapi_call_id] : null;

                return (
                  <tr key={lead.id} className="lead-row-group">
                    <td colSpan={6} style={{ padding: 0, border: 'none' }}>
                      <div
                        className={`lead-row ${isExpanded ? 'lead-row-expanded' : ''}`}
                        onClick={() => handleRowClick(lead)}
                      >
                        <span className="lead-patient">{lead.patient?.name || '—'}</span>
                        <span><span className="lead-source">{lead.source}</span></span>
                        <span>
                          <span className={`lead-status ${STATUS_STYLES[lead.status] || ''}`}>
                            {lead.status}
                          </span>
                        </span>
                        <span className="lead-summary" title={lead.interaction_summary}>
                          {lead.interaction_summary}
                        </span>
                        <span className="lead-date">
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                        <span className="lead-call-record">
                          {lead.vapi_call_id ? (
                            <span className={`call-record-btn ${isExpanded ? 'call-record-active' : ''}`}>
                              {isExpanded ? 'Hide' : 'View'}
                            </span>
                          ) : '—'}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="call-details">
                          {!lead.vapi_call_id ? (
                            <p className="call-details-empty">No call ID associated with this lead.</p>
                          ) : callLoading === lead.id ? (
                            <p className="call-details-loading">Loading call details...</p>
                          ) : details?.error ? (
                            <p className="call-details-error">Failed to load call details.</p>
                          ) : details ? (
                            <div className="call-details-content">
                              <div className="call-details-grid">
                                <div className="call-detail-item">
                                  <span className="call-detail-label">Status</span>
                                  <span className="call-detail-value">{details.status || '—'}</span>
                                </div>
                                <div className="call-detail-item">
                                  <span className="call-detail-label">Duration</span>
                                  <span className="call-detail-value">
                                    {details.duration ? `${Math.round(details.duration)}s` : '—'}
                                  </span>
                                </div>
                                <div className="call-detail-item">
                                  <span className="call-detail-label">Started</span>
                                  <span className="call-detail-value">
                                    {details.startedAt ? new Date(details.startedAt).toLocaleString() : '—'}
                                  </span>
                                </div>
                              </div>

                              {details.recordingUrl && (
                                <div className="call-section">
                                  <h4>Recording</h4>
                                  <audio controls src={details.recordingUrl} className="call-audio" />
                                </div>
                              )}

                              {details.summary && (
                                <div className="call-section">
                                  <h4>AI Summary</h4>
                                  <p className="call-text">{details.summary}</p>
                                </div>
                              )}

                              {details.transcript && (() => {
                                const messages = parseTranscript(details.transcript);
                                return messages.length > 0 ? (
                                  <div className="call-section">
                                    <h4>Transcript</h4>
                                    <div className="call-transcript">
                                      {messages.map((msg, i) => (
                                        <div key={i} className={`transcript-msg transcript-${msg.role.toLowerCase()}`}>
                                          <span className="transcript-role">{msg.role}:</span>
                                          <span className="transcript-text">{msg.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null;
                              })()}

                              {!details.recordingUrl && !details.summary && !details.transcript && (
                                <p className="call-details-empty">No recording, transcript, or summary available for this call.</p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
