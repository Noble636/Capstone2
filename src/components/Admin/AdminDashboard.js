import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div
      className="admin-dashboard-container"
      style={{
        backgroundImage: "url('/Background/Background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e0c23d"
      }}
    >
      <div className="admin-dashboard-box">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-dashboard-nav">
          <Link to="/admin-complaints" className="admin-dashboard-button">
            View Complaints
          </Link>
          <Link to="/admin-visitors" className="admin-dashboard-button">
            View Visitor Logs
          </Link>
          <Link to="/admin-manage-accounts" className="admin-dashboard-button">
            Manage Tenant Accounts
          </Link>
        </div>
        
        <button onClick={handleLogout} className="admin-dashboard-logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
