import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Tenant/EditAccount.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const EditAccount = () => {
    const navigate = useNavigate();

    const [tenantId, setTenantId] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // New state for current password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [confirmTouched, setConfirmTouched] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Visibility for current password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        if (storedTenantId) {
            setTenantId(storedTenantId);
            fetchTenantData(storedTenantId);
        } else {
            setError('Tenant ID not found. Please log in.');
            setLoading(false);
        }
    }, []);

    const fetchTenantData = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/tenant/profile/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsername(data.username || '');
            setFullName(data.full_name || '');
            setEmail(data.email || '');
            setContactNumber(data.contact_number || '');
            setApartmentId(data.apartment_id || '');
            setEmergencyContact(data.emergency_contact || '');
            setEmergencyContactNumber(data.emergency_contact_number || '');
        } catch (e) {
            console.error('Error fetching tenant profile:', e);
            setError('Failed to load account data.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        if ((password || confirmPassword) && !currentPassword) {
            setMessageText('Please enter your current password to update your password.');
            setMessageType('error');
            setShowMessage(true);
            return;
        }

        if ((password || confirmPassword) && password !== confirmPassword) {
            setMessageText('New passwords do not match!');
            setMessageType('error');
            setShowMessage(true);
            return;
        }

        const updateData = {
            fullName,
            email,
            contactNumber,
            apartmentId,
            emergencyContact,
            emergencyContactNumber,
        };

        if (password) {
            updateData.currentPassword = currentPassword; // Include current password
            updateData.newPassword = password;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/tenant/profile/${tenantId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageText(data.message || 'Account updated successfully!');
                setMessageType('success');
                setShowMessage(true);
                setCurrentPassword(''); // Clear current password field
                setPassword('');
                setConfirmPassword('');
                setConfirmTouched(false);
                fetchTenantData(tenantId);
            } else {
                setMessageText(data.message || 'Failed to update account.');
                setMessageType('error');
                setShowMessage(true);
            }
        } catch (error) {
            console.error('Error updating account:', error);
            setMessageText('Failed to connect to the server. Please try again.');
            setMessageType('error');
            setShowMessage(true);
        }
    };

    const handleCancel = () => {
        navigate('/tenant-dashboard');
    };

    const closeMessage = () => {
        setShowMessage(false);
        setMessageText('');
        setMessageType('');
    };

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (loading) {
        return <p>Loading account data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div
            className="tenant-register-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <div className="edit-account-main-row">
                <div className="tenant-register-box">
                    <h2>Edit Account</h2>
                    <form onSubmit={handleUpdate} className="tenant-register-form">
                        <input
                            type="text"
                            value={username}
                            placeholder="Username"
                            disabled
                        />
                        <div className="password-input-container">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password (Required to change password)"
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={toggleCurrentPasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password (Optional)"
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
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => setConfirmTouched(true)}
                                placeholder="Confirm New Password"
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        {confirmTouched && password && password !== confirmPassword && (
                            <p className="error-message">New passwords do not match</p>
                        )}
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full Name"
                            required
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Contact Number (Optional)"
                            required
                        />
                        <input
                            type="text"
                            value={apartmentId}
                            onChange={(e) => setApartmentId(e.target.value)}
                            placeholder="Apartment ID (Name or number)"
                            required
                        />
                        <input
                            type="text"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            placeholder="Emergency Contact Name (Optional)"
                        />
                        <input
                            type="text"
                            value={emergencyContactNumber}
                            onChange={(e) => setEmergencyContactNumber(e.target.value)}
                            placeholder="Emergency Contact Number (Optional)"
                        />
                        <button type="submit">Update</button>
                    </form>
                    <button onClick={handleCancel} className="cancel-register-button">Cancel</button>
                </div>
                <div className="account-preview-right">
                    <div className="account-preview-box">
                        <h3>Account Preview</h3>
                        <p><strong>Username:</strong> {username || <em>Not set</em>}</p>
                        <p><strong>Full Name:</strong> {fullName || <em>Not set</em>}</p>
                        <p><strong>Email:</strong> {email || <em>Not set</em>}</p>
                        <p><strong>Contact Number:</strong> {contactNumber || <em>Not set</em>}</p>
                        <p><strong>Apartment ID:</strong> {apartmentId || <em>Not set</em>}</p>
                        <p><strong>Emergency Contact Name:</strong> {emergencyContact || <em>Not set</em>}</p>
                        <p><strong>Emergency Contact Number:</strong> {emergencyContactNumber || <em>Not set</em>}</p>
                    </div>
                    <div className="edit-account-note-box">
                        <h4>Things you cannot edit:</h4>
                        <ul>
                            <li>
                                <strong>Username</strong> – The username cannot be changed because it is a unique identifier in the database and for security purposes.
                            </li>
                        </ul>
                        <p style={{ marginTop: "12px" }}>
                            <strong>Note:</strong> Please make sure the details you input here are updated and accurate, because this will be used by the admin for identification and communication purposes.
                        </p>
                    </div>
                </div>
            </div>

            {showMessage && (
                <div className="modal-overlay">
                    <div className={`modal-content ${messageType}`}>
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

export default EditAccount;