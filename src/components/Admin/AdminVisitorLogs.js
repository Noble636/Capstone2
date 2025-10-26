import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminVisitorLogs.css';

const AdminVisitorLogs = () => {
    const navigate = useNavigate();
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [expandedLog, setExpandedLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVisitorLogs();
    }, []);

    const fetchVisitorLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/visitor-logs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVisitorLogs(data);
        } catch (e) {
            console.error("Error fetching visitor logs:", e);
            setError("Failed to load visitor logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedLog(expandedLog === id ? null : id);
    };

    const handleBack = () => {
        navigate('/admin-dashboard');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return <p>Loading visitor logs...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

            return (
                <div className="admin-visitor-logs-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)', animation: 'admin-dashboard-bg-move 12s ease-in-out infinite alternate' }}>
                    <img src="/Background/GB.png" alt="Background" className="home-bg-image" />
                    <div className="bubble b1" />
                    <div className="bubble b2" />
                    <div className="bubble b3" />
                    <div className="bubble b4" />
                    <div className="bubble b5" />
                    <div className="bubble b6" />
                    <div className="bubble b7" />
                    <div className="bubble b8" />
                    <div className="admin-visitor-logs-box">
                        <h1>Admin Visitor Logs</h1>
                        <button className="back_to_dashboard_visitor_logs_button" onClick={handleBack}>
                            <span style={{ fontSize: '1.5rem' }}>🏠</span> Back to Dashboard
                        </button>
                        <div className="admin-visitor-logs-list">
                            <h2>Visitor Logs</h2>
                            {visitorLogs.length === 0 ? (
                                <p>No visitor logs found.</p>
                            ) : (
                                visitorLogs.map((log) => (
                                    <div key={log.log_id} className="admin-visitor-log-item" onClick={() => handleToggleExpand(log.log_id)}>
                                        <div className="admin-visitor-log-summary">
                                            <p><strong>Tenant Owner:</strong> {log.unit_owner_name}</p>
                                            <p><strong>Apartment Identification:</strong> {log.apartment_id}</p>
                                            <p><strong>Purpose:</strong> {log.purpose ? log.purpose : '—'}</p>
                                            <p><strong>Date of Visit:</strong> {formatDate(log.visit_date)}</p>
                                            <p><strong>Time In:</strong> {log.time_in}</p>
                                        </div>
                                        {expandedLog === log.log_id && (
                                            <div className="admin-visitor-details">
                                                <p><strong>Visitor(s):</strong> {log.visitor_names}</p>
                                                {log.purpose && <p><strong>Purpose:</strong> {log.purpose}</p>}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            );
};

export default AdminVisitorLogs;