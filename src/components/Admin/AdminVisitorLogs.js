import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminVisitorLogs.css';

const AdminVisitorLogs = () => {
    const navigate = useNavigate();
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [expandedLog, setExpandedLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [tokenError, setTokenError] = useState('');
    const [exporting, setExporting] = useState(false);

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

    const handleExportLogs = async () => {
        setTokenError('');
        if (!tokenInput) {
            setTokenError('Token is required.');
            return;
        }
        setExporting(true);
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/export-visitor-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenInput}`
                },
                body: JSON.stringify({})
            });
            if (!response.ok) {
                throw new Error('Invalid token or error exporting logs.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Tenant_Visitor_Reports.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            alert('Visitor logs exported successfully.');
        } catch (err) {
            alert('Failed to export visitor logs.');
        } finally {
            setExporting(false);
            setShowExportModal(false);
        }
    };

    const handleExportSubmit = async (e) => {
        e.preventDefault();
        setTokenError('');
        if (!tokenInput) {
            setTokenError('Token is required.');
            return;
        }
        setExporting(true);
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/export-visitor-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenInput}`
                },
                body: JSON.stringify({})
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
            a.download = 'Tenant_Visitor_Reports.xlsx';
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

    // Get adminId from localStorage or context
    const adminId = localStorage.getItem('adminId'); // or however you store it

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
                <button
                    className="export-excel-btn"
                    style={{ marginBottom: '1rem' }}
                    onClick={() => setShowExportModal(true)}
                >
                    Generate Data Report
                </button>
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
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setTokenError('');
                                setExporting(true);
                                try {
                                    const response = await fetch('https://tenantportal-backend.onrender.com/api/admin/export-visitor-logs', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${tokenInput}`
                                        },
                                        body: JSON.stringify({ adminId }) // <-- send adminId here
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
                                    a.download = 'Tenant_Visitor_Reports.xlsx';
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
                            }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    <p><strong>Date of Visit:</strong> {formatDate(log.visit_date)}</p>
                                    <p><strong>Time In:</strong> {log.time_in}</p>
                                    <p><strong>Time Out:</strong> {log.time_out ? log.time_out : <span style={{color:'#888'}}>--:--</span>}</p>
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