import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Admin/AvailableUnit.css';

const AvailableUnit = () => {
  const [unitName, setUnitName] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unitName.trim()) {
      setFeedback('Unit name is required.');
      return;
    }
    setSubmitting(true);
    setFeedback('');

    const formData = new FormData();
    formData.append('unitName', unitName);
    images.forEach((img) => formData.append('images', img));
    formData.append('description', description);
    formData.append('price', price);

    try {
      const res = await fetch('https://tenantportal-backend.onrender.com/api/admin/available-units', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Unit posted successfully!');
        setUnitName('');
        setImages([]);
        setPreviewUrls([]);
        setDescription('');
        setPrice('');
      } else {
        setFeedback(data.message || 'Failed to post unit.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="availableunit-bg">
      <img src={process.env.PUBLIC_URL + '/Background/GB.png'} alt="Background" className="availableunit-bg-image" />
      <div className="availableunit-bubble b1"></div>
      <div className="availableunit-bubble b2"></div>
      <div className="availableunit-bubble b3"></div>
      <div className="availableunit-bubble b4"></div>
      <div className="availableunit-bubble b5"></div>
      <div className="availableunit-bubble b6"></div>
      <div className="availableunit-bubble b7"></div>
      <div className="availableunit-bubble b8"></div>
      <div className="main-center-wrapper">
        <div className="admin-available-unit-container">
          <h1 className="admin-available-unit-title">Post Available Unit</h1>
          <div className="admin-available-unit-actions" style={{ marginBottom: 18, justifyContent: 'center' }}>
            <Link to="/admin-dashboard" className="admin-available-unit-btn back-btn">
              <span>&#x2B05;</span> Back
            </Link>
            <Link to="/admin-inbox" className="admin-available-unit-btn messages-btn">
              <span role="img" aria-label="messages" style={{ fontSize: '1.2em', marginRight: 8, verticalAlign: 'middle' }}>💬</span>
              Messages & Posting
            </Link>
            <Link to="/admin-reservations" className="admin-available-unit-btn reservations-btn">
              <span>📋</span> Reservations
            </Link>
          </div>
          <p className="admin-available-unit-note" style={{ textAlign: 'center' }}>
            <em>
              You can post available apartment rooms, units, or spaces here. Tenants will see these listings and can send inquiries or reservation requests.
            </em>
          </p>
          <div className="admin-available-unit-content">
            <form className="admin-available-unit-form" onSubmit={handleSubmit}>
              <label className="admin-label" style={{ position: 'relative' }}>
                Unit Name <span style={{ color: 'red', marginLeft: 2 }}>*</span>
                <input
                  type="text"
                  value={unitName}
                  onChange={e => setUnitName(e.target.value)}
                  required
                  disabled={submitting}
                  className="admin-unit-name-input"
                  placeholder="Enter unit name"
                  style={{ marginTop: 8 }}
                />
              </label>
              <label className="admin-label">
                Upload Images (max 5):
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={submitting}
                  style={{ marginTop: 8 }}
                />
              </label>
              <div className="admin-image-preview-list">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="admin-preview-item">
                    <img src={url} alt={`Preview ${idx + 1}`} className="admin-image-preview" />
                    <button
                      type="button"
                      className="admin-remove-btn"
                      onClick={() => {
                        setImages(prev => prev.filter((_, i) => i !== idx));
                        setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
                      }}
                      tabIndex={-1}
                    >×</button>
                  </div>
                ))}
              </div>
              <label className="admin-label">
                Description (optional):
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter unit description..."
                  className="admin-desc-textarea"
                  disabled={submitting}
                />
              </label>
              <label className="admin-label">
                Price (₱)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  disabled={submitting}
                  className="admin-unit-name-input"
                  placeholder="Enter price"
                  style={{ marginTop: 8 }}
                />
              </label>
              <button type="submit" className="admin-submit-btn" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Unit'}
              </button>
              {feedback && <div className="admin-feedback">{feedback}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableUnit;

