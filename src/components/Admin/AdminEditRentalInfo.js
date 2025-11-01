import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminEditRentalInfo.css';

const AdminEditRentalInfo = () => {
  const navigate = useNavigate();
  const [agreementHtml, setAgreementHtml] = useState('');
  const [confirmationHtml, setConfirmationHtml] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const a = localStorage.getItem('rentalAgreementHtml') || '';
    const c = localStorage.getItem('rentalConfirmationHtml') || '';
    setAgreementHtml(a);
    setConfirmationHtml(c);
  }, []);

  const handleSave = () => {
    localStorage.setItem('rentalAgreementHtml', agreementHtml);
    localStorage.setItem('rentalConfirmationHtml', confirmationHtml);
    setSavedMessage('Saved locally. Tenant pages will use this content if available.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Edit Rental Information (Admin)</h2>
      <p style={{ maxWidth: 800 }}>
        Edit the HTML content for the Rental Agreement and Rental Confirmation. Saving stores the content to localStorage (key: <code>rentalAgreementHtml</code> and <code>rentalConfirmationHtml</code>).
      </p>

      <div style={{ display: 'flex', gap: 20, marginTop: 18, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3>Rental Agreement (HTML)</h3>
          <textarea value={agreementHtml} onChange={(e) => setAgreementHtml(e.target.value)} rows={20} style={{ width: '100%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Rental Confirmation (HTML)</h3>
          <textarea value={confirmationHtml} onChange={(e) => setConfirmationHtml(e.target.value)} rows={20} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <button onClick={handleSave} style={{ padding: '10px 18px', marginRight: 12 }}>Save</button>
        <button onClick={() => navigate('/admin-dashboard')} style={{ padding: '10px 18px' }}>Back</button>
        {savedMessage && <span style={{ marginLeft: 12, color: 'green' }}>{savedMessage}</span>}
      </div>
    </div>
  );
};

export default AdminEditRentalInfo;
