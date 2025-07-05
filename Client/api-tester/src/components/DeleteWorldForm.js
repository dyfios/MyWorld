// src/components/DeleteWorldForm.js
import React, { useState } from 'react';
import axios from 'axios';

function DeleteWorldForm({ onResponse }) {
  const [worldId, setWorldId] = useState('');
  const [userId, setUserId] = useState('');
  const [userToken, setUserToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete('http://localhost:4000/delete-world', {
        data: {
          'world-id': worldId,
          'user-id': userId,
          'user-token': userToken
        }
      });
      onResponse({ success: true, data: res.data });
    } catch (err) {
      onResponse({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>🗑️ Delete World</h5>
      <input className="form-control mb-2" placeholder="world-id" value={worldId} onChange={(e) => setWorldId(e.target.value)} />
      <input className="form-control mb-2" placeholder="user-id" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <input className="form-control mb-2" placeholder="user-token" value={userToken} onChange={(e) => setUserToken(e.target.value)} />
      <button className="btn btn-danger">Delete</button>
    </form>
  );
}

export default DeleteWorldForm;