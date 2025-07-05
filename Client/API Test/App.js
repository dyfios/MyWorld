import React, { useState } from 'react';
import CreateWorldForm from '../api-tester/src/components/CreateWorldForm';
import ApiResponseViewer from '../api-tester/src/components/ApiResponseViewer';

function App() {
  const [response, setResponse] = useState(null);

  return (
    <div className="container mt-4">
      <h2>🌍 Web Wide Worlds API Tester</h2>
      <CreateWorldForm onResponse={setResponse} />
      <ApiResponseViewer response={response} />
    </div>
  );
}

export default App;