import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/ComplaintStatus.css';

const ComplaintStatus = () => {
    const [fullName, setFullName] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [complaints, setComplaints] = useState([]);
    const [expandedComplaint, setExpandedComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        const storedFullName = localStorage.getItem('fullName');
        const storedApartmentId = localStorage.getItem('apartmentId');

        if (storedTenantId && storedFullName && storedApartmentId) {
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
            const response = await fetch(`http://localhost:5000/api/tenant/complaints?tenantId=${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setComplaints(data);
        } catch (e) {
            setError('Failed to fetch complaints.');
            console.error('Error fetching complaints:', e);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedComplaint(expandedComplaint === id ? null : id);
    };

    if (loading) {
        return <p>Loading your complaints...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div
            className="complaint-status-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <Link to="/submitcomplaints" className="complaint-status-back-button">
                &#x2B05; Back
            </Link>
            <div className="complaint-status-card">
                <h1 className="complaint-status-title">View Complaint Status</h1>

                <div className="tenant-info-box">
                    <p>👤 {fullName}</p>
                    <p>🏢 Apartment ID: {apartmentId}</p>
                </div>

                {complaints.length === 0 && (
                    <p className="complaint-status-no-results">
                        No complaints found for your account.
                    </p>
                )}

                <div className="complaint-status-list">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint.complaint_id}
                            className="complaint-status-item"
                            onClick={() => toggleExpand(complaint.complaint_id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className="complaint-status-item-info">
                                <strong>Date Filed:</strong> {new Date(complaint.submitted_at).toLocaleDateString()} -{' '}
                                <strong
                                    className={`complaint-status-status-${complaint.status ? complaint.status.toLowerCase() : 'pending'}`}
                                >
                                    Status: {complaint.status || 'Pending'}
                                </strong>
                            </p>
                            {expandedComplaint === complaint.complaint_id && (
                                <div className="complaint-status-details">
                                    <p>
                                        <strong>Complaint:</strong> {complaint.complaint_text}
                                    </p>
                                    <p>
                                        <strong>Admin Message:</strong> {complaint.admin_message || 'No message provided yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComplaintStatus;