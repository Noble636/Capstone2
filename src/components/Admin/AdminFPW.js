import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminFPW.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminFPW = () => {
    const navigate = useNavigate();
    const [developerToken, setDeveloperToken] = useState('');
    const [username, setUsername] = useState('');
    const [adminDetails, setAdminDetails] = useState(null);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [stage, setStage] = useState('token');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleDeveloperTokenSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/forgot-password/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ developerToken }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setStage('username');
            } else {
                setError(data.message || 'Invalid developer token.');
            }
        } catch (error) {
            console.error('Error verifying developer token:', error);
            setError('Failed to connect to the server.');
        }
    };

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/forgot-password/verify-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (response.ok) {
                setAdminDetails(data.adminDetails);
                setStage('otp');
                setMessage(data.message);
            } else {
                setError(data.message || 'Admin username not found.');
            }
        } catch (error) {
            console.error('Error verifying admin username:', error);
            setError('Failed to connect to the server.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/forgot-password/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setStage('reset');
                setMessage('OTP verified. You can now reset your password.');
            } else {
                setError(data.message || 'Invalid or expired OTP.');
            }
        } catch (error) {
            console.error('Error verifying admin OTP:', error);
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
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/forgot-password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successful. Redirecting to admin login...');
                setTimeout(() => {
                    navigate('/admin-login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error during admin password reset:', error);
            setError('Failed to connect to the server.');
        }
    };

    const handleCancel = () => {
        navigate('/admin-login');
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };

    return (
        <div
            className="admin-fpw-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <div className="admin-fpw-box">
                <h2>Admin Forgot Password</h2>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {stage === 'token' && (
                    <form onSubmit={handleDeveloperTokenSubmit} className="fpw-form">
                        <p className="admin-fpw-info-text">
                            <strong style={{ color: 'red' }}>Warning: This portal is exclusively for System Administrators.</strong>
                            <br /><br />
                            Accessing this page without proper authorization or attempting unauthorized password resets is strictly prohibited and may lead to account suspension or other security measures.
                            <br /><br />
                            Please enter the **Developer Token** provided by the system developers to initiate the password recovery process for an administrative account.
                        </p>
                        <input
                            type="password"
                            value={developerToken}
                            onChange={(e) => setDeveloperToken(e.target.value)}
                            placeholder="Enter Developer Token"
                            required
                        />
                        <button type="submit">Verify Token</button>
                        <button type="button" onClick={handleCancel} className="cancel-fpw-button">
                            Cancel
                        </button>
                    </form>
                )}

                {stage === 'username' && (
                    <form onSubmit={handleUsernameSubmit} className="fpw-form">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Admin Username"
                            required
                        />
                        <button type="submit">Verify Username</button>
                        <button onClick={handleCancel} className="cancel-fpw-button">Cancel</button>
                    </form>
                )}

                {stage === 'otp' && adminDetails && (
                    <div>
                        <h3>Verify OTP</h3>
                                                <p>
                                                    An OTP has been sent to your registered email address: <b>{adminDetails && adminDetails.email}</b><br />
                                                    Please check your email for the code.
                                                </p>
                        <p>Username: {adminDetails.username}</p>
                        <p>Full Name: {adminDetails.full_name}</p>
                        <form onSubmit={handleOtpSubmit} className="fpw-form">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                            />
                            <button type="submit">Verify OTP</button>
                            <button onClick={handleCancel} className="cancel-fpw-button">Cancel</button>
                        </form>
                    </div>
                )}

                {stage === 'reset' && (
                    <div>
                        <h3>Reset Password</h3>
                        <form onSubmit={handleResetPasswordSubmit} className="fpw-form">
                            <div className="admin-fpw-password-input-wrapper">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    required
                                />
                                <span className="admin-fpw-password-toggle-icon" onClick={toggleNewPasswordVisibility}>
                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>
                            <div className="admin-fpw-password-input-wrapper">
                                <input
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Confirm New Password"
                                    required
                                />
                                <span className="admin-fpw-password-toggle-icon" onClick={toggleConfirmNewPasswordVisibility}>
                                    <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>
                            <button type="submit">Reset Password</button>
                            <button onClick={handleCancel} className="cancel-fpw-button">Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFPW;