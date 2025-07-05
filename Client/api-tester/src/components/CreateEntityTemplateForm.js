import React, { useState } from 'react';
import axios from 'axios';

function CreateEntityTemplateForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'world-id': '',
    'template-data': '',
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
      const payload = {
        ...formData,
        'template-data': JSON.parse(formData['template-data']),
      };
      const res = await axios.post('http://localhost:4000/create-entity-template', payload);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>🏗️ Create Entity Template</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input
            className="form-control"
            name={key}
            value={val}
            onChange={handleChange}
            placeholder={key === 'template-data' ? '{"entity_tag":"tree",...}' : ''}
          />
        </div>
      ))}
      <button className="btn btn-success">Create</button>
    </form>
  );
}

export default CreateEntityTemplateForm;