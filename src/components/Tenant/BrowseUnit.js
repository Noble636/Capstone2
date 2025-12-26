import React, { useEffect, useState } from 'react';
import '../../css/Tenant/BrowseUnit.css';

const BrowseUnit = ({ tenantId, tenantName }) => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/available-units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  const openInquiryModal = (unit) => {
    setSelectedUnit(unit);
    setShowModal(true);
    setInquiryMessage('');
    setFeedback('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUnit(null);
    setInquiryMessage('');
    setFeedback('');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) {
      setFeedback('Please enter your message.');
      return;
    }
    setSending(true);
    setFeedback('');
    try {
      const res = await fetch('/api/unit-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          unitId: selectedUnit.unit_id,
          message: inquiryMessage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Inquiry sent! You can now chat with the admin.');
        setSelectedInquiryId(data.inquiryId); // Assuming the response contains the inquiry ID
        setShowChatModal(true);
        setTimeout(closeModal, 1500);
      } else {
        setFeedback(data.message || 'Failed to send inquiry.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  const handleReserve = (unit) => {
    // You can open a modal, send a reservation request, or redirect as needed
    alert(`Reservation requested for unit: ${unit.title || unit.unitName}`);
  };

  return (
    <div className="browse-unit-container">
      <h2>Available Units</h2>
      <div className="unit-list">
        {units.length === 0 && <div className="no-units">No available units at the moment.</div>}
        {units.map(unit => (
          <div className="unit-card" key={unit.unit_id}>
            <div className="unit-images">
              {unit.images && unit.images.length > 0 ? (
                <img src={unit.images[0].dataUri} alt="Unit" className="unit-main-image" />
              ) : (
                <div className="unit-placeholder">No Image</div>
              )}
            </div>
            <div className="unit-info">
              <h3>{unit.title}</h3>
              <div className="unit-price">₱{unit.price}</div>
              <div className="unit-desc">{unit.description}</div>
              <button className="inquire-btn" onClick={() => openInquiryModal(unit)}>
                Inquire
              </button>
              <button className="reserve-btn" onClick={() => handleReserve(unit)}>
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && selectedUnit && (
        <div className="inquiry-modal-backdrop" onClick={closeModal}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <h3>Inquire about: {selectedUnit.title}</h3>
            <form onSubmit={handleInquirySubmit}>
              <textarea
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                placeholder="Type your message or reservation request..."
                rows={4}
                required
              />
              <button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send Inquiry'}
              </button>
              {feedback && <div className="inquiry-feedback">{feedback}</div>}
            </form>
            <button className="close-modal-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseUnit;