import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Tenant/TenantDashboard.css';

const TenantDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleEditAccount = () => {
    navigate('/editaccount');
  };

  return (
    <div
        className="tenant-dashboard-container"
        style={{
            backgroundImage: "url('/Background/Background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#e0c23d"
        }}
    >
        <div className="tenant-dashboard-box">
            <h1>Tenant Dashboard</h1>
            <div className="tenant-dashboard-nav">
                <Link to="/submitcomplaints" className="tenant-dashboard-link">Complaints</Link>
                <Link to="/submitvisitors" className="tenant-dashboard-link">Submit Visitor Information</Link>
                <button className="tenant-dashboard-edit-account-button" onClick={handleEditAccount}>✏️ Edit Account</button>
            </div>
            <button className="tenant-dashboard-logout-button" onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
};

export default TenantDashboard;