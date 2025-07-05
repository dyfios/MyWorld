import React, { useState } from 'react';
import axios from 'axios';

function CreateEntityInstanceForm({ onResponse }) {
  const [formData, setFormData] = useState({
    'world-id': '',
    'entity-data': '',
    'user-id': '',
    'user-token': ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        'entity-data': JSON.parse(formData['entity-data']),
      };

      const res = await axios.post('http://localhost:4000/create-entity-instance', payload);
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>✨ Create Entity Instance</h5>
      {Object.entries(formData).map(([key, val]) => (
        <div key={key} className="mb-2">
          <label>{key}:</label>
          <input
            className="form-control"
            name={key}
            value={val}
            onChange={handleChange}
            placeholder={key === 'entity-data' ? '{"type":"npc",...}' : ''}
          />
        </div>
      ))}
      <button className="btn btn-primary">Spawn</button>
    </form>
  );
}

export default CreateEntityInstanceForm;