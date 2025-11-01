import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/ComplaintStatus.css';

const ComplaintStatus = () => {
    const [fullName, setFullName] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [complaints, setComplaints] = useState([]);
    const [expandedComplaint, setExpandedComplaint] = useState(null);
    const [lightboxSrc, setLightboxSrc] = useState(null);
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
            const response = await fetch(`https://tenantportal-backend.onrender.com/api/tenant/complaints?tenantId=${id}`);
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

    const openImage = (src) => {
        setLightboxSrc(src);
    };

    if (loading) {
        return <p>Loading your complaints...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="complaint-status-container cs-home-container">
            <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="cs-home-bg-image" />
            <div className="cs-bubble b1"></div>
            <div className="cs-bubble b2"></div>
            <div className="cs-bubble b3"></div>
            <div className="cs-bubble b4"></div>
            <div className="cs-bubble b5"></div>
            <div className="cs-bubble b6"></div>
            <div className="cs-bubble b7"></div>
            <div className="cs-bubble b8"></div>
            <Link to="/submitcomplaints" className="complaint-status-back-button">
                &#x2B05; Back
            </Link>
            <div className="complaint-status-card">
                <h1 className="complaint-status-title">View Complaint Status</h1>

                <div className="tenant-info-box">
                    <p>👤 {fullName}</p>
                    <p>🏢 Apartment ID: {apartmentId}</p>
                    <p style={{ marginTop: '8px', color: '#888', fontSize: '0.98rem' }}>
                        You can click on the complaint to view admin responses
                    </p>
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
                                    {(complaint.images || []).length > 0 && (
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                            {(complaint.images || []).map((img) => (
                                                <img key={img.image_id} src={img.dataUri} alt={img.filename || 'img'} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openImage(img.dataUri); }} />
                                            ))}
                                        </div>
                                    )}
                                    <p>
                                        <strong>Admin Message:</strong> {complaint.admin_message || 'No message provided yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {lightboxSrc && (
                    <div className="admin-image-lightbox" onClick={() => setLightboxSrc(null)}>
                        <div className="admin-image-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                            <img src={lightboxSrc} alt="enlarged" />
                            <button className="admin-image-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintStatus;