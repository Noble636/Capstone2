import React, { useEffect, useState, useRef } from 'react';
import '../../css/Admin/AdminInbox.css';

// --- Modal Component ---
function ConfirmModal({ open, step, onCancel, onNext, onConfirm, message1, message2 }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-center">
        <div className="modal-content">
          <div className="modal-message">
            {step === 1 ? message1 : message2}
          </div>
          <div className="modal-actions">
            {step === 1 ? (
              <>
                <button className="modal-btn" onClick={onCancel}>Cancel</button>
                <button className="modal-btn modal-btn-primary" onClick={onNext}>OK</button>
              </>
            ) : (
              <>
                <button className="modal-btn" onClick={onCancel}>Cancel</button>
                <button className="modal-btn modal-btn-danger" onClick={onConfirm}>Confirm</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [showChatModal, setShowChatModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [modalAction, setModalAction] = useState(null); // { type: 'unit'|'conv', data: ... }
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
        // 1. Find all unique (unit_id, tenant_name) pairs where sender_type === 'tenant'
        const tenantPairs = new Set();
        data.forEach(msg => {
          if (msg.sender_type && msg.sender_type.trim().toLowerCase() === 'tenant') {
            tenantPairs.add(`${msg.unit_id}|||${msg.sender_name}`);
          }
        });

        // 2. For each pair, find the latest message (from either sender)
        const convList = [];
        tenantPairs.forEach(pair => {
          const [unit_id, tenant_name] = pair.split('|||');
          const convMsgs = data.filter(
            m =>
              m.unit_id == unit_id &&
              (
                (m.sender_name === tenant_name && m.sender_type.trim().toLowerCase() === 'tenant') ||
                (m.sender_type && m.sender_type.trim().toLowerCase() === 'admin' && m.recipient_name === tenant_name)
              )
          );
          if (convMsgs.length > 0) {
            const latest = convMsgs.reduce((a, b) =>
              new Date(a.created_at) > new Date(b.created_at) ? a : b
            );
            convList.push({
              ...latest,
              sender_name: tenant_name,
              last_message: latest.message,
              unit_id,
            });
          }
        });

        convList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setConversations(convList);
      });
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (showChatModal && selectedConv) {
      fetchMessages(selectedConv.unit_id, selectedConv.sender_name);
      setSelectedUnit(units.find(u => u.unit_id === selectedConv.unit_id));
    }
    // eslint-disable-next-line
  }, [showChatModal, selectedConv, units]);

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
          recipient_name: selectedConv.sender_name,
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

  // --- Modal Handlers ---
  const openDeleteModal = (type, data) => {
    setModalAction({ type, data });
    setModalStep(1);
    setModalOpen(true);
  };
  const handleModalCancel = () => setModalOpen(false);
  const handleModalNext = () => setModalStep(2);
  const handleModalConfirm = async () => {
    setModalOpen(false);
    if (modalAction?.type === 'unit') {
      await handleDeleteUnit(modalAction.data.unit_id);
    } else if (modalAction?.type === 'conv') {
      await handleDeleteConversation(modalAction.data.unit_id, modalAction.data.sender_name);
    }
  };

  // --- Delete Conversation (right side) ---
  const handleDeleteConversation = async (unit_id, sender_name) => {
    try {
      const res = await fetch('https://tenantportal-backend.onrender.com/api/admin/conversation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit_id, tenant_name: sender_name }),
      });
      if (res.ok) {
        fetchConversations();
        if (selectedConv && selectedConv.unit_id === unit_id && selectedConv.sender_name === sender_name) {
          closeChatModal();
        }
      } else {
        alert('Failed to delete conversation.');
      }
    } catch {
      alert('Server error.');
    }
  };

  const openChatModal = (conv) => {
    setSelectedConv(conv);
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedConv(null);
    setMessages([]);
    setChatInput('');
    setFeedback('');
  };

  return (
    <>
      <div className="admininbox-bg">
        <img
          src={process.env.PUBLIC_URL + '/Background/GB.png'}
          alt="Background"
          className="admininbox-bg-image"
        />
        <div className="admininbox-bubble b1"></div>
        <div className="admininbox-bubble b2"></div>
        <div className="admininbox-bubble b3"></div>
        <div className="admininbox-bubble b4"></div>
        <div className="admininbox-bubble b5"></div>
        <div className="admininbox-bubble b6"></div>
        <div className="admininbox-bubble b7"></div>
        <div className="admininbox-bubble b8"></div>
      </div>
      <div className="admin-inbox-2col" style={{ flexDirection: 'row', position: 'relative', zIndex: 10 }}>
        {/* Left: Posted Units */}
        <div className="admin-inbox-sidebar" style={{ minWidth: 260, maxWidth: 320 }}>
          <h3>Posted Units</h3>
          {units.length === 0 && <div className="no-units">No posted units.</div>}
          {units.map(unit => (
            <div className="admin-inbox-unit-card" key={unit.unit_id}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {unit.images && unit.images[0] && (
                  <img
                    src={unit.images[0].dataUri}
                    alt="unit"
                    style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 6, marginRight: 10, border: '1px solid #eee' }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>{unit.title}</div>
                  <div style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.98rem' }}>₱{unit.price}</div>
                </div>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.97rem', marginBottom: 8, minHeight: 32 }}>
                {unit.description}
              </div>
              <button
                className="admin-inbox-delete-btn"
                onClick={() => openDeleteModal('unit', { unit_id: unit.unit_id })}
                style={{ marginTop: 4 }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {/* Right: Inbox */}
        <div className="admin-inbox-inbox" style={{ minWidth: 340, flex: 1 }}>
          <h3>Inbox</h3>
          <button onClick={fetchConversations} style={{ marginBottom: 10 }}>Refresh</button>
          {conversations.length === 0 && <div className="no-units">No conversations yet.</div>}
          {conversations.map((conv, idx) => (
            <div
              className={`admin-inbox-conv${selectedConv && selectedConv.unit_id === conv.unit_id && selectedConv.sender_name === conv.sender_name ? ' selected' : ''}`}
              key={idx}
              onClick={() => openChatModal(conv)}
              style={{ position: 'relative' }}
            >
              <div className="admin-inbox-conv-title">{conv.unit_name}</div>
              <div className="admin-inbox-conv-tenant">{conv.sender_name}</div>
              <div className="admin-inbox-conv-last">{conv.last_message}</div>
              <button
                className="admin-inbox-delete-btn"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  padding: '2px 8px',
                  fontSize: '0.9rem',
                  zIndex: 2,
                }}
                onClick={e => {
                  e.stopPropagation();
                  openDeleteModal('conv', { unit_id: conv.unit_id, sender_name: conv.sender_name });
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {/* Popup Chat Modal */}
        {showChatModal && selectedConv && (
          <div className="inquiry-modal-backdrop" onClick={closeChatModal}>
            <div className="inquiry-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
              <h3>Chat: {selectedUnit ? selectedUnit.title : selectedConv.unit_name}</h3>
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
              <button className="close-modal-btn" onClick={closeChatModal} style={{ marginTop: 10 }}>Close</button>
            </div>
          </div>
        )}
      </div>
      {/* --- Centered Modal --- */}
      <ConfirmModal
        open={modalOpen}
        step={modalStep}
        onCancel={handleModalCancel}
        onNext={handleModalNext}
        onConfirm={handleModalConfirm}
        message1="This will delete the posted unit or conversation. Are you sure?"
        message2="Warning: This will permanently delete the posted unit or conversation. This action cannot be undone. Proceed?"
      />
    </>
  );
};

export default AdminInbox;