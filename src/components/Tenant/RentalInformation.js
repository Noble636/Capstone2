import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/RentalInformation.css';


const RentalInformation = () => {
  return (
    <div className="rental-info-container">
      <div className="rental-info-main-box">
        <h1 className="rental-info-title">Rental Information</h1>
        <div className="rental-info-buttons">
          <Link to="/rental-agreement" className="home-animated-btn">Rental Agreement</Link>
          <Link to="/rental-confirmation" className="home-animated-btn">Rental Confirmation Statement</Link>
          <Link to="/" className="home-animated-btn">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default RentalInformation;