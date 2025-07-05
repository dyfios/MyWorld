import React, { useState } from 'react';
import axios from 'axios';

function CopyWorldForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'existing-world-id': '',
    name: '',
    description: '',
    owner: '',
    permissions: '',
    'user-id': '',
    'user-token': ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/copy-world', formData);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>📄 Copy World</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input className="form-control" name={key} value={val} onChange={handleChange} />
        </div>
      ))}
      <button className="btn btn-warning">Copy</button>
    </form>
  );
}

export default CopyWorldForm;