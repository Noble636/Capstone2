import React, { useEffect, useState, useRef } from 'react';
import '../../css/Tenant/BrowseUnit.css';

export default function BrowseUnit() {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showCheckInquiry, setShowCheckInquiry] = useState(false);
  const [tenantNameState, setTenantName] = useState(localStorage.getItem('tenantName') || '');
  const [nameInput, setNameInput] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(!!tenantNameState);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState({});
  const [messageSent, setMessageSent] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveData, setReserveData] = useState({ name: '', contact: '', other: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/available-units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat, showCheckInquiry]);

  useEffect(() => {
    let interval;
    if ((showChat || showCheckInquiry) && selectedUnit && nameConfirmed) {
      fetchMessages(selectedUnit.unit_id, tenantNameState);
      interval = setInterval(() => {
        fetchMessages(selectedUnit.unit_id, tenantNameState);
      }, 3000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [showChat, showCheckInquiry, selectedUnit, nameConfirmed]);

  const openChatModal = (unit) => {
    setSelectedUnit(unit);
    setShowChat(true);
    setShowCheckInquiry(false);
    setFeedback('');
    setChatInput('');
    setNameConfirmed(false);
    setNameInput('');
    setMessageSent(false);
  };

  const openCheckInquiryModal = (unit) => {
    setSelectedUnit(unit);
    setShowCheckInquiry(true);
    setShowChat(false);
    setFeedback('');
    setChatInput('');
    setNameInput('');
    setNameConfirmed(false);
    setMessages([]);
  };

  const closeModal = () => {
    setShowChat(false);
    setShowCheckInquiry(false);
    setSelectedUnit(null);
    setMessages([]);
    setChatInput('');
    setFeedback('');
    setNameInput('');
    setNameConfirmed(!!tenantNameState);
  };

  const handleInquireNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    setTenantName(nameInput.trim());
    localStorage.setItem('tenantName', nameInput.trim());
    setNameConfirmed(true);
    setFeedback('');
  };

  const handleSendInquireMessage = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !chatInput.trim()) {
      setFeedback('Please enter your name and message.');
      return;
    }
    setSending(true);
    setFeedback('');
    try {
      localStorage.setItem('tenantName', nameInput.trim());
      setTenantName(nameInput.trim());
      setNameConfirmed(true);

      const res = await fetch('https://tenantportal-backend.onrender.com/api/unit-inquiry-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.unit_id,
          sender_name: nameInput.trim(),
          sender_type: 'tenant',
          message: chatInput.trim(),
        }),
      });

      if (res.ok) {
        setFeedback('Inquiry sent!');
        setChatInput('');
        setMessageSent(true);
      } else {
        setFeedback('Failed to send inquiry.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  const handleCheckInquiryNameSubmit = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    setFeedback('');
    if (selectedUnit) {
      setMessages([]); // Clear previous messages immediately
      setLoadingMessages(true); // Show loading state
      const res = await fetch(
        `https://tenantportal-backend.onrender.com/api/unit-inquiry-messages?unit_id=${selectedUnit.unit_id}&sender_name=${encodeURIComponent(nameInput.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        if (data.length === 0) {
          setShowNotFoundModal(true);
          setTimeout(() => setShowNotFoundModal(false), 2000);
        } else {
          setNameConfirmed(true);
          setTenantName(nameInput.trim());
        }
      } else {
        setMessages([]);
        setShowNotFoundModal(true);
        setTimeout(() => setShowNotFoundModal(false), 2000);
      }
      setLoadingMessages(false);
    }
    setTenantName(nameInput.trim());
  };

  const fetchMessages = async (unitId, name) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `https://tenantportal-backend.onrender.com/api/unit-inquiry-messages?unit_id=${unitId}&sender_name=${encodeURIComponent(name)}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setSending(true);
    setFeedback('');
    try {
      const res = await fetch('https://tenantportal-backend.onrender.com/api/unit-inquiry-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.unit_id,
          sender_name: tenantNameState || nameInput.trim(),
          sender_type: 'tenant',
          message: chatInput.trim(),
        }),
      });
      if (res.ok) {
        setChatInput('');
        setMessageSent(true);
        fetchMessages(selectedUnit.unit_id, tenantNameState || nameInput.trim());
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  const handleReserve = (unit) => {
    setSelectedUnit(unit);
    setReserveData({ name: '', contact: '', other: '' });
    setShowReserveModal(true);
  };

  return (
    <div className="browseunit-bg">
      <img
        src={process.env.PUBLIC_URL + '/Background/GB.png'}
        alt="Background"
        className="browseunit-bg-image"
      />
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>
      {/* --- MAIN CONTENT BELOW --- */}
      <div className="browse-unit-container">
        <div className="browseunit-header-row">
          <h2>Available Units</h2>
          <button
            className="browseunit-back-btn"
            onClick={() => window.history.back()}
            type="button"
          >
            &#8592; Back
          </button>
        </div>
        <div className="browseunit-hint" style={{ textAlign: 'center', color: '#222', fontSize: '1rem', marginBottom: 16, border: '1.5px solid #222', borderRadius: 8, padding: 8, background: '#f8fafc' }}>
          You can check admin replies to your message inquiry via the "Check my inquiry" button below each unit.
        </div>
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
                      onClick={() => setExpandedImage(unit.images[mainIdx].dataUri)}
                    />
                  ) : (
                    <div className="unit-placeholder">No Image</div>
                  )}
                </div>
                {unit.images && unit.images.length > 1 && (
                  <div className="unit-thumbnails">
                    {unit.images.slice(0, 5).map((img, idx) => (
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
                  <button className="inquire-btn" onClick={() => openChatModal(unit)}>
                    Inquire
                  </button>
                  <button className="reserve-btn" onClick={() => handleReserve(unit)}>
                    Reserve
                  </button>
                  <button
                    className="check-inquiries-btn"
                    onClick={() => openCheckInquiryModal(unit)}
                  >
                    Check my inquiry
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Inquire Modal */}
        {showChat && selectedUnit && (
          <div className="inquiry-modal-backdrop" onClick={closeModal}>
            <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
              <h3>Send Inquiry: {selectedUnit.title}</h3>
              {!nameConfirmed ? (
                <form onSubmit={handleInquireNameSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="inquiry-name-input"
                    required
                  />
                  <button type="submit">Continue</button>
                  {feedback && <div className="inquiry-feedback">{feedback}</div>}
                </form>
              ) : !messageSent ? (
                <form onSubmit={handleSendInquireMessage}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: '100%', marginBottom: 12 }}
                    required
                  />
                  <button type="submit" disabled={sending || !chatInput.trim()}>Send</button>
                  {feedback && <div className="inquiry-feedback">{feedback}</div>}
                </form>
              ) : (
                <div>
                  <div className="inquiry-feedback">Message sent! You can check replies via "Check my inquiry".</div>
                  <button className="close-modal-btn" onClick={closeModal}>Close</button>
                </div>
              )}
              {!messageSent && (
                <button className="close-modal-btn" onClick={closeModal}>Close</button>
              )}
            </div>
          </div>
        )}
        {/* Check My Inquiry Modal */}
        {showCheckInquiry && selectedUnit && (
          <div className="inquiry-modal-backdrop" onClick={closeModal}>
            <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={closeModal} style={{ position: 'absolute', top: 10, right: 14 }}>Close</button>
              <h3>Check My Inquiry: {selectedUnit.title}</h3>
              {!nameConfirmed ? (
                <form onSubmit={handleCheckInquiryNameSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="inquiry-name-input"
                    required
                  />
                  <button type="submit">Load Chat</button>
                  {feedback && <div className="inquiry-feedback">{feedback}</div>}
                </form>
              ) : (
                <>
                  <div className="chat-messages">
                    {loadingMessages && messages.length === 0 && <div>Loading...</div>}
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chat-bubble ${msg.sender_type === 'tenant' ? 'tenant' : 'admin'}`}
                      >
                        <div className="chat-message">{msg.message}</div>
                        <div className="chat-meta">
                          <span>{msg.sender_type === 'tenant' ? 'You' : 'Admin'}</span>
                          <span className="chat-time">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                    {messages.length === 0 && !loadingMessages && (
                      <div style={{ color: '#64748b', textAlign: 'center' }}>No messages yet.</div>
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      style={{ flex: 1 }}
                      required
                    />
                    <button type="submit" disabled={sending || !chatInput.trim()}>Send</button>
                  </form>
                  {feedback && <div className="inquiry-feedback">{feedback}</div>}
                  <button className="close-modal-btn" onClick={closeModal}>Close</button>
                </>
              )}
            </div>
          </div>
        )}
        {showNotFoundModal && (
          <div className="centered-modal-backdrop">
            <div className="centered-modal">
              <div>Message Inquiry Does not exist</div>
              <button onClick={() => setShowNotFoundModal(false)} className="close-modal-btn">Close</button>
            </div>
          </div>
        )}
        {expandedImage && (
          <div
            className="image-lightbox-backdrop"
            onClick={() => setExpandedImage(null)}
          >
            <img
              src={expandedImage}
              alt="Expanded Unit"
              className="image-lightbox"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="close-lightbox-btn"
              onClick={() => setExpandedImage(null)}
            >
              ×
            </button>
          </div>
        )}
        {/* Reservation Modal */}
        {showReserveModal && selectedUnit && (
          <div className="inquiry-modal-backdrop" onClick={() => setShowReserveModal(false)}>
            <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setShowReserveModal(false)} style={{ position: 'absolute', top: 10, right: 14 }}>Close</button>
              <h3>Reserve: {selectedUnit.title}</h3>
              <form onSubmit={e => { e.preventDefault(); setShowConfirmModal(true); }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reserveData.name}
                  onChange={e => setReserveData({ ...reserveData, name: e.target.value })}
                  required
                  className="inquiry-name-input"
                />
                <input
                  type="text"
                  placeholder="Contact (Phone or Email)"
                  value={reserveData.contact}
                  onChange={e => setReserveData({ ...reserveData, contact: e.target.value })}
                  required
                  className="inquiry-name-input"
                />
                <textarea
                  placeholder="Other info (optional)"
                  value={reserveData.other}
                  onChange={e => setReserveData({ ...reserveData, other: e.target.value })}
                  className="inquiry-name-input"
                  style={{ minHeight: 60 }}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button type="submit" className="inquire-btn">Proceed with Reservation</button>
                  <button type="button" className="reserve-btn" onClick={() => setShowReserveModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reservation Confirmation Modal */}
        {showConfirmModal && (
          <div className="inquiry-modal-backdrop" onClick={() => setShowConfirmModal(false)}>
            <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
              <h3>Confirm Reservation</h3>
              <div>
                <strong>Unit:</strong> {selectedUnit.title}<br />
                <strong>Price:</strong> ₱{selectedUnit.price}<br />
                <strong>Name:</strong> {reserveData.name}<br />
                <strong>Contact:</strong> {reserveData.contact}<br />
                {reserveData.other && (<><strong>Other:</strong> {reserveData.other}<br /></>)}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button
                  className="inquire-btn"
                  onClick={async () => {
                    await fetch('https://tenantportal-backend.onrender.com/api/unit-reservations', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        unit_id: selectedUnit.unit_id,
                        name: reserveData.name,
                        contact: reserveData.contact,
                        other_info: reserveData.other
                      })
                    });
                    setShowConfirmModal(false);
                    setShowReserveModal(false);
                    setUnits(units => units.filter(u => u.unit_id !== selectedUnit.unit_id));
                  }}
                >Confirm</button>
                <button className="reserve-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* --- END MAIN CONTENT --- */}
    </div>
  );
}