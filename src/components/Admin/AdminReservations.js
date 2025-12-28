import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AdminReservations.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/admin/reservations')
      .then(res => res.json())
      .then(data => setReservations(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="admin-reservation-bg">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="admin-reservation-bg-image" />
      <div className="admin-reservation-center-wrapper">
        <div className="admin-reservation-container">
          <div className="admin-reservation-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 className="admin-reservation-title" style={{ marginBottom: 0 }}>Reservations</h1>
              <button
                className="admin-reservation-report-btn small"
                onClick={() => {
                  setShowExportModal(true);
                  setTokenInput('');
                  setTokenError('');
                }}
              >
                Generate Reservation Report
              </button>
            </div>
            <Link to="/admin-dashboard" className="admin-reservation-back-btn">
              &#8592; Back
            </Link>
          </div>
          <div className="admin-reservation-list">
            {reservations.map(r => (
              <div key={r.reservation_id} className="admin-reservation-card">
                {r.image && (
                  <img
                    src={r.image}
                    alt="Unit"
                    className="admin-reservation-image"
                  />
                )}
                <div className="admin-reservation-info">
                  <div><strong>Unit:</strong> {r.title}</div>
                  <div><strong>Price:</strong> ₱{r.price}</div>
                  <div><strong>Name:</strong> {r.name}</div>
                  <div><strong>Contact:</strong> {r.contact}</div>
                  {r.other_info && <div><strong>Other:</strong> {r.other_info}</div>}
                  <div><strong>Date:</strong> {new Date(r.created_at).toLocaleString()}</div>
                </div>
                <button
                  className="admin-reservation-cancel-btn"
                  onClick={() => { setCancelId(r.reservation_id); setShowFirstConfirm(true); }}
                >
                  Cancel Reservation
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* First confirmation popup */}
      {showFirstConfirm && (
        <div className="admin-reservation-modal-backdrop" onClick={() => setShowFirstConfirm(false)}>
          <div className="admin-reservation-modal" onClick={e => e.stopPropagation()}>
            <div>Are you sure you want to cancel this reservation?</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button className="admin-reservation-modal-btn" onClick={() => { setShowFirstConfirm(false); setShowSecondConfirm(true); }}>Yes</button>
              <button className="admin-reservation-modal-btn cancel" onClick={() => setShowFirstConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Second confirmation popup */}
      {showSecondConfirm && (
        <div className="admin-reservation-modal-backdrop" onClick={() => setShowSecondConfirm(false)}>
          <div className="admin-reservation-modal" onClick={e => e.stopPropagation()}>
            <div>This action cannot be undone. Cancel reservation and make unit available again?</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button
                className="admin-reservation-modal-btn"
                onClick={async () => {
                  await fetch(`https://tenantportal-backend.onrender.com/api/admin/reservations/${cancelId}`, { method: 'DELETE' });
                  setReservations(reservations => reservations.filter(r => r.reservation_id !== cancelId));
                  setShowSecondConfirm(false);
                  setCancelId(null);
                }}
              >Confirm</button>
              <button className="admin-reservation-modal-btn cancel" onClick={() => setShowSecondConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExportModal && (
        <div className="admin-reservation-modal-backdrop" onClick={() => setShowExportModal(false)}>
          <div
            className="admin-reservation-modal"
            style={{ maxWidth: 400, width: '90%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontWeight: 700, marginBottom: 18 }}>
              Generate Reservation Report
            </h2>
            <p style={{ color: "#b71c1c", background: "#fff3cd", borderRadius: 8, padding: 12, marginBottom: 18, fontSize: "1.05rem" }}>
              <strong>Security:</strong> Enter your developer or admin token to download the Excel file.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setTokenError('');
                setExporting(true);
                try {
                  const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/export-reservations', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${tokenInput}`
                    }
                  });
                  if (!response.ok) {
                    setTokenError('Invalid token or error exporting file.');
                    setExporting(false);
                    return;
                  }
                  const blob = await response.blob();
                  const urlObj = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = urlObj;
                  a.download = 'Reservations_Report.xlsx';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(urlObj);
                  setShowExportModal(false);
                } catch (err) {
                  setTokenError('Failed to export file.');
                } finally {
                  setExporting(false);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="Developer or Admin Token"
                required
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  padding: "14px",
                  fontSize: "1.1rem",
                  border: "2px solid #111",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  boxSizing: "border-box",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
              {tokenError && <p style={{ color: 'red', marginBottom: 10 }}>{tokenError}</p>}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button type="submit" className="admin-reservation-modal-btn" disabled={exporting}>
                  {exporting ? 'Exporting...' : 'Export'}
                </button>
                <button type="button" className="admin-reservation-modal-btn cancel" onClick={() => setShowExportModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}