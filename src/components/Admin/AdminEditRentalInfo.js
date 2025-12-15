import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminEditRentalInfo.css';

const AdminEditRentalInfo = () => {
    const navigate = useNavigate();
    const [agreementHtml, setAgreementHtml] = useState('');
    const [confirmationHtml, setConfirmationHtml] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalMode, setModalMode] = useState('notice');

    // Load content from local storage on mount
    useEffect(() => {
        const a = localStorage.getItem('rentalAgreementHtml') || '';
        const c = localStorage.getItem('rentalConfirmationHtml') || '';
        setAgreementHtml(a);
        setConfirmationHtml(c);
    }, []);

    // Function to handle saving the updated content
    const handleSave = () => {
        localStorage.setItem('rentalAgreementHtml', agreementHtml);
        localStorage.setItem('rentalConfirmationHtml', confirmationHtml);
        setModalMode('notice');
        setModalText('Saved locally. Tenant pages will use this content if available.');
        setModalVisible(true);
    };

    // Function to handle starting the revert confirmation process
    const handleRevert = () => {
        setModalMode('confirm');
        setModalText('Revert to defaults? This will remove saved rental agreement and confirmation content.');
        setModalVisible(true);
    };

    // Function to execute the revert action (after confirmation)
    const doRevertConfirmed = () => {
        localStorage.removeItem('rentalAgreementHtml');
        localStorage.removeItem('rentalConfirmationHtml');
        setAgreementHtml('');
        setConfirmationHtml('');
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