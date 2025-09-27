import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/RentalInformation.css';

const RentalInformation = () => {
  return (
    <div
      className="rental-info-container"
      style={{
        backgroundImage: "url('/Background/Background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#e0c23d"
      }}
    >
      <div className="rental-info-main-box">
        <h1 className="rental-info-title">Rental Information:</h1>
        <div className="rental-info-buttons">
          <Link to="/rental-agreement" className="rental-button" data-description="View the complete Rental Agreement">
            Rental Agreement
          </Link>
          <Link to="/rental-confirmation" className="rental-button" data-description="Confirm your rental agreement terms">
            Rental Confirmation Statement
          </Link>
        </div>
      </div>
      <div className="home-button-container">
        <Link to="/" className="home-button" >
          Home
        </Link>
      </div>
    </div>
  );
};

export default RentalInformation;