import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Username and Password are required.');
            return;
        }

        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsLoggedIn(true);
                setMessage(data.message);
                setUsername('');
                setPassword('');
                setTimeout(() => {
                    navigate('/admin-dashboard');
                }, 1000);
            } else {
                setIsLoggedIn(false);
                setMessage(data.message || 'Login failed. Incorrect username or password.');
            }
        } catch (error) {
            setIsLoggedIn(false);
            setMessage('An unexpected error occurred during login.');
            console.error('Login error:', error);
        }
    };

    const handleRegister = () => {
        navigate('/admin-register');
    };

    const handleForgotPassword = () => {
        navigate('/admin-forgot-password');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div
            className="admin-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <div className="adminlogin-box">
                <h2>Admin: Portal Login Page</h2>
                <form onSubmit={handleLogin} className="adminlogin-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <div className="adminlogin-password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="adminlogin-password-toggle-icon" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <button type="submit">Login</button>
                </form>

                {message && (
                    <div className={`admin-message-box ${isLoggedIn ? 'success' : 'error'}`}>
                        <p>{message}</p>
                    </div>
                )}

                <div className="admin-action-buttons">
                    <button onClick={handleForgotPassword} className="forgot-password">Forgot Password?</button>
                    <button onClick={handleRegister} className="register-admin-account">Register Admin Account</button>
                </div>

                <button onClick={handleCancel} className="adminlogin-cancel">Cancel Login</button>
            </div>
        </div>
    );
};

export default AdminLogin;