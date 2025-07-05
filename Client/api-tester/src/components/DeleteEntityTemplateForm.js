import React, { useState } from 'react';
import axios from 'axios';

function DeleteEntityTemplateForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'world-id': '',
    'entity-id': '',
    'user-id': '',
    'user-token': ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete('http://localhost:4000/delete-entity-template', {
        data: formData
      });
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>❌ Delete Entity Template</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input className="form-control" name={key} value={val} onChange={handleChange} />
        </div>
      ))}
      <button className="btn btn-danger">Delete</button>
    </form>
  );
}

export default DeleteEntityTemplateForm;