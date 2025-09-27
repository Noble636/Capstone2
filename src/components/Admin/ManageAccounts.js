import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/ManageAccounts.css';

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

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/admin/tenants');
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
    };

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
            const response = await fetch(`http://localhost:5000/api/admin/tenants/${tenantToDeleteId}`, {
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

    if (loading) {
        return <p>Loading tenant accounts...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div
            className="manage-accounts-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <div className="manage-accounts-box">
                <h1>Manage Tenant Accounts</h1>

                <button className="back_to_dashboard_manage_accounts_button" onClick={handleBack}>
                    <span style={{ fontSize: '1.5rem' }}>🏠</span> Back to Dashboard
                </button>

                <div className="tenant-list">
                    {tenants.length === 0 ? (
                        <p>No tenant accounts found.</p>
                    ) : (
                        tenants.map((tenant) => (
                            <div
                                key={tenant.tenant_id}
                                className="tenant-item"
                                onClick={() => handleToggleExpand(tenant.tenant_id)}
                            >
                                <div className="tenant-summary">
                                    <p><strong>{tenant.full_name}</strong> - {tenant.username}</p>
                                </div>

                                {expandedTenant === tenant.tenant_id && (
                                    <div className="tenant-details">
                                        <p><strong>Apartment ID:</strong> {tenant.apartment_id || 'N/A'}</p>
                                        <p><strong>Phone:</strong> {tenant.contact_number || 'N/A'}</p>
                                        <p><strong>Email:</strong> {tenant.email || 'N/A'}</p>
                                        <p><strong>Emergency Contact Name:</strong> {tenant.emergency_contact || 'N/A'}</p>
                                        <p><strong>Emergency Contact Number:</strong> {tenant.emergency_contact_number || 'N/A'}</p>
                                        <p><strong>Account Created:</strong> {new Date(tenant.created_at).toLocaleDateString()}</p>

                                        <div className="tenant-actions">
                                            <button
                                                className="delete-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAccount(tenant.tenant_id, tenant.full_name);
                                                }}
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

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
    );
};

export default ManageAccounts;
