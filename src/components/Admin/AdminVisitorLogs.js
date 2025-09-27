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
            const response = await fetch('http://localhost:5000/api/admin/visitor-logs');
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
        <div
            className="admin-visitor-logs-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
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
                            <div
                                key={log.log_id}
                                className="admin-visitor-log-item"
                                onClick={() => handleToggleExpand(log.log_id)}
                            >
                                <div className="admin-visitor-log-summary">
                                    <p><strong>Tenant Owner:</strong> {log.unit_owner_name}</p>
                                    <p><strong>Apartment Identification:</strong> {log.apartment_id}</p>
                                    <p><strong>Date of Visit:</strong> {formatDate(log.visit_date)}</p>
                                    <p><strong>Time In:</strong> {log.time_in}</p>
                                </div>
                                {expandedLog === log.log_id && (
                                    <div className="admin-visitor-details">
                                        <p><strong>Visitor(s):</strong> {log.visitor_names}</p>
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