import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/SubmitVisitors.css';

const VisitorLogs = () => {
    const [tenantId, setTenantId] = useState(null);
    const [fullName, setFullName] = useState("");
    const [apartmentId, setApartmentId] = useState("");
    const [visitorName, setVisitorName] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [timeIn, setTimeIn] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        const storedFullName = localStorage.getItem('fullName');
        const storedApartmentId = localStorage.getItem('apartmentId');

        if (storedTenantId) {
            setTenantId(storedTenantId);
            setFullName(storedFullName);
            setApartmentId(storedApartmentId);
        } else {
            setMessageText('Tenant information not found. Please log in.');
            setMessageType('error');
            setShowMessage(true);
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const hh = String(today.getHours()).padStart(2, '0');
        const min = String(today.getMinutes()).padStart(2, '0');

        setVisitDate(`${yyyy}-${mm}-${dd}`);
        setTimeIn(`${hh}:${min}`);
    }, []);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingVisitor, setPendingVisitor] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tenantId) {
            setMessageText("Tenant information not available. Please log in again.");
            setMessageType('error');
            setShowMessage(true);
            return;
        }
        setPendingVisitor({
            tenantId: parseInt(tenantId),
            fullName: fullName,
            apartmentId: apartmentId,
            visitorNames: visitorName,
            visitDate: visitDate,
            timeIn: timeIn,
        });
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmModal(false);
        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/submit-visitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pendingVisitor),
            });
            const data = await response.json();
            if (response.ok) {
                setMessageText(data.message || "Visitor log submitted successfully!");
                setMessageType('success');
                setShowMessage(true);
                setVisitorName("");
                const now = new Date();
                const hh = String(now.getHours()).padStart(2, '0');
                const min = String(now.getMinutes()).padStart(2, '0');
                setTimeIn(`${hh}:${min}`);
                setTimeout(() => {
                    setShowMessage(false);
                    setMessageText('');
                    setMessageType('');
                }, 1500);
            } else {
                setMessageText(data.message || "Failed to submit visitor log. Please try again.");
                setMessageType('error');
                setShowMessage(true);
            }
        } catch (error) {
            console.error('Error submitting visitor log:', error);
            setMessageText("An unexpected error occurred. Please try again later.");
            setMessageType('error');
            setShowMessage(true);
        }
    };

    return (
        <div
            className="submit-visitor-page-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <h1>Visitor Logs</h1>
            <div className="submit-visitor-content-wrapper">
                <form onSubmit={handleSubmit} className="submit-visitor-form-container">
                    <div className="tenant-info-display">
                        <p><strong>Unit Owner:</strong> {fullName}</p>
                        <p><strong>Apartment ID:</strong> {apartmentId}</p>
                    </div>

                    <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Visitor's Name/s (e.g., Name 1, Name 2)"
                        required
                    />
                    <p className="visitor-name-disclaimer">Use commas for multiple names (e.g., Name 1, Name 2, Name 3)</p>

                    <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => setTimeIn(e.target.value)}
                        placeholder="Time In (HH:MM)"
                        required
                    />
                    <button type="submit" className="submit-visitor-submit-button">Submit Log</button>
            {showConfirmModal && (
                <div className="submit-visitor-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="submit-visitor-confirm-modal flex flex-col items-center">
                        <p className="text-2xl font-bold text-yellow-600 mb-2">Confirm Visitor Info</p>
                        <div className="submit-visitor-confirm-note">Please double check and confirm the visitors information before submitting.<br/> <span style={{fontWeight:'normal',color:'#b52a37'}}>This cannot be edited later.</span></div>
                        <div className="submit-visitor-confirm-names">Visitor Name(s): <span>{pendingVisitor.visitorNames}</span></div>
                        <div className="flex gap-4">
                            <button onClick={handleConfirmSubmit} className="submit-visitor-confirm-btn">Confirm</button>
                            <button onClick={() => setShowConfirmModal(false)} className="submit-visitor-cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
                </form>
                <aside className="submit-visitor-disclaimer">
                    <p><strong>Important:</strong> This visitor data is confidential and will be securely stored, accessible only to authorized administrators. We are committed to protecting the privacy of your visitors' details in accordance with our privacy policy and the terms of your rental agreement regarding guests.</p>
                    <p>Please ensure all information provided is accurate and consistent with the&nbsp;</p>
                    <p><span className="submit-visitor-rental-agreement-highlight">"Visitor/Guest" policy outlined in your Rental Agreement</span>.</p>
                </aside>
            </div>
            <Link to="/tenant-dashboard" className="submit-visitor-home-button">&#x2B05; Back</Link>
            {showMessage && (
                <div className="submit-visitor-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-xl flex flex-col items-center ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="text-2xl font-bold mb-4">{messageText}</p>
                        {/* Removed the OK button */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorLogs;