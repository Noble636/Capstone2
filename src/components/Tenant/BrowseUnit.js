import React, { useEffect, useState, useRef } from 'react';
import '../../css/Tenant/BrowseUnit.css';

const BrowseUnit = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [tenantNameState, setTenantName] = useState(localStorage.getItem('tenantName') || '');
  const [nameInput, setNameInput] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(!!tenantNameState);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [feedback, setFeedback] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/available-units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // Polling for new messages every 3 seconds when chat is open
  useEffect(() => {
    let interval;
    if (showChat && selectedUnit && nameConfirmed) {
      fetchMessages(selectedUnit.unit_id, tenantNameState);
      interval = setInterval(() => {
        fetchMessages(selectedUnit.unit_id, tenantNameState);
      }, 3000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [showChat, selectedUnit, nameConfirmed]);

  const openChatModal = (unit) => {
    setSelectedUnit(unit);
    setShowChat(true);
    setFeedback('');
    setChatInput('');
    if (tenantNameState) {
      setNameConfirmed(true);
      fetchMessages(unit.unit_id, tenantNameState);
    } else {
      setNameConfirmed(false);
      setNameInput('');
      setMessages([]);
    }
  };

  const closeChatModal = () => {
    setShowChat(false);
    setSelectedUnit(null);
    setMessages([]);
    setChatInput('');
    setFeedback('');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    setTenantName(nameInput.trim());
    localStorage.setItem('tenantName', nameInput.trim());
    setNameConfirmed(true);
    setFeedback('');
    if (selectedUnit) {
      fetchMessages(selectedUnit.unit_id, nameInput.trim());
    }
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
          sender_name: tenantNameState,
          sender_type: 'tenant',
          message: chatInput.trim(),
        }),
      });
      if (res.ok) {
        setChatInput('');
        fetchMessages(selectedUnit.unit_id, tenantNameState);
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
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
                <img
                  src={unit.images[0].dataUri}
                  alt="Unit"
                  className="unit-main-image"
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <div className="unit-placeholder">No Image</div>
              )}
            </div>
            <div className="unit-info">
              <h3>{unit.title}</h3>
              <div className="unit-price">₱{unit.price}</div>
              <div className="unit-desc">{unit.description}</div>
              <button className="inquire-btn" onClick={() => openChatModal(unit)}>
                Chat / Inquire
              </button>
            </div>
          </div>
        ))}
      </div>
      {showChat && selectedUnit && (
        <div className="inquiry-modal-backdrop" onClick={closeChatModal}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <h3>Chat about: {selectedUnit.title}</h3>
            {!nameConfirmed ? (
              <form onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
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
                <button type="submit">Start Chat</button>
                {feedback && <div className="inquiry-feedback">{feedback}</div>}
              </form>
            ) : (
              <>
                <div className="chat-messages" style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 10, background: '#f3f4f6', borderRadius: 8, padding: 8 }}>
                  {loadingMessages && <div>Loading...</div>}
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
                <button className="close-modal-btn" onClick={closeChatModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseUnit;