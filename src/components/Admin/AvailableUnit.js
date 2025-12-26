import React, { useState } from 'react';
import '../../css/Admin/AvailableUnit.css';

const AvailableUnit = ({ adminId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);

    // Preview images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!title || !price) {
      setMessage('Title and price are required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('adminId', adminId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('specifications', specifications);
    formData.append('price', price);

    images.forEach((img, idx) => {
      formData.append('images', img);
    });

    try {
      const res = await fetch('/api/admin/available-units', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Unit posted successfully!');
        setTitle('');
        setDescription('');
        setSpecifications('');
        setPrice('');
        setImages([]);
        setImagePreviews([]);
      } else {
        setMessage(data.message || 'Failed to post unit.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="available-unit-container">
      <h2>Post Available Unit</h2>
      <form className="available-unit-form" onSubmit={handleSubmit}>
        <label>
          Title<span className="required">*</span>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          Specifications
          <textarea value={specifications} onChange={e => setSpecifications(e.target.value)} />
        </label>
        <label>
          Price<span className="required">*</span>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" />
        </label>
        <label>
          Images (up to 5)
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </label>
        <div className="image-preview-row">
          {imagePreviews.map((src, idx) => (
            <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="image-preview" />
          ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Unit'}
        </button>
        {message && <div className="form-message">{message}</div>}
      </form>
    </div>
  );
};

export default AvailableUnit;