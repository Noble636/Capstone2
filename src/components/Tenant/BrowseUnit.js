import React, { useEffect, useState } from 'react';
import '../../css/Tenant/BrowseUnit.css';

const BrowseUnit = ({ tenantId, tenantName }) => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState({});
  const [enlargeImg, setEnlargeImg] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [tenantNameState, setTenantName] = useState(localStorage.getItem('tenantName') || '');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState(null);

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

  const handleInquireClick = (unitId) => {
    setSelectedUnitId(unitId);
    setShowInquiryModal(true);
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!tenantNameState.trim()) {
      alert('Please enter your name.');
      return;
    }
    // Save name to localStorage for future use
    localStorage.setItem('tenantName', tenantNameState);

    // Send inquiry to backend
    await fetch('http://localhost:5000/api/unit-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unit_id: selectedUnitId,
        sender_name: tenantNameState,
        message: inquiryMessage,
      }),
    });
    setShowInquiryModal(false);
    setInquiryMessage('');
  };

  return (
    <div className="browse-unit-container">
      <h2>Available Units</h2>
      <div className="unit-list">
        {units.length === 0 && <div className="no-units">No available units at the moment.</div>}
        {units.map(unit => {
          const mainIdx = selectedImageIdx[unit.unit_id] || 0;
          return (
            <div className="unit-card" key={unit.unit_id}>
              <div className="unit-images">
                {unit.images && unit.images.length > 0 ? (
                  <img
                    src={unit.images[mainIdx].dataUri}
                    alt="Unit"
                    className="unit-main-image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEnlargeImg(unit.images[mainIdx].dataUri)}
                  />
                ) : (
                  <div className="unit-placeholder">No Image</div>
                )}
              </div>
              {unit.images && unit.images.length > 1 && (
                <div className="unit-thumbnails">
                  {unit.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.dataUri}
                      alt={`thumb-${idx}`}
                      className={`unit-thumb${mainIdx === idx ? ' selected' : ''}`}
                      onClick={() =>
                        setSelectedImageIdx(prev => ({ ...prev, [unit.unit_id]: idx }))
                      }
                    />
                  ))}
                </div>
              )}
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
                <button onClick={() => handleInquireClick(unit.unit_id)}>Inquire</button>
              </div>
            </div>
          );
        })}
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
      {enlargeImg && (
        <div className="enlarge-modal-backdrop" onClick={() => setEnlargeImg(null)}>
          <div className="enlarge-modal" onClick={e => e.stopPropagation()}>
            <img src={enlargeImg} alt="Enlarged" className="enlarge-img" />
            <button className="close-modal-btn" onClick={() => setEnlargeImg(null)}>Close</button>
          </div>
        </div>
      )}
      {showInquiryModal && (
        <div className="inquiry-modal-backdrop">
          <div className="inquiry-modal">
            <button className="close-modal-btn" onClick={() => setShowInquiryModal(false)}>×</button>
            <h3>Send Inquiry</h3>
            <form onSubmit={handleSendInquiry}>
              {!tenantNameState && (
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={tenantNameState}
                  onChange={e => setTenantName(e.target.value)}
                  className="inquiry-name-input"
                  required
                  style={{
                    width: '100%',
                    borderRadius: '6px',
                    border: '1.5px solid #d1d5db',
                    padding: '9px 12px',
                    fontSize: '1rem',
                    marginBottom: '12px',
                    background: '#f9fafb'
                  }}
                />
              )}
              <textarea
                placeholder="Type your inquiry..."
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit">Send</button>
                <button type="button" className="close-modal-btn" onClick={() => setShowInquiryModal(false)} style={{marginLeft: '8px'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseUnit;