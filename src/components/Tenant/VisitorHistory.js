import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/VisitorHistory.css';

const VisitorHistory = () => {
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTimeOut, setEditingTimeOut] = useState(null); // log_id being edited
    const [timeOuts, setTimeOuts] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) {
            setError('No tenant ID found. Please log in again.');
            setLoading(false);
            return;
        }
        fetch(`https://tenantportal-backend.onrender.com/api/tenant/visitor-logs/${tenantId}`)
            .then(res => res.json())
            .then(data => {
                setVisitorLogs(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load visitor logs.');
                setLoading(false);
            });
    }, []);

    const handleTimeOutChange = (logId, value) => {
        setTimeOuts(prev => ({ ...prev, [logId]: value }));
    };

    const handleTimeOutSubmit = async (logId) => {
        const timeOut = timeOuts[logId];
        if (!timeOut) return;
        try {
            const res = await fetch(`https://tenantportal-backend.onrender.com/api/tenant/visitor-logs/${logId}/timeout`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeOut })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Time out updated successfully.');
                setMessageType('success');
                setVisitorLogs(logs => logs.map(log => log.log_id === logId ? { ...log, time_out: timeOut } : log));
                setEditingTimeOut(null);
            } else {
                setMessage(data.message || 'Failed to update time out.');
                setMessageType('error');
            }
        } catch {
            setMessage('Failed to update time out.');
            setMessageType('error');
        }
    };

    return (
        <div className="visitor-history-page-container home-container">
            <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="home-bg-image" />
            <div className="bubble b1"></div>
            <div className="bubble b2"></div>
            <div className="bubble b3"></div>
            <div className="bubble b4"></div>
            <div className="bubble b5"></div>
            <div className="bubble b6"></div>
            <div className="bubble b7"></div>
            <div className="bubble b8"></div>
            <h1>Visitor History</h1>
            <div className="visitor-history-note" style={{ marginBottom: 12, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 6, padding: 12 }}>
                <b>Note:</b> This is your visitor history. This information is secured and only visible to your account. Other users cannot see your visitor logs.
            </div>
            <div style={{ marginBottom: 12, color: "#333" }}>
                You can set a time out for your visitors in the Visitor History below.
            </div>
            <div className="visitor-history-content-wrapper">
                {loading ? (
                    <p>Loading visitor logs...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : visitorLogs.length === 0 ? (
                    <p>No visitor logs found.</p>
                ) : (
                    <table className="visitor-history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Visitor Name(s)</th>
                                <th>Purpose</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitorLogs.map(log => (
                                <tr key={log.log_id}>
                                    <td>{log.visit_date}</td>
                                    <td>{log.visitor_names}</td>
                                    <td>{log.purpose}</td>
                                    <td>{log.time_in}</td>
                                    <td>
                                        {log.time_out ? (
                                            log.time_out
                                        ) : editingTimeOut === log.log_id ? (
                                            <input
                                                type="time"
                                                value={timeOuts[log.log_id] || ''}
                                                onChange={e => handleTimeOutChange(log.log_id, e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            <span style={{ color: "#888" }}>--:--</span>
                                        )}
                                    </td>
                                    <td>
                                        {!log.time_out && (
                                            editingTimeOut === log.log_id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleTimeOutSubmit(log.log_id)}
                                                        className="visitor-history-timeout-btn"
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingTimeOut(null)}
                                                        className="visitor-history-timeout-btn"
                                                        style={{ background: "#ccc", color: "#333" }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingTimeOut(log.log_id)}
                                                    className="visitor-history-timeout-btn"
                                                >
                                                    Set Time Out
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {message && (
                    <div className={`visitor-history-message ${messageType}`}>{message}</div>
                )}
            </div>
            <Link to="/submitvisitors" className="submit-visitor-home-button" style={{ marginTop: 24 }}>&#x2B05; Back</Link>
        </div>
    );
};

export default VisitorHistory;