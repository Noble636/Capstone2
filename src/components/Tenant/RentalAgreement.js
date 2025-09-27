import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Tenant/RentalAgreement.css';

const RentalAgreement = () => {
  return (
    <div className="rental-agreement-container">
      <h1 className="agreement-title">RENTAL AGREEMENT</h1>
      <div className="agreement-content">
        <p>This Rental Agreement ("Agreement") is entered into on this ___ day of __________, 20___, by and between:</p>

        <h3>Landlord Information:</h3>
        <p>Name: ___________________________________________<br />
        Address: ___________________________________________<br />
        Phone: ___________________ Email: ___________________</p>

        <h3>Tenant Information:</h3>
        <p>Name: ___________________________________________<br />
        Current Address: ____________________________________<br />
        Phone: ___________________ Email: ___________________</p>

        <h3>1. PREMISES</h3>
        <p>The Landlord hereby rents to the Tenant the residential premises situated at:<br />
        Property Address: ________________________________________________</p>

        <h3>2. LEASE TERM</h3>
        <p>The lease will begin on ____________________ and:<br />
        ☐ End on ____________________ (Fixed Lease)<br />
        ☐ Extend on a month-to-month basis (Month-to-Month Lease)</p>

        <h3>3. RENT PAYMENT</h3>
        <p>Monthly rent will be ____________, due on or prior to the ____ day of each month.<br />
        Methods of Payment Accepted: ___________________________________________</p>

        <h3>4. SECURITY DEPOSIT</h3>
        <p>1 Month Advance<br />
        1 Month Deposit<br />
        The Tenant will pay a security deposit of ___________ at signing. The deposit will be retained as security for damages, unpaid rent, or contractual breach, and returned within 30 days of lease termination after deductions.</p>

        <h3>5. UTILITIES</h3>
        <p>Unless otherwise stated, all utility services shall be paid for by the Tenant.<br />
        Special arrangements:<br />- Electricity<br />- Water</p>

        <h3>6. OCCUPANCY</h3>
        <p>Only the Tenant(s) named in this Agreement may occupy the premises. Subleasing is strictly forbidden without permission from the Landlord.</p>

        <h3>7. PET POLICY</h3>
        <p>Pets allowed with permission</p>

        <h3>8. UNIT INCLUSIONS</h3>
        <p>Every unit is supplied with the following standard fixtures and furniture:<br />
        - Air-conditioning unit<br />
        - Sink bowl<br />
        - Toilet and shower<br />
        - Bidet<br />
        - Table and chairs<br />
        - Bed frame and mattress (foam)<br />
        - Clothes hanging rod or rack</p>
        <p>These should be in good working condition. Any damage resulting from negligence or abuse shall be borne by the Tenant.</p>

        <h3>9. RULES AND REGULATIONS</h3>
        <p>Tenant shall comply with the following:</p>
        <ol>
          <li>Quiet Enjoyment: No excessive noise or disruptive action. Quiet time: 10:00 PM</li>
          <li>Cleanliness: Keep the unit and area clean and sanitary.</li>
          <li>Alterations: No alterations, painting, or drilling without the Landlord's consent.</li>
          <li>Smoking: Absolutely forbidden within the unit.</li>
          <li>Illegal Use: The Tenant is not to participate in any illicit use on the premises.</li>
          <li>Fire Hazards: No candles, firecrackers, or open fires within the unit.</li>
          <li>Parking: Only use designated parking spaces.</li>
          <li>Inspection: Landlord or caretaker can inspect the unit with 24 hours' notice (or immediately in case of emergency).</li>
          <li>Damage Responsibility: The Tenant will be responsible for any damage other than normal wear and tear.</li>
        </ol>

        <h4>Visitors/Guests:</h4>
        <ul>
          <li>Visitors are permitted between 7:00 AM and 11:00 PM.</li>
          <li>If a Tenant intends to have a guest overnight, they should inform the Owner or the Caretaker beforehand.</li>
          <li>Tenant must give the information of the visitor for security of the other tenants.</li>
          <li>Overnight visitors are restricted to 7 consecutive unless permission is granted.</li>
          <li>Tenants will be entirely responsible for the actions, behavior, and damages created by their overnight guests.</li>
          <li>Not informing or seeking permission for overnight guests could be treated as a breach of this Agreement and could lead to penalties or cancellation of the lease.</li>
        </ul>

        <h4>Caretakers & Maintenance Staff:</h4>
        <ul>
          <li>Tenants should be respectful of the caretakers assigned to the property.</li>
          <li>All issues, complaints, or repair requests should be reported to the caretakers respectfully and with proper notice.</li>
          <li>We have an on call maintenance staff who will address repairs or issues regarding provided amenities (e.g., air conditioner, toilet, sink, shower, furniture).</li>
          <li>Tenants should provide access at scheduled times for purposes of maintenance. Unjustified denial of access may attract penalty or action on lease.</li>
        </ul>

        <h3>10. TERMINATION</h3>
        <p>This Agreement can be terminated by either party with a written notice of not less than ____ days. On termination, Tenant shall vacate the premises and hand over all keys and items.</p>

        <p>Landlord Signature: ____________________________ Date: ____________<br />
        Tenant Signature: _____________________________ Date: ____________</p>
      </div>

      <div className="back-button-container">
        <Link to="/rental-info" className="back-button">&#x2B05; Back</Link>
      </div>
    </div>
  );
};

export default RentalAgreement;