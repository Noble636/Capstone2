import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AvailableUnit.css';
import '../../css/Tenant/BrowseUnit.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/admin/reservations')
      .then(res => res.json())
      .then(data => setReservations(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="browseunit-bg">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="browseunit-bg-image" />
      <div className="main-center-wrapper">
        <div className="admin-available-unit-container" style={{ background: 'rgba(255,255,255,0.98)' }}>
          <h1 className="admin-available-unit-title">Reservations</h1>
          <Link to="/admin-dashboard" className="browseunit-back-btn" style={{ marginBottom: 18 }}>
            &#8592; Back
          </Link>
          <div className="unit-list" style={{ justifyContent: 'center' }}>
            {Array.isArray(reservations) && reservations.length === 0 && (
              <div className="no-units">No reservations yet.</div>
            )}
            {Array.isArray(reservations) && reservations.map(r => (
              <div
                key={r.reservation_id}
                className="unit-card"
                style={{
                  maxWidth: 340,
                  margin: '24px auto',
                  border: '1.5px solid #222',
                  borderRadius: 14,
                  background: '#f8fafc',
                  boxShadow: '0 1px 6px rgba(30,41,59,0.07)',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt="Unit"
                    style={{
                      width: 120,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 8
                    }}
                  />
                )}
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <div><strong>Unit:</strong> {r.title}</div>
                  <div><strong>Price:</strong> ₱{r.price}</div>
                  <div><strong>Name:</strong> {r.name}</div>
                  <div><strong>Contact:</strong> {r.contact}</div>
                  {r.other_info && <div><strong>Other:</strong> {r.other_info}</div>}
                  <div><strong>Date:</strong> {new Date(r.created_at).toLocaleString()}</div>
                </div>
                <button
                  className="inquire-btn"
                  style={{
                    marginTop: 16,
                    background: '#c0392b',
                    width: '100%',
                    fontWeight: 'bold'
                  }}
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
        <div className="inquiry-modal-backdrop" onClick={() => setShowFirstConfirm(false)}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <div>Are you sure you want to cancel this reservation?</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button className="admin-available-unit-btn" onClick={() => { setShowFirstConfirm(false); setShowSecondConfirm(true); }}>Yes</button>
              <button className="admin-available-unit-btn back-btn" onClick={() => setShowFirstConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Second confirmation popup */}
      {showSecondConfirm && (
        <div className="inquiry-modal-backdrop" onClick={() => setShowSecondConfirm(false)}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <div>This action cannot be undone. Cancel reservation and make unit available again?</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button
                className="admin-available-unit-btn"
                onClick={async () => {
                  await fetch(`https://tenantportal-backend.onrender.com/api/admin/reservations/${cancelId}`, { method: 'DELETE' });
                  setReservations(reservations => reservations.filter(r => r.reservation_id !== cancelId));
                  setShowSecondConfirm(false);
                  setCancelId(null);
                }}
              >Confirm</button>
              <button className="admin-available-unit-btn back-btn" onClick={() => setShowSecondConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}