import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AdminReservations.css';

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
    <div className="admin-reservation-bg">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="admin-reservation-bg-image" />
      <div className="admin-reservation-center-wrapper">
        <div className="admin-reservation-container">
          <div className="admin-reservation-header-row">
            <h1 className="admin-reservation-title">Reservations</h1>
            <Link to="/admin-dashboard" className="admin-reservation-back-btn">
              &#8592; Back
            </Link>
          </div>
          <div className="admin-reservation-list">
            {Array.isArray(reservations) && reservations.length === 0 && (
              <div className="admin-reservation-no-units">No reservations yet.</div>
            )}
            {Array.isArray(reservations) && reservations.map(r => (
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
    </div>
  );
}