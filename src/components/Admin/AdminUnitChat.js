import React, { useEffect, useState, useRef } from 'react';
import '../../css/Admin/AdminUnitChat.css';

const formatTimeLeft = (ms) => {
  if (ms <= 0) return 'Expired';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const AdminUnitChat = ({ adminId }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState('');
  const intervalRef = useRef();

  // Fetch all active inquiries for this admin
  useEffect(() => {
    fetch(`/api/unit-inquiries?adminId=${adminId}`)
      .then(res => res.json())
      .then(data => setInquiries(data))
      .catch(() => setInquiries([]));
  }, [adminId]);

  // Fetch messages for selected inquiry
  useEffect(() => {
    if (!selected) return;
    fetch(`/api/unit-inquiry-messages?inquiryId=${selected.inquiry_id}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]));

    // Set up timer for chat expiration
    const expiresAt = new Date(selected.expires_at).getTime();
    const updateTimer = () => setTimer(expiresAt - Date.now());
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, [selected]);

  // Poll for new messages every 10s
  useEffect(() => {
    if (!selected) return;
    const poll = setInterval(() => {
      fetch(`/api/unit-inquiry-messages?inquiryId=${selected.inquiry_id}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }, 10000);
    return () => clearInterval(poll);
  }, [selected]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    setFeedback('');
    try {
      const res = await fetch('/api/unit-inquiry-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: selected.inquiry_id,
          senderType: 'admin',
          message: newMsg
        })
      });
      if (res.ok) {
        setNewMsg('');
        // Refresh messages
        fetch(`/api/unit-inquiry-messages?inquiryId=${selected.inquiry_id}`)
          .then(res => res.json())
          .then(data => setMessages(data));
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Server error.');
    }
    setSending(false);
  };

  return (
    <div className="admin-unit-chat-container">
      <h2>Unit Inquiries & Chat</h2>
      <div className="admin-unit-chat-main">
        <div className="admin-unit-chat-list">
          {inquiries.length === 0 && <div className="no-inquiries">No active inquiries.</div>}
          {inquiries.map(inq => (
            <div
              key={inq.inquiry_id}
              className={`chat-list-item${selected && selected.inquiry_id === inq.inquiry_id ? ' selected' : ''}`}
              onClick={() => setSelected(inq)}
            >
              <div className="chat-list-title">{inq.unit_title}</div>
              <div className="chat-list-tenant">{inq.tenant_name}</div>
              <div className="chat-list-expiry">
                {new Date(inq.expires_at).getTime() > Date.now()
                  ? 'Active'
                  : 'Expired'}
              </div>
            </div>
          ))}
        </div>
        <div className="admin-unit-chat-window">
          {!selected && <div className="chat-placeholder">Select an inquiry to chat.</div>}
          {selected && (
            <>
              <div className="chat-header">
                <div>
                  <b>{selected.unit_title}</b>
                  <span className="chat-expiry">
                    {timer > 0 ? `Expires in: ${formatTimeLeft(timer)}` : 'Chat expired'}
                  </span>
                </div>
                <div className="chat-tenant">Tenant: {selected.tenant_name}</div>
              </div>
              <div className="chat-messages">
                {messages.map(msg => (
                  <div
                    key={msg.message_id}
                    className={`chat-message ${msg.sender_type === 'admin' ? 'admin' : 'tenant'}`}
                  >
                    <div className="msg-meta">
                      {msg.sender_type === 'admin' ? 'You' : 'Tenant'}
                      <span className="msg-time">
                        {new Date(msg.sent_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="msg-body">{msg.message}</div>
                  </div>
                ))}
              </div>
              {timer > 0 && (
                <form className="chat-input-row" onSubmit={handleSend}>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !newMsg.trim()}>
                    Send
                  </button>
                </form>
              )}
              {feedback && <div className="chat-feedback">{feedback}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUnitChat;