import React from 'react';

function ApiResponseViewer({ response }) {
  if (!response) return null;
  return (
    <div>
      <h5>🔍 API Response:</h5>
      <pre style={{ background: '#f4f4f4', padding: '1em' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}

export default ApiResponseViewer;