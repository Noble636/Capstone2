import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Tenant/TenantRegister.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const TenantRegister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'contactNumber':
                setContactNumber(value);
                break;
            case 'apartmentId':
                setApartmentId(value);
                break;
            case 'emergencyContact':
                setEmergencyContact(value);
                break;
            case 'emergencyContactNumber':
                setEmergencyContactNumber(value);
                break;
            case 'acceptedTerms':
                setAcceptedTerms(e.target.checked);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegistrationError('');

        if (!acceptedTerms) {
            setRegistrationError('Please accept the terms and conditions.');
            return;
        }
        if (password !== confirmPassword) {
            setRegistrationError('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    fullName,
                    email,
                    contactNumber,
                    apartmentId,
                    emergencyContact,
                    emergencyContactNumber,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                setShowSuccessModal(true);
            } else {
                console.error('Registration failed:', data.message);
                setRegistrationError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('There was an error registering:', error);
            setRegistrationError('Failed to connect to the server');
        }
    };

    const handleCancel = () => {
        navigate('/tenant-login');
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/tenant-login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div
            className="tenant-register-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d",
                minHeight: "100vh"
            }}
        >
            <div className="tenant-register-box">
                <h2>Tenant Registration</h2>
                {registrationError && <div className="error-message">{registrationError}</div>}
                {showSuccessModal && (
                    <div className="success-modal-overlay">
                        <div className="success-modal">
                            <p>Registration successful!</p>
                            <button onClick={handleCloseSuccessModal}>Go to Login</button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="tenant-register-form">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        required
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={password}
                            onChange={handleInputChange}
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
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm Password"
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="text"
                        name="contactNumber"
                        value={contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number (Optional)"
                    />
                    <input
                        type="text"
                        name="apartmentId"
                        value={apartmentId}
                        onChange={handleInputChange}
                        placeholder="Apartment ID (Name or number)"
                        required
                    />
                    <input
                        type="text"
                        name="emergencyContact"
                        value={emergencyContact}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Name (Optional)"
                    />
                    <input
                        type="text"
                        name="emergencyContactNumber"
                        value={emergencyContactNumber}
                        onChange={handleInputChange}
                        placeholder="Emergency Contact Number (Optional)"
                    />
                    <button type="submit" disabled={!acceptedTerms}>Register</button>
                </form>
                <button onClick={handleCancel} className="cancel-register-button">Cancel</button>
            </div>
            <div className="terms-column">
                <div className="terms-box">
                    <h3>Terms and Conditions</h3>
                    <p>Please read the following terms carefully before registering:</p>
                    <ul>
                        <li>You must provide accurate and truthful information.</li>
                        <li>You are responsible for keeping your account secure.</li>
                        <li>You must not use the system for unauthorized or illegal activities.</li>
                        <li>Violation of these terms may result in suspension or termination of your account.</li>
                        <li>The service provider is not liable for any data loss, system errors, or service interruptions.</li>
                        <li>Emergency contact information is optional but recommended for safety reasons.</li>
                        <li>All submitted data is handled in accordance with our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
                        <li>These terms may be updated at any time. Continued use indicates acceptance of any updates.</li>
                    </ul>
                    <div className="terms-checkbox" style={{ marginTop: "18px" }}>
                        <input
                            type="checkbox"
                            name="acceptedTerms"
                            checked={acceptedTerms}
                            onChange={handleInputChange}
                        />
                        <label>I have read and agree to the Terms and Conditions above</label>
                    </div>
                </div>
                <div className="privacy-warning-text">
                    <strong>Warning:</strong> No one will ever ask for your password—not the admin, not the developers, and not any staff. Never share your password with anyone for any reason. If someone asks for your password, please report it to management immediately.
                </div>
            </div>
        </div>
    );
};



export default TenantRegister;
