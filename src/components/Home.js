import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const apartmentImages = [
  { src: '/Homepage images/Apartment 1.jpg', label: 'Apartment 1' },
  { src: '/Homepage images/Apartment 2.jpg', label: 'Apartment 2' },
  { src: '/Homepage images/Apartment 3.jpg', label: 'Apartment 3' },
  { src: '/Homepage images/Apartment 4.jpg', label: 'Apartment 4' },
  { src: process.env.PUBLIC_URL + '/Homepage images/Apartment 5.jpg', label: 'Apartment 5' },
  { src: process.env.PUBLIC_URL + '/Homepage images/Apartment 6.jpg', label: 'Apartment 6' },
];

const isMobilePhone = () => {
  const ua = navigator.userAgent;
  const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTabletUA = /iPad|Tablet|PlayBook|Silk/i.test(ua);
  const isSmallScreen = window.innerWidth <= 700;
  return isMobileUA && !isTabletUA && isSmallScreen;
};

const Home = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx(idx => (idx + 1) % apartmentImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMobilePhone()) {
      setShowMobilePopup(true);
    }
  }, []);

  const currentApartment = apartmentImages[currentIdx];

  return (
    <div className="home-container">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="home-bg-image" />

      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>

      {showMobilePopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(120deg, #ffb347 0%, #ff9a9e 40%, #fad0c4 70%, #b084cc 100%)',
            borderRadius: 20,
            padding: '32px 20px 24px 20px',
            maxWidth: 320,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(44,62,80,0.18)',
            position: 'relative',
            border: '2px solid #fff'
          }}>
            <button
              onClick={() => setShowMobilePopup(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 14,
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                color: '#181818',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{
              marginBottom: 14,
              color: '#181818',
              fontWeight: 900,
              letterSpacing: 1,
              textShadow: '2px 4px 16px #b084cc88, 0 2px 8px #fad0c488'
            }}>
              Try Our Mobile Version!
            </h2>
            <p style={{
              color: '#333',
              fontWeight: 500,
              marginBottom: 18,
              fontSize: 16
            }}>
              You're trying to open the web version.<br />
              We also have a mobile version that you can try for ease of access on your device.
            </p>
            <button
              onClick={() => { window.location.href = "https://apartmentmaintenancemobile.vercel.app"; }}
              style={{
                width: '100%',
                margin: '8px auto 0 auto',
                padding: '14px 0',
                background: '#2d98da',
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(44,62,80,0.12)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              apartmentmaintenancemobile.vercel.app
            </button>
          </div>
        </div>
      )}

      <div className="home-content-wrapper">
        <div className="home-left">
          <h1 className="home-main-title">Apartment Maintenance</h1>
          <p className="home-subtitle home-subtitle-separate">Web-based Tenant Complaint and Security Management System</p>
          <div className="home-nav">
            <div className="home-btn-row">
              <Link to="/about" className="home-animated-btn">About</Link>
              <Link to="/privacy-policy" className="home-animated-btn">Privacy Policy</Link>
              <Link to="/contact-us" className="home-animated-btn">Contact Us</Link>
            </div>
            <div className="home-btn-row">
              <Link to="/rental-info" className="home-animated-btn">Rental Information</Link>
              <Link to="/admin-login" className="home-animated-btn">Admin Login</Link>
              <Link to="/tenant-login" className="home-animated-btn">Tenant Login</Link>
            </div>
          </div>
        </div>
        <div className="home-right-frame">
          <img src={currentApartment.src} alt={currentApartment.label} className="home-apartment-img-full" />
        </div>
      </div>
    </div>
  );
};

export default Home;