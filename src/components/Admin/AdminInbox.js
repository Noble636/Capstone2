import ChatModal from '../ChatModal';

<div className="admin-inbox-container">
  <h2>Unit Inquiries</h2>
  {units.map(unit => (
    <div className="admin-inbox-unit-card" key={unit.unit_id}>
      <div>{unit.name} - ₱{unit.price}</div>
      <button onClick={() => openInquiriesModal(unit)}>See Inquiries</button>
      <button onClick={() => deleteUnit(unit.unit_id)}>Delete Post</button>
      <button onClick={() => openReservations(unit.unit_id)}>Reservations</button>
    </div>
  ))}
  {/* Modal for inquiries, chat, etc. */}
  {showChatModal && (
    <ChatModal
      inquiryId={selectedInquiryId}
      onClose={() => setShowChatModal(false)}
      userType="admin"
      userName={adminName}
    />
  )}
</div>