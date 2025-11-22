import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminEditAccount.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
      fetchAdminData(storedAdminId);
    } else {
      setError('Admin ID not found. Please log in.');
      setLoading(false);
    }
  }, []);

  const fetchAdminData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://tenantportal-backend.onrender.com/api/admin/profile/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setUsername(data.username || '');
      setFullName(data.full_name || '');
      setInitialUsername(data.username || '');
      setEmail(data.email || '');
    } catch (e) {
      console.error('Error fetching admin profile:', e);
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const usernameChanged = username && username !== initialUsername;
    const passwordChanging = newPassword || confirmPassword;

    if ((usernameChanged || passwordChanging) && !currentPassword) {
      setMessageText('Please enter your current password to change username or password.');
      setMessageType('error');
      setShowMessage(true);
      return;
    }

    if (passwordChanging && newPassword !== confirmPassword) {
      setMessageText('New passwords do not match.');
      setMessageType('error');
      setShowMessage(true);
      return;
    }

    const updateData = { username, fullName, email };
    if (passwordChanging) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }
    if (usernameChanged) {
      updateData.currentPassword = currentPassword;
    }

    try {
      const response = await fetch(`https://tenantportal-backend.onrender.com/api/admin/profile/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessageText(data.message || 'Account updated successfully');
        setMessageType('success');
        setShowMessage(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setInitialUsername(username);
      } else {
        setMessageText(data.message || 'Failed to update account');
        setMessageType('error');
        setShowMessage(true);
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      setMessageText('Failed to connect to server.');
      setMessageType('error');
      setShowMessage(true);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  const closeMessage = () => {
    setShowMessage(false);
    setMessageText('');
    setMessageType('');
  };

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-edit-container" style={{ position: 'relative', zIndex: 2 }}>
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="admin-edit-bg-image" />
      <div className="admin-edit-bubble b1" />
      <div className="admin-edit-bubble b2" />
      <div className="admin-edit-bubble b3" />
      <div className="admin-edit-bubble b4" />
      <div className="admin-edit-bubble b5" />
      <div className="admin-edit-bubble b6" />
      <div className="admin-edit-bubble b7" />
      <div className="admin-edit-bubble b8" />

      <div className="admin-edit-main-row">
        <div className="admin-edit-box">
            <h2>Edit Admin Account</h2>
          <form onSubmit={handleUpdate} className="admin-edit-form">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />

            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required />

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

            <div className="password-input-container">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password (required to change username or password)"
              />
              <span className="password-toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            <div className="password-input-container">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (Optional)"
              />
              <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            <button type="submit">Update</button>
          </form>
          <button onClick={handleCancel} className="admin-edit-cancel-button">Cancel</button>
        </div>

        <div className="admin-account-preview">
          <div className="account-preview-box">
            <h3>Account Preview</h3>
            <p><strong>Username:</strong> {username || <em>Not set</em>}</p>
            <p><strong>Full Name:</strong> {fullName || <em>Not set</em>}</p>
            <p><strong>Email:</strong> {email || <em>Not set</em>}</p>
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
