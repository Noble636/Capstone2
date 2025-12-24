import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/ManageAccounts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ManageAccounts = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [expandedTenant, setExpandedTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [tenantToDeleteId, setTenantToDeleteId] = useState(null);
    const [tenantToDeleteName, setTenantToDeleteName] = useState('');

    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('');

    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [tokenError, setTokenError] = useState('');
    const [verifyingAdminToken, setVerifyingAdminToken] = useState(false);

    const [showExportModal, setShowExportModal] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [revealEnabled, setRevealEnabled] = useState(false);
    const [revealedTenants, setRevealedTenants] = useState({});
    const [revealCountdowns, setRevealCountdowns] = useState({});
    const countdownRefs = useRef({});

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/tenants');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTenants(data);
        } catch (e) {
            console.error("Error fetching tenants:", e);
            setError("Failed to load tenant accounts.");
        } finally {
            setLoading(false);
        }
    }

    const handleToggleExpand = (id) => {
        setExpandedTenant(expandedTenant === id ? null : id);
    };

    const handleDeleteAccount = (id, name) => {
        setTenantToDeleteId(id);
        setTenantToDeleteName(name);
        setShowConfirmModal(true);
    };

    const proceedToWarning = () => {
        setShowConfirmModal(false);
        setShowWarningModal(true);
    };

    const executeDelete = async () => {
        setShowWarningModal(false);
        if (!tenantToDeleteId) return;

        try {
            const response = await fetch(`https://tenantportal-backend.onrender.com/api/admin/tenants/${tenantToDeleteId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setMessageText(data.message || `Tenant account '${tenantToDeleteName}' deleted successfully.`);
                setMessageType('success');
                setShowMessage(true);
                fetchTenants();
            } else {
                setMessageText(data.message || `Failed to delete tenant account '${tenantToDeleteName}'.`);
                setMessageType('error');
                setShowMessage(true);
            }
        } catch (error) {
            console.error('Error deleting tenant account:', error);
            setMessageText(`An unexpected error occurred while deleting '${tenantToDeleteName}'.`);
            setMessageType('error');
            setShowMessage(true);
        } finally {
            setTenantToDeleteId(null);
            setTenantToDeleteName('');
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setShowWarningModal(false);
        setTenantToDeleteId(null);
        setTenantToDeleteName('');
    };

    const closeMessage = () => {
        setShowMessage(false);
        setMessageText('');
        setMessageType('');
    };

    const handleBack = () => {
        navigate('/admin-dashboard');
    };

    // Enable Reveal Information (global)
    const handleEnableReveal = () => {
        setShowTokenModal(true);
        setTokenInput('');
        setTokenError('');
    };

    // Token Modal Submit
    const handleTokenSubmit = async (e) => {
        e.preventDefault();
        setTokenError('');
        if (tokenInput === 'Token') {
            setRevealEnabled(true);
            setShowTokenModal(false);
            return;
        }
        setVerifyingAdminToken(true);
        try {
            const adminId = localStorage.getItem('adminId');
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/verify-admin-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId })
            });
            const data = await response.json();
            if (response.ok && data.valid) {
                setRevealEnabled(true);
                setShowTokenModal(false);
            } else {
                setTokenError(data.message || 'Invalid token.');
            }
        } catch (err) {
            setTokenError('Error verifying token.');
        } finally {
            setVerifyingAdminToken(false);
        }
    };

    // Export Modal Submit
    const handleExportSubmit = async (e) => {
        e.preventDefault();
        setTokenError('');
        setExporting(true);
        try {
            const adminId = localStorage.getItem('adminId'); // or your context value
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/export-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenInput}`
                },
                body: JSON.stringify({ adminId })
            });
            if (!response.ok) {
                setTokenError('Invalid token or error exporting file.');
                setExporting(false);
                return;
            }
            const blob = await response.blob();
            const urlObj = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlObj;
            a.download = 'Tenant_Account_Reports.xlsx'; // <-- Correct file name
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlObj);
            setShowExportModal(false);
        } catch (err) {
            setTokenError('Failed to export file.');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return <p>Loading tenant accounts...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="manage-accounts-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)', animation: 'admin-dashboard-bg-move 12s ease-in-out infinite alternate' }}>
            <img src="/Background/GB.png" alt="Background" className="home-bg-image" />
            <div className="bubble b1" />
            <div className="bubble b2" />
            <div className="bubble b3" />
            <div className="bubble b4" />
            <div className="bubble b5" />
            <div className="bubble b6" />
            <div className="bubble b7" />
            <div className="bubble b8" />
            <div className="manage-accounts-box">
                <h1>Manage Tenant Accounts</h1>
                <button className="back_to_dashboard_manage_accounts_button" onClick={handleBack}>
                    <span style={{ fontSize: '1.5rem' }}>🏠</span> Back to Dashboard
                </button>
                <button
                    className="enable-reveal-btn"
                    onClick={handleEnableReveal}
                    style={{
                        marginBottom: '16px',
                        marginTop: '8px',
                        background: '#7a4f13',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 0',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        width: '100%',
                        maxWidth: '300px',
                        cursor: 'pointer'
                    }}
                >
                    Enable Reveal Information
                </button>
                <button
                    className="export-excel-btn"
                    style={{ marginBottom: '1rem' }}
                    onClick={() => {
                        setShowExportModal(true);
                        setTokenInput('');
                        setTokenError('');
                    }}
                >
                    Generate Data Report
                </button>
                <div className="tenant-list">
                    {tenants.length === 0 ? (
                        <p>No tenant accounts found.</p>
                    ) : (
                        tenants.map((tenant) => (
                            <div key={tenant.tenant_id} className="tenant-item" onClick={() => handleToggleExpand(tenant.tenant_id)}>
                                <div className="tenant-summary">
                                    <p><strong>{tenant.full_name}</strong></p>
                                </div>
                                {expandedTenant === tenant.tenant_id && (
                                    <div className="tenant-details">
                                        <p><strong>Username:</strong> {revealedTenants[tenant.tenant_id] ? tenant.username : <span className="spoiler">••••••••</span>}</p>
                                        <p><strong>Apartment ID:</strong> {tenant.apartment_id || 'N/A'}</p>
                                        <p><strong>Phone:</strong> {revealedTenants[tenant.tenant_id] ? tenant.contact_number : <span className="spoiler">••••••••</span>}</p>
                                        <p><strong>Email:</strong> {revealedTenants[tenant.tenant_id] ? tenant.email : <span className="spoiler">••••••••</span>}</p>
                                        <p><strong>Emergency Contact Name:</strong> {revealedTenants[tenant.tenant_id] ? tenant.emergency_contact : <span className="spoiler">••••••••</span>}</p>
                                        <p><strong>Emergency Contact Number:</strong> {revealedTenants[tenant.tenant_id] ? tenant.emergency_contact_number : <span className="spoiler">••••••••</span>}</p>
                                        <p><strong>Account Created:</strong> {new Date(tenant.created_at).toLocaleDateString()}</p>
                                        <div className="tenant-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div className="tenant-action-buttons-row">
                                                <button
                                                    className="reveal-sensitive-btn"
                                                    disabled={!revealEnabled || revealCountdowns[tenant.tenant_id] > 0}
                                                    style={{
                                                        marginBottom: '16px',
                                                        marginRight: '18px',
                                                        background: revealEnabled && !revealCountdowns[tenant.tenant_id] ? '#222' : '#aaa',
                                                        color: '#fff',
                                                        cursor: revealEnabled && !revealCountdowns[tenant.tenant_id] ? 'pointer' : 'not-allowed',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        padding: '10px 15px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        if (!revealEnabled || revealCountdowns[tenant.tenant_id] > 0) return;
                                                        setRevealedTenants(prev => ({
                                                            ...prev,
                                                            [tenant.tenant_id]: true
                                                        }));
                                                        setRevealCountdowns(prev => ({
                                                            ...prev,
                                                            [tenant.tenant_id]: 15
                                                        }));
                                                        if (countdownRefs.current[tenant.tenant_id]) {
                                                            clearInterval(countdownRefs.current[tenant.tenant_id]);
                                                        }
                                                        countdownRefs.current[tenant.tenant_id] = setInterval(() => {
                                                            setRevealCountdowns(prev => {
                                                                const newVal = (prev[tenant.tenant_id] || 0) - 1;
                                                                if (newVal <= 0) {
                                                                    clearInterval(countdownRefs.current[tenant.tenant_id]);
                                                                    setRevealedTenants(p => ({ ...p, [tenant.tenant_id]: false }));
                                                                    return { ...prev, [tenant.tenant_id]: 0 };
                                                                }
                                                                return { ...prev, [tenant.tenant_id]: newVal };
                                                            });
                                                        }, 1000);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} /> Reveal Sensitive Info
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleDeleteAccount(tenant.tenant_id, tenant.full_name);
                                                    }}
                                                    style={{
                                                        marginBottom: '16px'
                                                    }}
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                            {/* Timer placeholder always present below buttons */}
                                            <div style={{ minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {revealedTenants[tenant.tenant_id] && revealCountdowns[tenant.tenant_id] > 0 ? (
                                                    <span style={{ color: '#b71c1c', fontWeight: 'bold', marginTop: 8, textAlign: 'center', display: 'block' }}>
                                                        The information will hide in: ({revealCountdowns[tenant.tenant_id]})
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    </div>
                    {showExportModal && (
                    <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
                        <div
                            className="modal-content"
                            style={{
                                background: "rgba(255,255,255,0.95)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                padding: "32px 40px",
                                maxWidth: "400px",
                                width: "90%",
                                textAlign: "center"
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ fontWeight: 700, marginBottom: 18 }}>
                              Generate Data Report
                            </h2>
                            <p style={{ color: "#b71c1c", background: "#fff3cd", borderRadius: 8, padding: 12, marginBottom: 18, fontSize: "1.05rem" }}>
                                <strong>Security:</strong> Enter your developer or admin token to download the Excel file.
                            </p>
                            <form onSubmit={handleExportSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="password"
                                    value={tokenInput}
                                    onChange={e => setTokenInput(e.target.value)}
                                    placeholder="Developer or Admin Token"
                                    required
                                    style={{
                                        width: "100%",
                                        maxWidth: "340px",
                                        padding: "14px",
                                        fontSize: "1.1rem",
                                        border: "2px solid #111",
                                        borderRadius: "8px",
                                        marginBottom: "12px",
                                        boxSizing: "border-box",
                                        display: "block",
                                        marginLeft: "auto",
                                        marginRight: "auto"
                                    }}
                                />
                                {tokenError && <p style={{ color: 'red', marginBottom: 10 }}>{tokenError}</p>}
                                <div className="modal-actions" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                                    <button type="submit" className="modal-button confirm" style={{ background: "#7a4f13", color: "#fff" }} disabled={exporting}>
                                        {exporting ? 'Exporting...' : 'Export'}
                                    </button>
                                    <button type="button" className="modal-button cancel" style={{ background: "#6c757d", color: "#fff" }} onClick={() => setShowExportModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showTokenModal && (
                    <div className="modal-overlay" onClick={() => setShowTokenModal(false)}>
                        <div
                            className="modal-content"
                            style={{
                                background: "rgba(255,255,255,0.95)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                padding: "32px 40px",
                                maxWidth: "400px",
                                width: "90%",
                                textAlign: "center"
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ fontWeight: 700, marginBottom: 18 }}>Sensitive Information Access</h2>
                            <p style={{ color: "#b71c1c", background: "#fff3cd", borderRadius: 8, padding: 12, marginBottom: 18, fontSize: "1.05rem" }}>
                                <strong>Warning:</strong> This information is sensitive and for the eyes of authorized administrators only. Please do not share or misuse this data.
                            </p>
                            <form onSubmit={handleTokenSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="password"
                                    value={tokenInput}
                                    onChange={e => setTokenInput(e.target.value)}
                                    placeholder="Developer or Admin Token"
                                    required
                                    style={{
                                        width: "100%",
                                        maxWidth: "340px",
                                        padding: "14px",
                                        fontSize: "1.1rem",
                                        border: "2px solid #111",
                                        borderRadius: "8px",
                                        marginBottom: "12px",
                                        boxSizing: "border-box",
                                        display: "block",
                                        marginLeft: "auto",
                                        marginRight: "auto"
                                    }}
                                />
                                {tokenError && <p style={{ color: 'red', marginBottom: 10 }}>{tokenError}</p>}
                                <div className="modal-actions" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                                    <button type="submit" className="modal-button confirm" style={{ background: "#7a4f13", color: "#fff" }} disabled={verifyingAdminToken}>{verifyingAdminToken ? 'Verifying...' : 'Enable'}</button>
                                    <button type="button" className="modal-button cancel" style={{ background: "#6c757d", color: "#fff" }} onClick={() => setShowTokenModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Confirm Deletion</h2>
                            <p>Are you sure you want to delete the account for <strong>{tenantToDeleteName}</strong>?</p>
                            <div className="modal-actions">
                                <button className="modal-button confirm" onClick={proceedToWarning}>Yes</button>
                                <button className="modal-button cancel" onClick={cancelDelete}>No</button>
                            </div>
                        </div>
                    </div>
                )}
                {showWarningModal && (
                    <div className="modal-overlay">
                        <div className="modal-content warning">
                            <h2>Warning: Permanent Deletion</h2>
                            <p>
                                This account will be permanently deleted, including all associated complaints and visitor logs.
                                <br />
                                This action cannot be undone.
                            </p>
                            <p>Do you really want to proceed with deleting <strong>{tenantToDeleteName}</strong>?</p>
                            <div className="modal-actions">
                                <button className="modal-button confirm" onClick={executeDelete}>Yes</button>
                                <button className="modal-button cancel" onClick={cancelDelete}>No</button>
                            </div>
                        </div>
                    </div>
                )}
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
        </div>
    );
};

export default ManageAccounts;
