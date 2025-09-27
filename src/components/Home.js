import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: "url('/Background/Background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e0c23d"
      }}
    >
      <div className="home-top-right">
        <Link to="/privacy-policy" className="top-right-button">Privacy Policy</Link>
        <Link to="/contact-us" className="top-right-button">Contact Us</Link>
      </div>

      <div className="home-title-box">
        <h1>Apartment Maintenance</h1>
        <p>Web-based Tenant Complaint and Security Management System</p>
      </div>

      <div className="home-nav">
        <Link to="/about">About</Link>
        <Link to="/admin-login" className="admin-login-button">
          Admin Login
        </Link>
        <Link to="/tenant-login" className="tenant-login-button">
          Tenant Login
        </Link>
        <Link to="/rental-info" className="rental-info-button">
          Rental Information
        </Link>
      </div>
    </div>
  );
};

export default Home;