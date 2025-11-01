import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminDashboard.css';
import '../../css/Admin/AdminEditAccount.css';
import '../../css/Tenant/EditAccount.css';

const AdminEditAccount = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null);
  const [username, setUsername] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
      fetchAdminData(storedAdminId);
    } else {
      setLoading(false);
      setMessageText('Admin ID not found. Please log in.');
      setMessageType('error');
      setShowMessage(true);
    }
  }, []);

  const fetchAdminData = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://tenantportal-backend.onrender.com/api/admin/profile/${id}`);
      if (!res.ok) throw new Error('Failed to load admin profile');
      const data = await res.json();
      setUsername(data.username || '');
      setInitialUsername(data.username || '');
      setFullName(data.full_name || '');
      setEmail(data.email || '');
    } catch (err) {
      console.error(err);
      setMessageText('Failed to load admin profile.');
      setMessageType('error');
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // if changing password, require currentPassword
    if (newPassword && newPassword !== confirmPassword) {
      setMessageText('New passwords do not match.');
      setMessageType('error');
      setShowMessage(true);
      return;
    }

    if ((username && username !== initialUsername) && !currentPassword) {
      setMessageText('Please enter your current password to change username.');
      setMessageType('error');
      setShowMessage(true);
      return;
    }

    const payload = {
      username,
      fullName,
      email,
    };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (username && username !== initialUsername) {
      payload.currentPassword = currentPassword;
    }

    try {
      const res = await fetch(`https://tenantportal-backend.onrender.com/api/admin/profile/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessageText(data.message || 'Failed to update admin account.');
        setMessageType('error');
        setShowMessage(true);
        return;
      }

      setMessageText(data.message || 'Account updated successfully!');
      setMessageType('success');
      setShowMessage(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchAdminData(adminId);
      setInitialUsername(username);

      if (data.forceLogout) {
        // clear auth and redirect to admin login
        localStorage.removeItem('adminId');
        setTimeout(() => navigate('/admin-login'), 1200);
      }
    } catch (err) {
      console.error(err);
      setMessageText('Failed to update.');
      setMessageType('error');
      setShowMessage(true);
    }
  };

  const handleCancel = () => navigate('/admin-dashboard');

  const closeMessage = () => {
    setShowMessage(false);
    setMessageText('');
    setMessageType('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard-container">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="home-bg-image" />
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>

      <div className="admin-dashboard-box" style={{ maxWidth: 900 }}>
        <h1>Edit Admin Account</h1>
        <form onSubmit={handleUpdate} style={{ width: '100%', maxWidth: 600 }}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password (required to change username or password)" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password (optional)" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" />

          <button type="submit" style={{ marginTop: 12 }}>Update</button>
          <button type="button" onClick={handleCancel} className="admin-dashboard-logout-button" style={{ marginTop: 12 }}>Cancel</button>
        </form>

        <div style={{ width: '100%', maxWidth: 400, marginTop: 18 }}>
          <div className="account-preview-box">
            <h3>Account Preview</h3>
            <p><strong>Username:</strong> {username || <em>Not set</em>}</p>
            <p><strong>Full Name:</strong> {fullName || <em>Not set</em>}</p>
            <p><strong>Email:</strong> {email || <em>Not set</em>}</p>
          </div>

          <div className="edit-account-note-box">
            <p style={{ marginTop: 0 }}><strong>Note</strong></p>
            <ul style={{ textAlign: 'left', paddingLeft: '1.1rem', marginTop: 6 }}>
              <li>Please make sure the details you input here are updated and accurate, because this will be used by the system and other admins for identification and communication purposes.</li>
              <li>Changing your username requires entering your current password to confirm the change.</li>
            </ul>
          </div>
        </div>

      </div>

      {showMessage && (
        <div className="modal-overlay" style={{ zIndex: 1002 }}>
          <div className={`modal-content ${messageType}`} style={{ position: 'relative', zIndex: 1003 }}>
            <h2>{messageType === 'success' ? 'Success!' : 'Error!'}</h2>
            <p>{messageText}</p>
            <div className="modal-actions">
              <button className="modal-button ok" onClick={closeMessage}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditAccount;
