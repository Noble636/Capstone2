import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/RentalConfirmation.css';

const RentalConfirmation = () => {
  return (
    <div className="rental-confirmation-container">
      <h1>RENTAL CONFIRMATION STATEMENT</h1>

      <div className="confirmation-form">
        <p>
          I, <input type="text" placeholder="Your Name" readOnly /> confirm that I will lease the room{' '}
          <input type="text" placeholder="Room Number" readOnly />. I understand the terms and conditions of the rental agreement and accept to be bound by the following:
        </p>

        <h3>Compliance with Agreement</h3>
        <p>
          I will comply with all the rules, regulations, and terms in the rental agreement, including but not limited to those for payments, maintenance, and occupation.
        </p>

        <h3>Responsibility for Actions</h3>
        <p>
          I accept that I am entirely responsible for my actions, together with those of any visitor or guest that I invite onto the property. I will see that they adhere to the rules and act respectfully.
        </p>

        <h3>Caretakers and Maintenance</h3>
        <p>
          I will report any problem or concern about the premises to the caretakers or maintenance staff immediately. I know that if the caretaker is not informed of urgent issues, this may lead to penalties.
        </p>

        <h3>Room Condition</h3>
        <p>
          I will keep the room and common areas in good condition, and I will make no changes to the unit (e.g., painting, drilling) without permission in writing from the landlord.
        </p>

        <h3>Notice of Visitors/Guests</h3>
        <p>
          I will provide the landlord or caretaker with prior notice if I intend to have overnight guests, and give the needed information of my visitors for the security purpose. As set forth in the agreement, and I am aware that unauthorized visits or frequent visits by guests may constitute a breach of the rental agreement.
        </p>

        <h3>Termination of Agreement</h3>
        <p>
          I recognize that if I fail to abide by the terms of the rental agreement, the lease may be terminated, and I shall be removed from the property.
        </p>

        <p>
          By signing below, I confirm that I have read, understood, and accept the above terms and take on all the responsibilities of renting the room.
        </p>

        <div className="signature-section">
          <p>Signature: <input type="text" placeholder="Your Signature" readOnly /></p>
          <p>Printed Name: <input type="text" placeholder="Your Printed Name" readOnly /></p>
          <p>Date: <input type="date" readOnly /></p>
        </div>
      </div>

      <div className="button-container">
        <Link to="/rental-info" className="back-button">&#x2B05; Back</Link>
      </div>
    </div>
  );
};

export default RentalConfirmation;