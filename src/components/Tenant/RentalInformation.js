import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/RentalInformation.css';

const RentalInformation = () => {
  return (
    <div className="rental-info-container">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="rental-bg-image" />
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>
      <div className="rental-info-main-box">
        <h1 className="rental-info-title">Rental Information</h1>
        <div className="rental-info-buttons">
          <div className="rental-info-btn-tooltip-wrapper">
            <Link to="/rental-agreement" className="home-animated-btn">
              Rental Agreement
            </Link>
            <span className="rental-info-btn-tooltip-below">View your rental agreement</span>
          </div>
          <div className="rental-info-btn-tooltip-wrapper">
            <Link to="/rental-confirmation" className="home-animated-btn">
              Rental Confirmation Statement
            </Link>
            <span className="rental-info-btn-tooltip-below">View your rental confirmation statement</span>
          </div>
        </div>
      </div>
      <div className="rental-info-home-btn-wrapper">
        <Link to="/" className="home-animated-btn rental-info-home-btn">Home</Link>
      </div>
    </div>
  );
};

export default RentalInformation;