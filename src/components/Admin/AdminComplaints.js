import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminComplaints.css';

const AdminComplaints = () => {
    const navigate = useNavigate();
    const [activeComplaints, setActiveComplaints] = useState([]);
    const [complaintsLog, setComplaintsLog] = useState([]);
    const [expandedComplaint, setExpandedComplaint] = useState(null);
    const [showComplaintsLog, setShowComplaintsLog] = useState(false);
    const [messageInputs, setMessageInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        fetchActiveComplaints();
        fetchComplaintsLog();
        console.log("AdminComplaints component is running");
    }, []);

    const fetchActiveComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/admin/complaints/active');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setActiveComplaints(data);
        } catch (error) {
            console.error("Error fetching active complaints:", error);
            setError("Failed to load active complaints.");
        } finally {
            setLoading(false);
        }
    };

    const fetchComplaintsLog = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/admin/complaints/log');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setComplaintsLog(data);
        } catch (error) {
            console.error("Error fetching complaints log:", error);
            setError("Failed to load complaints log.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedComplaint(expandedComplaint === id ? null : id);
    };

    const handleMessageChange = (id, value) => {
        setMessageInputs((prev) => ({ ...prev, [id]: value }));
    };

    const showConfirmation = (id, status) => {
        setConfirmation({
            message: `Do you want to mark this complaint as ${status}?`,
            onConfirm: () => updateComplaintStatus(id, status),
            onCancel: () => setConfirmation(null),
        });
    };

    const updateComplaintStatus = async (id, status) => {
        const message = messageInputs[id] || '';
        setConfirmation(null); // Close the confirmation popup
        try {
            const response = await fetch(`http://localhost:5000/api/admin/complaints/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, adminMessage: message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchActiveComplaints();
            fetchComplaintsLog();
            setExpandedComplaint(null);
            setMessageInputs((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (error) {
            console.error("Error updating complaint status:", error);
            setError("Failed to update complaint status.");
        }
    };

    const handleBack = () => {
        navigate('/admin-dashboard');
    };

    const toggleView = (logView) => {
        setShowComplaintsLog(logView);
        setExpandedComplaint(null);
    };

    if (loading) {
        return <p>Loading complaints...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div
            className="admin-complaints-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <div className="admin-complaints-box">
                <h1>Admin Complaints</h1>

                <button className="back_to_dashboard_button" onClick={handleBack}>
                    <span style={{ fontSize: '1.5rem' }}>🏠</span> Back to Dashboard
                </button>

                <div className="complaints-nav">
                    <button
                        className="complaints-nav-button"
                        onClick={() => toggleView(false)}
                    >
                        Active Complaints
                    </button>
                    <button
                        className="complaints-nav-button"
                        onClick={() => toggleView(true)}
                    >
                        Complaints Log
                    </button>
                </div>

                {!showComplaintsLog && (
                    <div className="complaints-list">
                        <h2>Active Complaints</h2>
                        {activeComplaints.length === 0 ? (
                            <p>No active complaints.</p>
                        ) : (
                            activeComplaints.map((complaint) => (
                                <div
                                    key={complaint.complaint_id}
                                    className="complaint-item"
                                    onClick={() => handleToggleExpand(complaint.complaint_id)}
                                >
                                    <div className="complaint-summary">
                                        <p>
                                            <strong>{complaint.full_name}</strong> - Apartment {complaint.apartment_id} -{' '}
                                            {new Date(complaint.submitted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {expandedComplaint === complaint.complaint_id && (
                                        <div className="complaint-details" onClick={(e) => e.stopPropagation()}>
                                            <p><strong>Complaint:</strong> {complaint.complaint_text}</p>
                                            <div className="message-container">
                                                <textarea
                                                    id={`message-${complaint.complaint_id}`}
                                                    rows={3}
                                                    className="message-textarea"
                                                    placeholder="Optional Message:"
                                                    value={messageInputs[complaint.complaint_id] || ''}
                                                    onChange={(e) => handleMessageChange(complaint.complaint_id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="complaint-actions">
                                                <button
                                                    className="mark_as_attended_button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showConfirmation(complaint.complaint_id, 'Attended');
                                                    }}
                                                >
                                                    Mark as Attended
                                                </button>
                                                <button
                                                    className="decline_complaint_button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showConfirmation(complaint.complaint_id, 'Declined');
                                                    }}
                                                >
                                                    Decline Complaint
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {showComplaintsLog && (
                    <div className="complaints-log">
                        <h2>Complaints Log</h2>
                        {complaintsLog.length === 0 ? (
                            <p>No logged complaints yet.</p>
                        ) : (
                            complaintsLog.map((complaint) => (
                                <div
                                    key={complaint.complaint_id}
                                    className="complaint-log-item"
                                    onClick={() =>
                                        setExpandedComplaint(expandedComplaint === complaint.complaint_id ? null : complaint.complaint_id)
                                    }
                                >
                                    <p>
                                        <strong>{complaint.full_name}</strong> - Apartment {complaint.apartment_id} -{' '}
                                        {new Date(complaint.submitted_at).toLocaleDateString()} -{' '}
                                        <strong>{complaint.status}</strong>
                                    </p>
                                    {expandedComplaint === complaint.complaint_id && (
                                        <>
                                            <p><strong>Complaint:</strong> {complaint.complaint_text}</p>
                                            <p><strong>Message:</strong> {complaint.admin_message || 'No message provided.'}</p>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {confirmation && (
                    <div className="confirmation-popup">
                        <p>{confirmation.message}</p>
                        <div className="confirmation-buttons">
                            <button onClick={confirmation.onConfirm} className="confirm-button">Yes</button>
                            <button onClick={confirmation.onCancel} className="cancel-button">No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;