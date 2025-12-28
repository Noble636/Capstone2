import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminRegister.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [tokenInput, setTokenInput] = useState('');
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [adminToken, setAdminToken] = useState('');
    const [showAdminToken, setShowAdminToken] = useState(false);

    // FIX: Use backend to verify token
    const handleTokenSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/forgot-password/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenInput }),
            });
            const data = await response.json();
            if (response.ok) {
                setIsTokenVerified(true);
                setMessage('');
            } else {
                setMessage(data.message || 'Incorrect Developer or Admin Token. Registration form will not be shown.');
                setTokenInput('');
                setIsTokenVerified(false);
            }
        } catch (error) {
            setMessage('Failed to connect to the server.');
            setIsTokenVerified(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !username || !password || !confirmPassword) {
            setMessage('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, username, password, adminToken }),
            });
            const data = await response.json();
            if (response.ok) {
                setShowSuccessPopup(true);
                setMessage('');
                setFullName('');
                setEmail('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/admin-login');
                }, 1500);
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setMessage('An unexpected error occurred. Please try again later.');
            console.error('Registration error:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin-login');
    };

    const closeMessage = () => {
        setMessage('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const toggleAdminTokenVisibility = () => {
        setShowAdminToken(!showAdminToken);
    };

    return (
        <div className="admin-register-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)', animation: 'admin-dashboard-bg-move 12s ease-in-out infinite alternate' }}>
            <img src="/Background/GB.png" alt="Background" className="home-bg-image" />
            <div className="bubble b1" />
            <div className="bubble b2" />
            <div className="bubble b3" />
            <div className="bubble b4" />
            <div className="bubble b5" />
            <div className="bubble b6" />
            <div className="bubble b7" />
            <div className="bubble b8" />
            {showSuccessPopup && (
                <div className="admin-register-success-popup">
                    <p>Registration successful!</p>
                </div>
            )}
            <div className="admin-register-box">
                <h2>Admin Registration Portal</h2>
                {message && (
                    <div className="admin-register-message-box">
                        <p>{message}</p>
                        <button onClick={closeMessage} className="admin-register-message-close">OK</button>
                    </div>
                )}
                {!isTokenVerified ? (
                    <form onSubmit={handleTokenSubmit} className="admin-register-form">
                        <p className="admin-register-info-text">
                            <strong style={{ color: 'red' }}>Please don't register here if you are not an Admin.</strong>
                            <br />
                            Please input the <b>Developer Token</b> or your <b>Admin Token</b> to enable the registration of an account with admin privileges.
                        </p>
                        <input
                            type="password"
                            placeholder="Developer or Admin Token"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            required
                        />
                        <button type="submit">Verify Token</button>
                        <button type="button" onClick={handleCancel} className="admin-register-cancel-button">
                            Cancel
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="admin-register-form">
                        <p className="admin-register-terms-text">
                            Please understand that this is an administration account.
                            Ensure you use a strong, unique password.
                            This account will have elevated privileges.
                        </p>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="New Admin Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className="admin-register-password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Admin Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="admin-register-password-toggle-icon" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <div className="admin-register-password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Admin Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="admin-register-password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <p className="admin-register-info-text" style={{marginTop: '10px', marginBottom: '5px'}}>
                          This is your <b>Admin Token</b>. You will use this for sensitive actions and password recovery. Please keep it safe and do not share it with others.
                        </p>
                        <div className="admin-register-password-input-wrapper">
                          <input
                            type={showAdminToken ? 'text' : 'password'}
                            placeholder="Admin Token"
                            value={adminToken}
                            onChange={(e) => setAdminToken(e.target.value)}
                            required
                          />
                          <span className="admin-register-password-toggle-icon" onClick={toggleAdminTokenVisibility}>
                            <FontAwesomeIcon icon={showAdminToken ? faEyeSlash : faEye} />
                          </span>
                        </div>
                        <button type="submit">Register Admin Account</button>
                        <button type="button" onClick={handleCancel} className="admin-register-cancel-button">
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminRegister;