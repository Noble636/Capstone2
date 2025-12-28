import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AvailableUnit.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);

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
          <div className="admin-available-unit-content">
            {reservations.length === 0 && <div>No reservations yet.</div>}
            {reservations.map(r => (
              <div key={r.reservation_id} style={{ border: '1.5px solid #222', borderRadius: 10, margin: 12, padding: 16, background: '#f8fafc' }}>
                {r.image && <img src={r.image} alt="Unit" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <div><strong>Unit:</strong> {r.title}</div>
                <div><strong>Price:</strong> ₱{r.price}</div>
                <div><strong>Name:</strong> {r.name}</div>
                <div><strong>Contact:</strong> {r.contact}</div>
                {r.other_info && <div><strong>Other:</strong> {r.other_info}</div>}
                <div><strong>Date:</strong> {new Date(r.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}