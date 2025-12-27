import React, { useEffect, useState, useRef } from 'react';
import '../../css/Admin/AdminInbox.css';

const AdminInbox = () => {
  const [units, setUnits] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const chatEndRef = useRef(null);

  // Fetch posted units
  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/available-units')
      .then(res => res.json())
      .then(data => setUnits(data));
  }, []);

  // Fetch all unique conversations (unit_id + sender_name)
  const fetchConversations = () => {
    fetch('https://tenantportal-backend.onrender.com/api/admin/inbox')
      .then(res => res.json())
      .then(data => {
        const convMap = {};
        data.forEach(msg => {
          const key = `${msg.unit_id}_${msg.sender_name}`;
          if (!convMap[key]) {
            convMap[key] = {
              unit_id: msg.unit_id,
              unit_name: msg.unit_name || msg.unit_title || 'Unit',
              sender_name: msg.sender_name,
              last_message: msg.message,
              last_time: msg.created_at,
            };
          }
        });
        setConversations(Object.values(convMap));
      });
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.unit_id, selectedConv.sender_name);
      setSelectedUnit(units.find(u => u.unit_id === selectedConv.unit_id));
    }
    // eslint-disable-next-line
  }, [selectedConv, units]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async (unitId, senderName) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `https://tenantportal-backend.onrender.com/api/unit-inquiry-messages?unit_id=${unitId}&sender_name=${encodeURIComponent(senderName)}`
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
          unit_id: selectedConv.unit_id,
          sender_name: 'Admin',
          sender_type: 'admin',
          message: chatInput.trim(),
        }),
      });
      if (res.ok) {
        setChatInput('');
        fetchMessages(selectedConv.unit_id, selectedConv.sender_name);
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  // Delete unit
  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) return;
    try {
      const res = await fetch(`https://tenantportal-backend.onrender.com/api/admin/available-units/${unitId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUnits(units.filter(u => u.unit_id !== unitId));
      } else {
        alert('Failed to delete unit.');
      }
    } catch {
      alert('Server error.');
    }
  };

  return (
    <div className="admin-inbox-2col">
      {/* Left: Posted Units and Inbox */}
      <div className="admin-inbox-sidebar">
        <h3>Posted Units</h3>
        {units.map(unit => (
          <div className="admin-inbox-unit" key={unit.unit_id}>
            <div className="admin-inbox-unit-title">{unit.title}</div>
            <button className="admin-inbox-delete-btn" onClick={() => handleDeleteUnit(unit.unit_id)}>
              Delete
            </button>
          </div>
        ))}
        <hr style={{ margin: '18px 0' }} />
        <h3>Inbox</h3>
        <button onClick={fetchConversations} style={{ marginBottom: 10 }}>Refresh</button>
        {conversations.length === 0 && <div className="no-units">No conversations yet.</div>}
        {conversations.map((conv, idx) => (
          <div
            className={`admin-inbox-conv${selectedConv && selectedConv.unit_id === conv.unit_id && selectedConv.sender_name === conv.sender_name ? ' selected' : ''}`}
            key={idx}
            onClick={() => setSelectedConv(conv)}
          >
            <div className="admin-inbox-conv-title">{conv.unit_name}</div>
            <div className="admin-inbox-conv-tenant">{conv.sender_name}</div>
            <div className="admin-inbox-conv-last">{conv.last_message}</div>
          </div>
        ))}
      </div>
      {/* Right: Chat and Unit Details */}
      <div className="admin-inbox-inbox">
        {selectedConv && (
          <div className="admin-inbox-chat-details">
            {/* Unit details */}
            {selectedUnit && (
              <div className="admin-inbox-unit-details" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div className="admin-inbox-unit-images" style={{ display: 'flex', gap: 6 }}>
                  {selectedUnit.images && selectedUnit.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.dataUri}
                      alt={`unit-img-${i}`}
                      style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                    />
                  ))}
                </div>
                <div style={{ marginLeft: 12 }}>
                  <div><b>{selectedUnit.title}</b></div>
                  <div style={{ fontSize: '0.95rem', color: '#555' }}>{selectedUnit.description}</div>
                  <div style={{ fontSize: '0.95rem', color: '#2563eb' }}><b>₱{selectedUnit.price}</b></div>
                </div>
              </div>
            )}
            {/* Chat window */}
            <div className="chat-messages">
              {loadingMessages && <div>Loading...</div>}
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender_type === 'tenant' ? 'tenant' : 'admin'}`}>
                  <div className="chat-message">{msg.message}</div>
                  <div className="chat-meta">
                    <span>{msg.sender_type === 'tenant' ? msg.sender_name : 'Admin'}</span>
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
          </div>
        )}
        {!selectedConv && (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: 40 }}>Select a conversation to view messages.</div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;