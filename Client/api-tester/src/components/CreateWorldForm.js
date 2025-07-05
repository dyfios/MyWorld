import React, { useState } from 'react';
import axios from 'axios';

function CreateWorldForm({ onResponse }) {
  const [formData, setFormData] = useState({
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
      const res = await axios.post('http://localhost:4000/create-world', formData);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>🏗️ Create World</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input className="form-control" name={key} value={val} onChange={handleChange} />
        </div>
      ))}
      <button className="btn btn-primary">Create World</button>
    </form>
  );
}

export default CreateWorldForm;