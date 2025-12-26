import React, { useState } from 'react';
import '../../css/Admin/AvailableUnit.css';

const AvailableUnit = () => {
  const [unitName, setUnitName] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);

    // Preview
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

    try {
      const res = await fetch('/api/admin/available-units', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Unit posted successfully!');
        setUnitName('');
        setImages([]);
        setPreviewUrls([]);
        setDescription('');
      } else {
        setFeedback(data.message || 'Failed to post unit.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="admin-available-unit-container">
      <h2>Post Available Unit</h2>
      <form className="admin-available-unit-form" onSubmit={handleSubmit}>
        <label className="admin-label">
          Unit Name<span style={{ color: 'red' }}>*</span>:
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
            <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="admin-image-preview" />
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
        <button type="submit" className="admin-submit-btn" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Unit'}
        </button>
        {feedback && <div className="admin-feedback">{feedback}</div>}
      </form>
    </div>
  );
};

export default AvailableUnit;