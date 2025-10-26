import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Tenant/TenantLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const TenantLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                localStorage.setItem('tenantId', data.userId);
                localStorage.setItem('fullName', data.fullName);
                localStorage.setItem('apartmentId', data.apartmentId);
                navigate('/tenant-dashboard');
            } else {
                console.error('Login failed:', data.message);
                setLoginError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
            setLoginError('Failed to connect to the server');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="tenant-login-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)', animation: 'admin-dashboard-bg-move 12s ease-in-out infinite alternate' }}>
            <img src="/Background/GB.png" alt="Background" className="home-bg-image" />
            <div className="bubble b1" />
            <div className="bubble b2" />
            <div className="bubble b3" />
            <div className="bubble b4" />
            <div className="bubble b5" />
            <div className="bubble b6" />
            <div className="bubble b7" />
            <div className="bubble b8" />
            <div className="tenant-box">
                <h2>Tenant: Portal Login Page</h2>
                {loginError && <div className="error-message">{loginError}</div>}
                <form onSubmit={handleLogin} className="tenant-form">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={togglePasswordVisibility}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div className="extra-buttons">
                    <div className="button-pair">
                        <button className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</button>
                        <button className="register-button" onClick={handleRegister}>Register</button>
                    </div>
                </div>
                <button onClick={handleCancel} className="cancel-login-button">Cancel Login</button>
            </div>
        </div>
    );
};

export default TenantLogin;