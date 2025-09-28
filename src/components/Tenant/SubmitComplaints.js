import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../css/Tenant/SubmitComplaints.css';

const SubmitComplaints = () => {
    const [tenantId, setTenantId] = useState(null);
    const [fullName, setFullName] = useState("");
    const [apartmentId, setApartmentId] = useState("");
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        const storedFullName = localStorage.getItem('fullName');
        const storedApartmentId = localStorage.getItem('apartmentId');

        if (storedTenantId) {
            setTenantId(storedTenantId);
        }
        if (storedFullName) {
            setFullName(storedFullName);
        }
        if (storedApartmentId) {
            setApartmentId(storedApartmentId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting complaint...");
        console.log("Tenant ID:", tenantId);
        console.log("Complaint:", complaint);
        console.log("Date:", date);

        if (!tenantId) {
            alert("Tenant information not available. Please log in again.");
            return;
        }

        try {
            const response = await fetch('https://tenantportal-backend.onrender.com/api/tenant/submit-complaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantId: parseInt(tenantId),
                    complaint: complaint,
                    date: date,
                }),
            });

            console.log("Response:", response);
            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setShowMessage(true);
                setTimeout(() => {
                    setComplaint("");
                    setDate("");
                    setShowMessage(false);
                }, 2000);
            } else {
                console.error('Complaint submission failed:', data.message || 'An error occurred');
                alert(`Complaint submission failed: ${data.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        }
    };

    return (
        <div
            className="submit-complaint-container"
            style={{
                backgroundImage: "url('/Background/Background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e0c23d"
            }}
        >
            <h1>Submit a Complaint</h1>
            <div className="submit-complaint-content">
                <form onSubmit={handleSubmit} className="submit-complaint-form-container">
                    <textarea
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        placeholder="Enter your complaint here..."
                        rows="6"
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit">Submit Complaint</button>
                </form>
                <div className="right-side-info">
                    <aside className="tenant-info-box-right">
                        <p>👤 {fullName}</p>
                        <p>🏢 Apartment ID: {apartmentId}</p>
                    </aside>
                    <aside className="submit-complaint-reminder-right">
                        <p>⚠️ Important:</p>
                        <ul>
                            <li>Your complaint will be associated with your account.</li>
                            <li>Please provide a clear and concise description of your issue.</li>
                        </ul>
                    </aside>
                </div>
            </div>

            <div className="submit-complaint-actions-box">
                <div className="submit-complaint-actions">
                    <Link to="/tenant-dashboard" className="submit-complaint-home-button">
                        <span>&#x2B05;</span> Back
                    </Link>
                    <Link to="/editcomplaints" className="submit-complaint-home-button">
                        <span>✏️</span> Edit Complaints
                    </Link>
                    <Link to="/complaint-status" className="submit-complaint-home-button" style={{ marginTop: '10px' }}>
                        <span>📄</span> Complaint Status
                    </Link>
                </div>
            </div>

            {showMessage && (
                <div className="submit-complaint-message-box fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <p className="text-2xl font-bold text-green-600 mb-4">Complaint Submitted!</p>
                        <p className="text-lg text-gray-700">Your complaint has been successfully recorded.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmitComplaints;