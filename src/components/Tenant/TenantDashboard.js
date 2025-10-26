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
  <div className="tenant-dashboard-container" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)', animation: 'admin-dashboard-bg-move 12s ease-in-out infinite alternate' }}>
    <img src="/Background/GB.png" alt="Background" className="home-bg-image" />
    <div className="bubble b1" />
    <div className="bubble b2" />
    <div className="bubble b3" />
    <div className="bubble b4" />
    <div className="bubble b5" />
    <div className="bubble b6" />
    <div className="bubble b7" />
    <div className="bubble b8" />
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