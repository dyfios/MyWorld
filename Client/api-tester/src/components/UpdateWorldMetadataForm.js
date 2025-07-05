import React, { useState } from 'react';
import axios from 'axios';

function UpdateWorldMetadataForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'world-id': '',
    'update-data': '',
    'user-id': '',
    'user-token': ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {console.log("asdfg");
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        'update-data': JSON.parse(formData['update-data']),
      };
      const res = await axios.patch('http://localhost:4000/update-world-metadata', payload);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>🔧 Update World Metadata</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input
            className="form-control"
            name={key}
            value={val}
            onChange={handleChange}
            placeholder={key === 'update-data' ? '{"description":"New desc"}' : ''}
          />
        </div>
      ))}
      <button className="btn btn-secondary">Update</button>
    </form>
  );
}

export default UpdateWorldMetadataForm;