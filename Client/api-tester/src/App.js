import React, { useState } from 'react';
import CreateWorldForm from './components/CreateWorldForm';
import ApiResponseViewer from './components/APIResponseViewer';
import DeleteWorldForm from './components/DeleteWorldForm';
import CopyWorldForm from './components/CopyWorldForm';
import AddAssetForm from './components/AddAssetForm';
import RemoveAssetForm from './components/RemoveAssetForm';
import CreateEntityInstanceForm from './components/CreateEntityInstanceForm';
import DeleteEntityInstanceForm from './components/DeleteEntityInstanceForm';
import ListEntityInstancesForm from './components/ListEntityInstancesForm';
import ListEntityTemplatesForm from './components/ListEntityTemplatesForm';
import UpdateWorldMetadataForm from './components/UpdateWorldMetadataForm';
import CreateEntityTemplateForm from './components/CreateEntityTemplateForm';
import DeleteEntityTemplateForm from './components/DeleteEntityTemplateForm';

function App() {
  const [response, setResponse] = useState(null);

  return (
    <div className="container mt-4">
      <h2>🌍 Web Wide Worlds API Tester</h2>
      <CreateWorldForm onResponse={setResponse} />
      <ApiResponseViewer response={response} />
      <DeleteWorldForm onResponse={setResponse} />
      <CopyWorldForm onResponse={setResponse} />
      <AddAssetForm onResponse={setResponse} />
      <RemoveAssetForm onResponse={setResponse} />
      <CreateEntityInstanceForm onResponse={setResponse} />
      <DeleteEntityInstanceForm onResponse={setResponse} />
      <ListEntityInstancesForm onResponse={setResponse} />
      <ListEntityTemplatesForm onResponse={setResponse} />
      <UpdateWorldMetadataForm onResponse={setResponse} />
      <CreateEntityTemplateForm onResponse={setResponse} />
      <DeleteEntityTemplateForm onResponse={setResponse} />
    </div>
  );
}

export default App;