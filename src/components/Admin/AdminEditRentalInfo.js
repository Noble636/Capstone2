import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminEditRentalInfo.css';

const defaultAgreementHtml = `
<h1 class="agreement-title">RENTAL AGREEMENT</h1>
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
  <li><strong>Note:</strong> For security purposes, the property is equipped with CCTV. All tenants are required to input the names of their visitors into the system or notify the Owner/Caretaker. This information will be used to verify visitors seen on CCTV and maintain accurate visitor logs for the safety of all residents.</li>
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
`;

const defaultConfirmationHtml = `
<h1>Rental Confirmation</h1>
<p>This is to confirm the rental agreement between the parties listed below.</p>
<p>Landlord: ____________________________</p>
<p>Tenant: ____________________________</p>
<p>Property Address: ____________________________</p>
<p>Lease Start Date: ____________________________</p>
<p>Lease End Date: ____________________________</p>
<p>Monthly Rent: ____________________________</p>
<p>Security Deposit: ____________________________</p>
<p>Both parties agree to the terms and conditions set forth in the signed rental agreement.</p>
<p>Landlord Signature: ____________________________ Date: ____________<br />
Tenant Signature: _____________________________ Date: ____________</p>
`;

const AdminEditRentalInfo = () => {
    const navigate = useNavigate();
    const [agreementHtml, setAgreementHtml] = useState('');
    const [confirmationHtml, setConfirmationHtml] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalMode, setModalMode] = useState('notice');

    useEffect(() => {
        const a = localStorage.getItem('rentalAgreementHtml');
        const c = localStorage.getItem('rentalConfirmationHtml');
        setAgreementHtml(a !== null && a !== '' ? a : defaultAgreementHtml);
        setConfirmationHtml(c !== null && c !== '' ? c : defaultConfirmationHtml);
    }, []);

    const handleSave = () => {
        localStorage.setItem('rentalAgreementHtml', agreementHtml);
        localStorage.setItem('rentalConfirmationHtml', confirmationHtml);
        setModalMode('notice');
        setModalText('Saved locally. Tenant pages will use this content if available.');
        setModalVisible(true);
    };

    const handleRevert = () => {
        setModalMode('confirm');
        setModalText('Revert to defaults? This will remove saved rental agreement and confirmation content.');
        setModalVisible(true);
    };

    const doRevertConfirmed = () => {
        localStorage.removeItem('rentalAgreementHtml');
        localStorage.removeItem('rentalConfirmationHtml');
        setAgreementHtml(defaultAgreementHtml);
        setConfirmationHtml(defaultConfirmationHtml);
        setModalMode('notice');
        setModalText('Reverted to default content. Tenants will now see the original agreement/confirmation.');
        setModalVisible(true);
    };

    return (
        <div className="admin-edit-rental-page">
            {/* Background elements */}
            <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="admin-edit-rental-bg-image" />
            <div className="bubble b1" />
            <div className="bubble b2" />
            <div className="bubble b3" />
            <div className="bubble b4" />
            <div className="bubble b5" />
            <div className="bubble b6" />
            <div className="bubble b7" />
            <div className="bubble b8" />

            <div className="admin-edit-rental-wrapper">
                <div className="admin-edit-rental-panel">
                    <h2>Edit Rental Information (Admin)</h2>
                    <p style={{ maxWidth: 800 }}>
                        Update the text that appears on the Rental Agreement and Rental Confirmation pages below. Click Save to store your changes so the rental pages display the updated content. Use "Revert to Default" to restore the original text.
                    </p>

                    <div className="admin-edit-columns">
                        {/* Rental Agreement Column */}
                        <div className="admin-column">
                            <h3>Rental Agreement</h3>
                            <textarea
                                className="admin-edit-textarea"
                                value={agreementHtml}
                                onChange={(e) => setAgreementHtml(e.target.value)}
                                rows={12}
                            />
                            <h4>Live Preview</h4>
                            <div className="admin-preview-box" dangerouslySetInnerHTML={{ __html: agreementHtml || '<em>No content yet</em>' }} />
                        </div>

                        {/* Rental Confirmation Column */}
                        <div className="admin-column">
                            <h3>Rental Confirmation</h3>
                            <textarea
                                className="admin-edit-textarea"
                                value={confirmationHtml}
                                onChange={(e) => setConfirmationHtml(e.target.value)}
                                rows={12}
                            />
                            <h4>Live Preview</h4>
                            <div className="admin-preview-box" dangerouslySetInnerHTML={{ __html: confirmationHtml || '<em>No content yet</em>' }} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: 18 }} className="admin-edit-actions">
                        <button onClick={handleSave} className="admin-edit-btn save">Save</button>
                        <button onClick={handleRevert} className="admin-edit-btn revert">Revert to Default</button>
                        <button onClick={() => navigate('/admin-dashboard')} className="admin-edit-btn back">Back</button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal">
                        <h3>{modalMode === 'confirm' ? 'Please Confirm' : 'Notice'}</h3>
                        <p>{modalText}</p>
                        <div style={{ textAlign: 'right', marginTop: 12 }}>
                            {modalMode === 'confirm' ? (
                                <>
                                    <button onClick={() => { setModalVisible(false); }} style={{ padding: '8px 14px', marginRight: 8 }} className="admin-edit-btn back">Cancel</button>
                                    <button onClick={() => doRevertConfirmed()} style={{ padding: '8px 14px' }} className="admin-edit-btn revert">Confirm Revert</button>
                                </>
                            ) : (
                                <button onClick={() => setModalVisible(false)} className="admin-edit-btn save">OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEditRentalInfo;