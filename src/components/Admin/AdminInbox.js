import React, { useEffect, useState } from 'react';

const AdminInbox = () => {
  const [inquiries, setInquiries] = useState([]);
  const [reply, setReply] = useState({});

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/admin/inbox')
      .then(res => res.json())
      .then(data => setInquiries(data));
  }, []);

  const handleReply = async (inquiryId) => {
    await fetch('https://tenantportal-backend.onrender.com/api/admin/inbox/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiryId, reply: reply[inquiryId] })
    });
    setInquiries(inquiries.map(i => i.inquiry_id === inquiryId ? { ...i, reply: reply[inquiryId] } : i));
    setReply({ ...reply, [inquiryId]: '' });
  };

  return (
    <div className="admin-inbox-container">
      <h2>Admin Inbox</h2>
      {inquiries.map(inq => (
        <div key={inq.inquiry_id} className="inquiry-item">
          <div><b>Unit:</b> {inq.unit_name}</div>
          <div><b>From:</b> {inq.sender_name}</div>
          <div><b>Message:</b> {inq.message}</div>
          <div><b>Reply:</b> {inq.reply || 'No reply yet'}</div>
          <textarea
            value={reply[inq.inquiry_id] || ''}
            onChange={e => setReply({ ...reply, [inq.inquiry_id]: e.target.value })}
            placeholder="Type your reply..."
          />
          <button onClick={() => handleReply(inq.inquiry_id)}>Send Reply</button>
        </div>
      ))}
    </div>
  );
};

export default AdminInbox;