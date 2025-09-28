import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/EditComplaints.css';

const EditComplaints = () => {
    const [tenantId, setTenantId] = useState(null);
    const [fullName, setFullName] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [updatedComplaintText, setUpdatedComplaintText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const handleDeleteClick = (complaintId) => {
        setDeleteTargetId(complaintId);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        try {
            const response = await fetch(`https://tenantportal-backend.onrender.com/api/tenant/complaints/${deleteTargetId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setComplaints((prev) => prev.filter((c) => c.complaint_id !== deleteTargetId));
                if (selectedComplaint && selectedComplaint.complaint_id === deleteTargetId) {
                    setSelectedComplaint(null);
                    setUpdatedComplaintText('');
                }
                setShowDeleteMessage(true);
                setTimeout(() => setShowDeleteMessage(false), 2000);
            } else {
                alert('Failed to delete complaint.');
            }
        } catch (e) {
            alert('Error deleting complaint.');
        } finally {
            setDeleteTargetId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteTargetId(null);
    };

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        const storedFullName = localStorage.getItem('fullName');
        const storedApartmentId = localStorage.getItem('apartmentId');

        if (storedTenantId) {
            setTenantId(storedTenantId);
            setFullName(storedFullName);
            setApartmentId(storedApartmentId);

            fetchTenantComplaints(storedTenantId);
        } else {
            setError('Tenant information not found. Please log in again.');
            setLoading(false);
        }
    }, []);

    const fetchTenantComplaints = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://tenantportal-backend.onrender.com/api/tenant/complaints?tenantId=${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setComplaints(data);
            setLoading(false);
        } catch (e) {
            setError('Failed to fetch complaints.');
            console.error('Error fetching complaints:', e);
            setLoading(false);
        }
    };

    const handleSelect = (complaint) => {
        if (complaint.status === 'Pending' || complaint.status === null) {
            setSelectedComplaint(complaint);
            setUpdatedComplaintText(complaint.complaint_text);
        } else {
            alert(`This complaint has been ${complaint.status} by admin and cannot be edited.`);
            setSelectedComplaint(null);
        }
    };

    const handleCancelEdit = () => {
        setSelectedComplaint(null);
        setUpdatedComplaintText('');
    };

    const handleUpdate = async (confirmed) => {
        if (!selectedComplaint) return;
        if (selectedComplaint.status !== 'Pending' && selectedComplaint.status !== null) {
            alert(`This complaint has already been ${selectedComplaint.status} by admin and cannot be edited.`);
            setSelectedComplaint(null);
            setUpdatedComplaintText('');
            fetchTenantComplaints(tenantId);
            return;
        }

        if (confirmed) {
            try {
                const response = await fetch(`https://tenantportal-backend.onrender.com/api/tenant/complaints/${selectedComplaint.complaint_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ complaintText: updatedComplaintText }),
                });

                if (response.ok) {
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                        setShowSuccessMessage(false);
                        setSelectedComplaint(null);
                        setUpdatedComplaintText('');
                        fetchTenantComplaints(tenantId);
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update complaint: ${errorData.message || 'An error occurred'}`);
                }
            } catch (error) {
                console.error('Error updating complaint:', error);
                alert('Failed to update complaint. Please try again.');
            } finally {
                setShowConfirmation(false);
            }
        } else {
            setShowConfirmation(false);
        }
    };

    const handleConfirmEdit = () => {
        setShowConfirmation(true);
    };

    if (loading) {
        return <div>Loading your complaints...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const editableComplaints = complaints.filter(
        (item) => item.status === 'Pending' || item.status === null
    );

    return (
        <div
            className="edit-complaints-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <Link to="/submitcomplaints" className="back-button top-left">&#x2B05; Back</Link>
            <h1>Edit Your Complaints</h1>
            <div className="tenant-info-box">
                <p>👤 {fullName}</p>
                <p>🏢 Apartment ID: {apartmentId}</p>
            </div>

            <p className="edit-complaints-disclaimer">
                ⚠️ Please note: Complaints can only be edited while they are pending. Once an admin has attended to or declined a complaint, it can no longer be modified.
            </p>

            {editableComplaints.length > 0 ? (
                <div className="complaint-list">
                    {editableComplaints.map((item) => (
                        <div key={item.complaint_id} className="complaint-card">
                            <p><strong>Date Filed:</strong> {new Date(item.submitted_at).toLocaleDateString()}</p>
                            <p><strong>Complaint:</strong> {item.complaint_text}</p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span className={`status-${item.status ? item.status.toLowerCase() : 'pending'}`}>
                                    {item.status || 'Pending'}
                                </span>
                            </p>
                            {item.admin_message && (
                                <p><strong>Admin Message:</strong> {item.admin_message}</p>
                            )}
                            <button onClick={() => handleSelect(item)}>✏️ Edit</button>
                            <button onClick={() => handleDeleteClick(item.complaint_id)} style={{ marginLeft: '8px', background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Delete</button>
            {deleteTargetId && (
                <div className="edit-complaint-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <p className="text-2xl font-bold text-red-600 mb-4">Delete Complaint?</p>
                        <p className="text-lg text-gray-700 mb-4">Are you sure you want to delete this complaint?</p>
                        <div className="flex gap-4">
                            <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Yes, Delete</button>
                            <button onClick={handleDeleteCancel} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-editable-complaints-message">
                    No pending complaints found that can be edited.
                </p>
            )}

            {selectedComplaint && (
                <div className="edit-box">
                    <h2>Edit Complaint</h2>
                    {(selectedComplaint.status === 'Pending' || selectedComplaint.status === null) ? (
                        <>
                            <p><strong>Complaint:</strong></p>
                            <textarea
                                rows="5"
                                value={updatedComplaintText}
                                onChange={(e) => setUpdatedComplaintText(e.target.value)}
                            />
                            <div className="edit-actions">
                                <button onClick={handleConfirmEdit}>Update Complaint</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Complaint:</strong> {selectedComplaint ? selectedComplaint.complaint_text : ''}</p>
                            <p><strong>Status:</strong> {selectedComplaint ? selectedComplaint.status || 'Pending' : ''}</p>
                            {selectedComplaint && selectedComplaint.admin_message && (
                                <p><strong>Admin Message:</strong> {selectedComplaint.admin_message}</p>
                            )}
                            <p className="cannot-edit-message">This complaint cannot be edited.</p>
                            <button onClick={handleCancelEdit}>Close</button>
                        </>
                    )}
                </div>
            )}

            {showSuccessMessage && (
                <div className="edit-complaint-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <p className="text-2xl font-bold text-green-600 mb-4">Complaint Updated!</p>
                        <p className="text-lg text-gray-700">Your complaint has been successfully updated.</p>
                    </div>
                </div>
            )}
            {showDeleteMessage && (
                <div className="edit-complaint-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <p className="text-2xl font-bold text-red-600 mb-4">Complaint Deleted!</p>
                        <p className="text-lg text-gray-700">Your complaint has been successfully deleted.</p>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <div className="edit-complaint-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <div className="confirm-edit-header">
                            <p className="confirm-edit-title">Confirm Edit:</p>
                        </div>
                        <p className="text-lg text-gray-700 mb-4">Are you sure you want to submit the edit?</p>
                        <div className="flex gap-4">
                            <button onClick={() => handleUpdate(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Yes, Update
                            </button>
                            <button onClick={() => handleUpdate(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditComplaints;