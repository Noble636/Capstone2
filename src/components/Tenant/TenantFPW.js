import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Tenant/TenantFPW.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const TenantFPW = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [stage, setStage] = useState('username');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/forgot-password/verify-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserDetails(data.userDetails);
        setStage('otp');
        setMessage('An OTP has been sent to your registered email address.');
      } else {
        setError(data.message || 'Invalid username.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStage('reset');
        setMessage('OTP verified. You can now reset your password.');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/forgot-password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          navigate('/tenant-login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  const handleCancel = () => {
    navigate('/tenant-login');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  return (
    <div
      className="tenant-fpw-container"
      style={{
        backgroundImage: "url('/Background/Background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e0c23d"
      }}
    >
      <div className="tenant-fpw-box">
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {stage === 'username' && (
          <form onSubmit={handleUsernameSubmit} className="fpw-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              required
            />
            <button type="submit">Verify Username</button>
          </form>
        )}

        {stage === 'otp' && userDetails && (
          <div>
            <h3>Verify OTP</h3>
            <p>Please enter the OTP sent to your registered email address: <b>{userDetails.email}</b></p>
            <p>Username: {userDetails.username}</p>
            <p>Full Name: {userDetails.full_name}</p>
            <p>Apartment ID: {userDetails.apartment_id}</p>
            <form onSubmit={handleOtpSubmit} className="fpw-form">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              <button type="submit">Verify OTP</button>
            </form>
          </div>
        )}

        {stage === 'reset' && (
          <div>
            <h3>Reset Password</h3>
            <form onSubmit={handleResetPasswordSubmit} className="fpw-form">
              <div className="password-input-container">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                />
                <span className="password-toggle-icon" onClick={toggleNewPasswordVisibility}>
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="password-input-container">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                />
                <span className="password-toggle-icon" onClick={toggleConfirmNewPasswordVisibility}>
                  <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <button type="submit">Reset Password</button>
            </form>
          </div>
        )}

        <button onClick={handleCancel} className="cancel-fpw-button">Cancel</button>
      </div>
    </div>
  );
};

export default TenantFPW;