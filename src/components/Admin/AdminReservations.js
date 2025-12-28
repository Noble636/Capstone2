import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AvailableUnit.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/admin/reservations')
      .then(res => res.json())
      .then(data => setReservations(data));
  }, []);

  return (
    <div className="availableunit-bg">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="availableunit-bg-image" />
      <div className="main-center-wrapper">
        <div className="admin-available-unit-container">
          <h1 className="admin-available-unit-title">Reservations</h1>
          <Link to="/admin-dashboard" className="admin-available-unit-btn back-btn">
            <span>&#x2B05;</span> Back
          </Link>
          <Link to="/tenant/browse-units" className="admin-available-unit-btn back-btn" style={{ marginBottom: 18 }}>
            Cancel Reservation
          </Link>
          <div className="admin-available-unit-content">
            {Array.isArray(reservations) && reservations.length === 0 && <div>No reservations yet.</div>}
            {Array.isArray(reservations) && reservations.map(r => (
              <div key={r.reservation_id} style={{ border: '1.5px solid #222', borderRadius: 10, margin: 12, padding: 16, background: '#f8fafc', position: 'relative' }}>
                {r.image && <img src={r.image} alt="Unit" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <div><strong>Unit:</strong> {r.title}</div>
                <div><strong>Price:</strong> ₱{r.price}</div>
                <div><strong>Name:</strong> {r.name}</div>
                <div><strong>Contact:</strong> {r.contact}</div>
                {r.other_info && <div><strong>Other:</strong> {r.other_info}</div>}
                <div><strong>Date:</strong> {new Date(r.created_at).toLocaleString()}</div>
                <button
                  className="admin-available-unit-btn back-btn"
                  style={{ marginTop: 10, background: '#c0392b' }}
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