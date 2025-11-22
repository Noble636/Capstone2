import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-dashboard-container">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="home-bg-image" />
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>
      <div className="admin-dashboard-box">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-dashboard-nav">
          <Link to="/admin-complaints" className="admin-dashboard-button">
            View Complaints
          </Link>
          <Link to="/admin-visitors" className="admin-dashboard-button">
            View Visitor Logs
          </Link>
          <Link to="/admin-edit-rental" className="admin-dashboard-button">
            Edit Rental Information
          </Link>
          <Link to="/admin-manage-accounts" className="admin-dashboard-button">
            Manage Tenant Accounts
          </Link>
          <Link to="/admin-edit-account" className="admin-edit-account-button">
            Edit Account
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
