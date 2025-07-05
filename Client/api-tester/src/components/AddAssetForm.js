import React, { useState } from 'react';
import axios from 'axios';

function AddAssetForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'world-id': '',
    'file-name': '',
    'user-id': '',
    'user-token': ''
  });
  const [fileBuffer, setFileBuffer] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFileBuffer(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileBuffer) return onResponse({ success: false, error: 'No file selected.' });

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('file-buffer', fileBuffer);

    try {
      const res = await axios.post('http://localhost:4000/add-asset', data);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
      <h5>📁 Add Asset</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input className="form-control" name={key} value={val} onChange={handleChange} />
        </div>
      ))}
      <div className="mb-2">
        <label>file-buffer:</label>
        <input className="form-control" type="file" onChange={handleFileChange} />
      </div>
      <button className="btn btn-success">Upload</button>
    </form>
  );
}

export default AddAssetForm;