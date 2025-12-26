import React, { useEffect, useState } from 'react';
import '../../css/Tenant/BrowseUnit.css';

const BrowseUnit = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState({});
  const [enlargeImg, setEnlargeImg] = useState(null);
  const [tenantNameState, setTenantName] = useState(localStorage.getItem('tenantName') || '');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [showInquiryHistory, setShowInquiryHistory] = useState(false);
  const [inquiryHistory, setInquiryHistory] = useState([]);
  const [historyUnit, setHistoryUnit] = useState(null);
  const [historyName, setHistoryName] = useState('');
  const [historyNameInput, setHistoryNameInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

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
    if (!tenantNameState.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    if (!inquiryMessage.trim()) {
      setFeedback('Please enter your message.');
      return;
    }
    setSending(true);
    setFeedback('');
    try {
      // Save name to localStorage for future use
      localStorage.setItem('tenantName', tenantNameState);

      // Send inquiry to backend
      const res = await fetch('http://localhost:5000/api/unit-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.unit_id,
          sender_name: tenantNameState,
          message: inquiryMessage,
        }),
      });
      if (res.ok) {
        setFeedback('Inquiry sent! You can now chat with the admin.');
        setTimeout(closeModal, 1500);
      } else {
        const data = await res.json();
        setFeedback(data.message || 'Failed to send inquiry.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  const handleReserve = (unit) => {
    alert(`Reservation requested for unit: ${unit.title || unit.unitName}`);
  };

  const handleCheckInquiry = (unit) => {
    setHistoryUnit(unit);
    setShowInquiryHistory(true);
    setInquiryHistory([]);
    setHistoryError('');
    setHistoryNameInput(tenantNameState || '');
    setHistoryName(tenantNameState || '');
  };

  const fetchInquiryHistory = async (unitId, name) => {
    setLoadingHistory(true);
    setHistoryError('');
    try {
      const res = await fetch(`http://localhost:5000/api/unit-inquiries/history?unit_id=${unitId}&sender_name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        setInquiryHistory(data);
        setHistoryName(name);
        localStorage.setItem('tenantName', name);
      } else {
        setHistoryError('No conversation found.');
        setInquiryHistory([]);
      }
    } catch {
      setHistoryError('Server error.');
      setInquiryHistory([]);
    }
    setLoadingHistory(false);
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
                <button
                  className="check-inquiries-btn"
                  onClick={() => handleCheckInquiry(unit)}
                >
                  Check my inquiry
                </button>
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
      {showInquiryHistory && historyUnit && (
        <div className="inquiry-modal-backdrop" onClick={() => setShowInquiryHistory(false)}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <h3>Conversation for: {historyUnit.title}</h3>
            {!historyName ? (
              <form onSubmit={e => {
                e.preventDefault();
                if (historyNameInput.trim()) {
                  fetchInquiryHistory(historyUnit.unit_id, historyNameInput.trim());
                }
              }}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={historyNameInput}
                  onChange={e => setHistoryNameInput(e.target.value)}
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
                <button type="submit" disabled={loadingHistory}>Check</button>
              </form>
            ) : (
              <>
                {loadingHistory && <div>Loading...</div>}
                {historyError && <div className="inquiry-feedback">{historyError}</div>}
                <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
                  {inquiryHistory.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <b>{msg.sender_name === historyName ? 'You' : 'Admin'}:</b> {msg.message}
                      {msg.reply && (
                        <div style={{ marginLeft: 16, color: '#2563eb' }}>
                          <b>Admin:</b> {msg.reply}
                        </div>
                      )}
                    </div>
                  ))}
                  {inquiryHistory.length === 0 && !loadingHistory && !historyError && (
                    <div>No conversation found.</div>
                  )}
                </div>
                <button onClick={() => setShowInquiryHistory(false)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseUnit;