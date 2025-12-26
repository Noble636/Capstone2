<div className="admin-reservations-container">
  <h2>Reservations</h2>
  {reservations.map(res => (
    <div className="reservation-card" key={res.reservation_id}>
      <div>
        <b>{res.tenant_name}</b> reserved <b>{res.unit_name}</b>
        <div>Status: {res.status}</div>
      </div>
      <button onClick={() => acceptReservation(res.reservation_id)}>Accept</button>
      <button onClick={() => declineReservation(res.reservation_id)}>Decline</button>
      <button onClick={() => viewHistory(res.reservation_id)}>History</button>
    </div>
  ))}
</div>